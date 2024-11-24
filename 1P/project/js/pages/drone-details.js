document.addEventListener("DOMContentLoaded", () => {
    // Масив для збереження даних дронів
    let dronesData = [];

    // Елементи DOM
    const dronesTable = document.getElementById("drones-table-body");
    const droneForm = document.getElementById("drone-form");
    const formTitle = document.getElementById("form-title");
    const saveButton = document.getElementById("save-button");
    const cancelEditButton = document.getElementById("cancel-edit-button");

    let editingDroneIndex = null;

    // Рендеринг таблиці дронів
    const renderDronesTable = () => {
        dronesTable.innerHTML = "";

        dronesData.forEach((drone, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${drone.name || "—"}</td>
                <td>${drone.description || "—"}</td>
                <td>
                    ${drone.components.map(c => `${c.name} (${c.price} UAH)`).join(", ") || "—"}
                </td>
                <td>${calculateCost(drone.components)} UAH</td>
                <td>${drone.deadline || "—"}</td>
                <td>
                    <button class="edit-drone-btn" data-index="${index}">Редагувати</button>
                    <button class="delete-drone-btn" data-index="${index}">Видалити</button>
                </td>
            `;
            dronesTable.appendChild(row);
        });
    };

    // Обчислення собівартості
    const calculateCost = (components) => {
        return components.reduce((total, component) => total + component.price, 0);
    };

    // Очищення форми
    const clearForm = () => {
        document.getElementById("drone-name").value = "";
        document.getElementById("drone-description").value = "";
        document.getElementById("drone-components").value = "";
        document.getElementById("drone-deadline").value = "";
    };

    // Додавання або редагування дрону
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const name = document.getElementById("drone-name").value.trim();
        const description = document.getElementById("drone-description").value.trim();
        const componentsInput = document.getElementById("drone-components").value.trim();
        const deadline = document.getElementById("drone-deadline").value;

        const components = componentsInput
            ? componentsInput.split(",").map(comp => {
                  const [name, price] = comp.split(":").map(str => str.trim());
                  return { name, price: parseFloat(price) || 0 };
              })
            : [];

        const newDrone = { name, description, components, deadline };

        if (editingDroneIndex !== null) {
            dronesData[editingDroneIndex] = newDrone;
            editingDroneIndex = null;
            formTitle.textContent = "Додати новий дрон";
            saveButton.textContent = "Зберегти";
            cancelEditButton.classList.add("hidden");
        } else {
            dronesData.push(newDrone);
        }

        clearForm();
        renderDronesTable();
    };

    // Обробка редагування дрону
    const handleEditDrone = (index) => {
        const drone = dronesData[index];

        document.getElementById("drone-name").value = drone.name || "";
        document.getElementById("drone-description").value = drone.description || "";
        document.getElementById("drone-components").value = drone.components
            .map(c => `${c.name}:${c.price}`)
            .join(", ");
        document.getElementById("drone-deadline").value = drone.deadline || "";

        editingDroneIndex = index;
        formTitle.textContent = "Редагувати дрон";
        saveButton.textContent = "Оновити";
        cancelEditButton.classList.remove("hidden");
    };

    // Обробка видалення дрону
    const handleDeleteDrone = (index) => {
        if (confirm("Ви впевнені, що хочете видалити цей дрон?")) {
            dronesData.splice(index, 1);
            renderDronesTable();
        }
    };

    // Скасування редагування
    cancelEditButton.addEventListener("click", () => {
        editingDroneIndex = null;
        clearForm();
        formTitle.textContent = "Додати новий дрон";
        saveButton.textContent = "Зберегти";
        cancelEditButton.classList.add("hidden");
    });

    // Обробка подій
    droneForm.addEventListener("submit", handleFormSubmit);

    dronesTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-drone-btn")) {
            const index = event.target.dataset.index;
            handleEditDrone(index);
        }

        if (event.target.classList.contains("delete-drone-btn")) {
            const index = event.target.dataset.index;
            handleDeleteDrone(index);
        }
    });

    // Початковий рендер
    renderDronesTable();
});