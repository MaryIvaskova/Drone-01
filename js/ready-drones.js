document.addEventListener("DOMContentLoaded", () => {
    const readyDronesKey = "ready-drones";
    const inventoryKey = "inventory";
    const servicesKey = "services";

    const droneForm = document.getElementById("drone-form");
    const readyDronesTable = document.getElementById("ready-drones-table");
    const componentsSelect = document.getElementById("drone-components");
    const servicesSelect = document.getElementById("drone-services");

    // Завантаження компонентів із інвентарю
    function loadComponents() {
        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        const categorizedComponents = inventory.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});

        componentsSelect.innerHTML = Object.entries(categorizedComponents).map(([category, items]) => `
            <optgroup label="${category}">
                ${items.map(item => `<option value="${item.id}" data-name="${item.name}" data-price="${item.price}">${item.name} (${item.quantity})</option>`).join("")}
            </optgroup>
        `).join("");
    }

    // Завантаження послуг
    function loadServices() {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        servicesSelect.innerHTML = services.map(service => `
            <option value="${service.name}" data-cost="${service.cost}">${service.name} (${service.cost} грн)</option>
        `).join("");
    }

    // Рендеринг таблиці дронів
    function renderReadyDrones() {
        const drones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        readyDronesTable.innerHTML = drones.map((drone, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${drone.model}</td>
                <td>${drone.components.map(comp => comp.name).join(", ")}</td>
                <td>${drone.services.map(service => service.name).join(", ")}</td>
                <td>${drone.cost} грн</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editDrone(${index})">Редагувати</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDrone(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Додавання нового дрона
    droneForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedComponents = Array.from(componentsSelect.selectedOptions).map(opt => ({
            id: opt.value,
            name: opt.dataset.name,
            price: parseFloat(opt.dataset.price),
        }));

        const selectedServices = Array.from(servicesSelect.selectedOptions).map(opt => ({
            name: opt.value,
            cost: parseFloat(opt.dataset.cost),
        }));

        const newDrone = {
            model: document.getElementById("drone-model").value,
            components: selectedComponents,
            services: selectedServices,
            cost: selectedComponents.reduce((sum, comp) => sum + comp.price, 0) + selectedServices.reduce((sum, svc) => sum + svc.cost, 0),
        };

        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        selectedComponents.forEach(comp => {
            const item = inventory.find(i => i.id === comp.id);
            if (item) item.quantity -= 1; // Зменшуємо кількість в інвентарі
        });

        localStorage.setItem(inventoryKey, JSON.stringify(inventory));
        const drones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        drones.push(newDrone);
        localStorage.setItem(readyDronesKey, JSON.stringify(drones));

        loadComponents(); // Оновлюємо компоненти в модальній формі
        renderReadyDrones();
        droneForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("droneModal")).hide();
    });

    // Ініціалізація
    loadComponents();
    loadServices();
    renderReadyDrones();
});