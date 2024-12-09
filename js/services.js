document.addEventListener("DOMContentLoaded", () => {
    const servicesKey = "services";
    const servicesTableBody = document.getElementById("services-table-body");
    const serviceForm = document.getElementById("service-form");
    const serviceModal = new bootstrap.Modal(document.getElementById("serviceModal"));

    // Відображення послуг у таблиці
    function renderServices() {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        servicesTableBody.innerHTML = services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.droneName}</td>
                <td>${service.serviceName}</td>
                <td>${service.costUAH} грн</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editService(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteService(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Додавання/оновлення послуги
    serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        const newService = {
            droneName: serviceForm.elements["drone-name"].value,
            serviceName: serviceForm.elements["service-name"].value,
            costUAH: parseFloat(serviceForm.elements["service-cost"].value)
        };

        if (serviceForm.dataset.editIndex) {
            const index = parseInt(serviceForm.dataset.editIndex);
            services[index] = newService;
            delete serviceForm.dataset.editIndex;
        } else {
            services.push(newService);
        }

        localStorage.setItem(servicesKey, JSON.stringify(services));
        renderServices();
        serviceForm.reset();
        serviceModal.hide();
    });

    // Редагування послуги
    window.editService = function (index) {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        const service = services[index];

        serviceForm.elements["drone-name"].value = service.droneName;
        serviceForm.elements["service-name"].value = service.serviceName;
        serviceForm.elements["service-cost"].value = service.costUAH;

        serviceForm.dataset.editIndex = index;
        serviceModal.show();
    };

    // Видалення послуги
    window.deleteService = function (index) {
        const services = JSON.parse(localStorage.getItem(servicesKey)) || [];
        services.splice(index, 1);
        localStorage.setItem(servicesKey, JSON.stringify(services));
        renderServices();
    };

    // Ініціалізація
    renderServices();
});