document.addEventListener("DOMContentLoaded", () => {
    const readyDronesKey = "readyDrones";
    const inventoryKey = "inventory";
    const dronesTableBody = document.getElementById("ready-drones-table").querySelector("tbody");
    const droneForm = document.getElementById("drone-form");
    const dronePhotoInput = document.getElementById("drone-photo");
    const servicesSelect = document.getElementById("drone-services");
    const componentsAccordion = document.getElementById("componentsAccordion");
    const selectedComponentsList = document.getElementById("selected-components");
    const totalPriceDisplay = document.getElementById("total-price");

    let selectedComponents = [];
    let totalPrice = 0;

    // Завантаження готових дронів
    function renderDrones() {
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        dronesTableBody.innerHTML = readyDrones.map((drone, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${drone.name}</td>
                <td>${drone.components.join(", ")}</td>
                <td>${drone.price} грн</td>
                <td>${drone.services.join(", ")}</td>
                <td>${drone.description || "—"}</td>
                <td>${drone.photo ? `<img src="${drone.photo}" alt="Фото" width="50">` : "—"}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editDrone(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDrone(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Додавання компоненту
    window.addComponent = function (id, name, price) {
        const existingComponent = selectedComponents.find(comp => comp.id === id);

        if (existingComponent) {
            existingComponent.quantity += 1;
        } else {
            selectedComponents.push({ id, name, price, quantity: 1 });
        }

        updateSelectedComponents();
    };

    // Видалення компоненту
    window.removeComponent = function (id) {
        selectedComponents = selectedComponents.filter(comp => comp.id !== id);
        updateSelectedComponents();
    };

    // Оновлення вибраних компонентів
    function updateSelectedComponents() {
        selectedComponentsList.innerHTML = selectedComponents.map(comp => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${comp.name} x${comp.quantity}
                <button class="btn btn-sm btn-danger" onclick="removeComponent('${comp.id}')">Видалити</button>
            </li>
        `).join("");

        totalPrice = selectedComponents.reduce((sum, comp) => sum + comp.price * comp.quantity, 0);
        totalPriceDisplay.textContent = `${totalPrice} грн`;
    }

    // Збереження нового дрону
    droneForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const photoFile = dronePhotoInput.files[0];
        const photoUrl = photoFile ? URL.createObjectURL(photoFile) : null;

        const newDrone = {
            name: droneForm.elements["drone-name"].value,
            components: selectedComponents.map(comp => comp.name),
            price: totalPrice,
            services: Array.from(servicesSelect.selectedOptions).map(option => option.value),
            description: droneDescriptionInput.value,
            photo: photoUrl
        };

        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        readyDrones.push(newDrone);
        localStorage.setItem(readyDronesKey, JSON.stringify(readyDrones));

        selectedComponents = [];
        totalPrice = 0;
        updateSelectedComponents();
        renderDrones();

        bootstrap.Modal.getInstance(document.getElementById("droneModal")).hide();
    });

    // Видалення дрону
    window.deleteDrone = function (index) {
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        readyDrones.splice(index, 1);
        localStorage.setItem(readyDronesKey, JSON.stringify(readyDrones));
        renderDrones();
    };

    // Редагування дрону
    window.editDrone = function (index) {
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        const drone = readyDrones[index];

        droneForm.elements["drone-name"].value = drone.name;
        droneForm.elements["drone-description"].value = drone.description || "";
        drone.services.forEach(service => {
            const option = Array.from(servicesSelect.options).find(opt => opt.value === service);
            if (option) option.selected = true;
        });

        selectedComponents = drone.components.map(name => ({
            id: name,
            name,
            price: 0, // Потрібно оновити відповідно до інвентарю
            quantity: 1
        }));

        totalPrice = drone.price;
        updateSelectedComponents();

        readyDrones.splice(index, 1);
        localStorage.setItem(readyDronesKey, JSON.stringify(readyDrones));
        renderDrones();

        bootstrap.Modal.getInstance(document.getElementById("droneModal")).show();
    };

    // Завантаження компонентів та послуг
    function loadComponentsAndServices() {
        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        const groupedComponents = inventory.reduce((groups, item) => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
            return groups;
        }, {});

        componentsAccordion.innerHTML = Object.entries(groupedComponents).map(([category, items]) => `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${category}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${category}">
                        ${category}
                    </button>
                </h2>
                <div id="collapse-${category}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        ${items.map(item => `
                            <div class="d-flex justify-content-between">
                                <span>${item.name} (${item.quantity} шт)</span>
                                <button class="btn btn-sm btn-success" onclick="addComponent('${item.id}', '${item.name}', ${item.priceUAH})">Додати</button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `).join("");

        const services = JSON.parse(localStorage.getItem("services")) || [];
        servicesSelect.innerHTML = services.map(service => `
            <option value="${service.serviceName}">${service.serviceName} (${service.costUAH} грн)</option>
        `).join("");
    }

    // Ініціалізація
    renderDrones();
    loadComponentsAndServices();
});