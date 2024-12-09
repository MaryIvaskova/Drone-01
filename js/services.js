document.addEventListener("DOMContentLoaded", () => {
    const readyDronesKey = "ready-drones";
    const servicesKey = "services";

    const serviceForm = document.getElementById("service-form");
    const serviceDroneSelect = document.getElementById("service-drone");
    const servicesTable = document.getElementById("services-table");

    // Завантаження готових дронів у випадаючий список
    function loadReadyDrones() {
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        serviceDroneSelect.innerHTML = readyDrones.map(drone => `
            <option value="${drone.name}">${drone.name}</option>
        `).join("");
    }

    // Завантаження послуг із LocalStorage
    function loadServices() {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        renderServicesTable(services);
    }

    // Рендеринг таблиці послуг
    function renderServicesTable(services) {
        servicesTable.innerHTML = services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.droneModel}</td>
                <td>${service.serviceName}</td>
                <td>${service.serviceCost} грн</td>
                <td>${new Date(service.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService(${index})">Редагувати</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Збереження послуги в LocalStorage
    function saveService(service) {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        services.push(service);
        localStorage.setItem(servicesKey, JSON.stringify(services));
        loadServices();
    }

    // Обробка додавання послуги
    serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newService = {
            droneModel: serviceDroneSelect.value,
            serviceName: document.getElementById("service-name").value,
            serviceCost: parseFloat(document.getElementById("service-cost").value),
            date: new Date().toISOString(),
        };

        saveService(newService);
        serviceForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("serviceModal")).hide();
    });

    // Видалення послуги
    window.deleteService = function (index) {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        services.splice(index, 1);
        localStorage.setItem(servicesKey, JSON.stringify(services));
        loadServices();
    };

    // Редагування послуги
    window.editService = function (index) {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        const service = services[index];

        serviceDroneSelect.value = service.droneModel;
        document.getElementById("service-name").value = service.serviceName;
        document.getElementById("service-cost").value = service.serviceCost;

        services.splice(index, 1);
        localStorage.setItem(servicesKey, JSON.stringify(services));
        loadServices();

        bootstrap.Modal.getInstance(document.getElementById("serviceModal")).show();
    };

    // Ініціалізація
    loadReadyDrones();
    loadServices();
});