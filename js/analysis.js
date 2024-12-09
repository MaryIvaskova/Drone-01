document.addEventListener("DOMContentLoaded", () => {
    const dronesKey = "drones";
    const dronesList = document.getElementById("drones-list");
    const comparisonSlots = document.querySelectorAll(".comparison-slot");

    // Завантаження дронів із LocalStorage
    function loadDrones() {
        const drones = JSON.parse(localStorage.getItem(dronesKey)) || [];
        dronesList.innerHTML = drones.map((drone, index) => `
            <div class="card text-bg-dark p-3" draggable="true" data-index="${index}">
                <h5 class="card-title">${drone.model}</h5>
                <p class="card-text">Загальна вартість: ${drone.totalCost} грн</p>
                <p class="card-text">Компоненти: ${drone.components.map(c => c.name).join(", ")}</p>
            </div>
        `).join("");
    }

    // Обробка перетягування
    function setupDragAndDrop() {
        const cards = dronesList.querySelectorAll(".card");

        // Початок перетягування
        cards.forEach(card => {
            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", card.dataset.index);
            });
        });

        // Обробка перетягування в слоти
        comparisonSlots.forEach(slot => {
            slot.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            slot.addEventListener("drop", (e) => {
                e.preventDefault();
                const index = e.dataTransfer.getData("text/plain");
                addDroneToSlot(index, slot);
            });
        });
    }

    // Додавання дрона до слоту
    function addDroneToSlot(index, slot) {
        const drones = JSON.parse(localStorage.getItem(dronesKey)) || [];
        const drone = drones[index];

        slot.innerHTML = `
            <h5>${drone.model}</h5>
            <p>Загальна вартість: ${drone.totalCost} грн</p>
            <ul>
                ${drone.components.map(c => `<li>${c.name} (${c.quantity} шт.)</li>`).join("")}
            </ul>
        `;
    }

    // Ініціалізація
    loadDrones();
    setupDragAndDrop();
});