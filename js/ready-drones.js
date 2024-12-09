document.addEventListener("DOMContentLoaded", () => {
    const inventoryKey = "inventory";
    const dronesKey = "ready-drones";
    const servicesKey = "services";
    const analysisKey = "analysis";

    const componentsAccordion = document.getElementById("componentsAccordion");
    const selectedComponentsList = document.getElementById("selected-components");
    const totalPriceDisplay = document.getElementById("total-price");
    const servicesSelect = document.getElementById("drone-services");
    const droneForm = document.getElementById("drone-form");
    const dronePhotoInput = document.getElementById("drone-photo");

    let selectedComponents = [];
    let totalPrice = 0;

    // Завантаження компонентів із інвентарю
    function loadComponents() {
        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];

        const groupedComponents = inventory.reduce((groups, item) => {
            if (!groups[item.category]) {
                groups[item.category] = [];
            }
            groups[item.category].push(item);
            return groups;
        }, {});

        componentsAccordion.innerHTML = Object.entries(groupedComponents)
            .map(([category, items]) => `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${category}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${category}" aria-expanded="false" aria-controls="collapse-${category}">
                            ${category}
                        </button>
                    </h2>
                    <div id="collapse-${category}" class="accordion-collapse collapse" aria-labelledby="heading-${category}" data-bs-parent="#componentsAccordion">
                        <div class="accordion-body">
                            ${items.map(item => `
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span>${item.name} (${item.quantity} шт)</span>
                                    <button class="btn btn-sm btn-success" onclick="addComponent('${item.id}', '${item.name}', ${item.price})">Додати</button>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            `).join("");
    }

    // Завантаження послуг
    function loadServices() {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        servicesSelect.innerHTML = services.map(service => `
            <option value="${service.name}">
                ${service.name} (${service.price} грн)
            </option>
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

    // Оновлення списку обраних компонентів
    function updateSelectedComponents() {
        selectedComponentsList.innerHTML = selectedComponents.map(comp => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${comp.name} x${comp.quantity}
                <button class="btn btn-sm btn-danger" onclick="removeComponent('${comp.id}')">Видалити</button>
            </li>
        `).join("");

        totalPrice = selectedComponents.reduce((sum, comp) => sum + comp.price * comp.quantity, 0);
        totalPriceDisplay.textContent = totalPrice;
    }

    // Збереження дрону
    droneForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        selectedComponents.forEach(comp => {
            const item = inventory.find(item => item.id === comp.id);
            if (item) {
                item.quantity -= comp.quantity;
                if (item.quantity <= 0) {
                    inventory.splice(inventory.indexOf(item), 1);
                }
            }
        });
        localStorage.setItem(inventoryKey, JSON.stringify(inventory));

        const photoFile = dronePhotoInput.files[0];
        const photoUrl = photoFile ? URL.createObjectURL(photoFile) : null;

        const newDrone = {
            name: droneForm.elements["drone-name"].value,
            components: selectedComponents.map(comp => comp.name),
            price: totalPrice,
            services: Array.from(servicesSelect.selectedOptions).map(option => option.value),
            photo: photoUrl
        };

        const drones = JSON.parse(localStorage.getItem(dronesKey)) || [];
        drones.push(newDrone);
        localStorage.setItem(dronesKey, JSON.stringify(drones));

        // Передача в аналіз
        const analysis = JSON.parse(localStorage.getItem(analysisKey)) || [];
        analysis.push({ name: newDrone.name, price: newDrone.price });
        localStorage.setItem(analysisKey, JSON.stringify(analysis));

        selectedComponents = [];
        totalPrice = 0;
        updateSelectedComponents();
        loadComponents();

        bootstrap.Modal.getInstance(document.getElementById("droneModal")).hide();
    });

    // Ініціалізація
    loadComponents();
    loadServices();
});