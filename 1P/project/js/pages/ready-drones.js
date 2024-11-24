// DOM Elements
const dronesBody = document.getElementById("drones-body");
const showFormBtn = document.getElementById("show-form-btn");
const addDroneForm = document.getElementById("add-drone-form");
const droneForm = document.getElementById("drone-form");
const cancelFormBtn = document.getElementById("cancel-form");
const droneComponentsSelect = document.getElementById("drone-components");

// Масив даних
let dronesData = [];
let inventoryData = [];

// Завантаження даних із LocalStorage
const loadDrones = () => {
    const savedData = localStorage.getItem("dronesData");
    const inventorySavedData = localStorage.getItem("inventoryData");

    if (savedData) dronesData = JSON.parse(savedData);
    if (inventorySavedData) inventoryData = JSON.parse(inventorySavedData);

    renderDronesTable();
    populateComponentsSelect();
};

// Збереження даних у LocalStorage
const saveDrones = () => {
    localStorage.setItem("dronesData", JSON.stringify(dronesData));
};

// Заповнення компонентів у формі
const populateComponentsSelect = () => {
    droneComponentsSelect.innerHTML = "";
    inventoryData.forEach(component => {
        const option = document.createElement("option");
        option.value = component.id;
        option.textContent = `${component.name} (${component.quantity})`;
        droneComponentsSelect.appendChild(option);
    });
};

// Рендеринг таблиці
const renderDronesTable = () => {
    dronesBody.innerHTML = ""; // Очищення таблиці
    dronesData.forEach((drone, index) => {
        const componentsList = drone.components
            .map(comp => inventoryData.find(item => item.id === comp)?.name || "—")
            .join(", ");
        const photo = drone.photo ? `<img src="${drone.photo}" alt="${drone.name}" width="50">` : "—";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${drone.name}</td>
            <td>${drone.description}</td>
            <td>${componentsList}</td>
            <td>${drone.cost.toFixed(2)} UAH</td>
            <td>${drone.completionDate}</td>
            <td>${photo}</td>
            <td>
                <button class="btn edit-btn" data-index="${index}">Редагувати</button>
                <button class="btn delete-btn" data-index="${index}">Видалити</button>
            </td>
        `;
        dronesBody.appendChild(row);
    });
};

// Додавання нового дрона
const addDrone = (event) => {
    event.preventDefault();

    const name = document.getElementById("drone-name").value.trim();
    const description = document.getElementById("drone-description").value.trim();
    const components = Array.from(droneComponentsSelect.selectedOptions).map(option => option.value);
    const completionDate = document.getElementById("completion-date").value;
    const photoFile = document.getElementById("drone-photo").files[0];
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : null;

    // Розрахунок собівартості
    const cost = components.reduce((total, compId) => {
        const component = inventoryData.find(item => item.id === compId);
        return component ? total + component.price : total;
    }, 0);

    const newDrone = {
        name,
        description,
        components,
        cost,
        completionDate,
        photo: photoUrl
    };

    dronesData.push(newDrone);
    saveDrones();
    renderDronesTable();
    toggleForm();
};

// Видалення дрона
const deleteDrone = (index) => {
    dronesData.splice(index, 1);
    saveDrones();
    renderDronesTable();
};

// Відкриття/закриття форми
const toggleForm = () => {
    addDroneForm.classList.toggle("hidden");
    droneForm.reset();
};

// Події
showFormBtn.addEventListener("click", toggleForm);
cancelFormBtn.addEventListener("click", toggleForm);
droneForm.addEventListener("submit", addDrone);
dronesBody.addEventListener("click", (event) => {
    const index = event.target.dataset.index;
    if (event.target.classList.contains("delete-btn")) {
        deleteDrone(index);
    }
});

// Ініціалізація
loadDrones();