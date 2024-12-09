document.addEventListener("DOMContentLoaded", () => {
    const ordersKey = "orders";
    const readyDronesKey = "ready-drones";
    const inventoryKey = "inventory";

    const orderCountEl = document.getElementById("order-count");
    const readyDronesCountEl = document.getElementById("ready-drones-count");
    const lowInventoryCountEl = document.getElementById("low-inventory-count");
    const dronesContainer = document.getElementById("drones-container");

    // Завантаження статистики
    function loadStatistics() {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];

        orderCountEl.textContent = `Всього замовлень: ${orders.length}`;
        readyDronesCountEl.textContent = `Готових дронів: ${readyDrones.length}`;
        const lowInventoryCount = inventory.filter(item => item.quantity <= 5).length;
        lowInventoryCountEl.textContent = `Низький запас: ${lowInventoryCount}`;
    }

    // Завантаження готових дронів
    function loadReadyDrones() {
        const readyDrones = JSON.parse(localStorage.getItem(readyDronesKey)) || [];
        dronesContainer.innerHTML = readyDrones.map(drone => `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${drone.name}</h5>
                        <p class="card-text">Ціна: ${drone.price} грн</p>
                        <p class="card-text">Складові: ${drone.components.join(", ")}</p>
                        <p class="card-text">Послуги: ${drone.services.join(", ")}</p>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Ініціалізація
    loadStatistics();
    loadReadyDrones();
});