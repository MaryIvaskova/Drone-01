document.addEventListener("DOMContentLoaded", () => {
    const currentOrdersList = document.getElementById("current-orders");
    const statusItemsList = document.getElementById("status-items");
    const lowStockAlertsList = document.getElementById("low-stock-alerts");

    // Imitating data from JSON
    const needsData = [
        { name: "Дрон 1", addedDate: "2024-11-24", recipient: "Клієнт 1" },
        { name: "Дрон 2", addedDate: "2024-11-23", recipient: "Клієнт 2" },
    ];

    const ordersData = [
        { name: "Мотор", status: "В дорозі" },
        { name: "Камера", status: "Прибуло" },
    ];

    const inventoryData = [
        { name: "Батарея", quantity: 2 },
        { name: "Рама", quantity: 10 },
    ];

    // Update "Актуальні замовлення"
    const today = new Date().toISOString().split("T")[0];
    needsData
        .filter((need) => need.addedDate === today)
        .forEach((need) => {
            const li = document.createElement("li");
            li.textContent = `${need.name} для ${need.recipient}`;
            currentOrdersList.appendChild(li);
        });

    // Update "Елементи зі статусом"
    ordersData.forEach((order) => {
        const li = document.createElement("li");
        li.textContent = `${order.name} (${order.status})`;
        statusItemsList.appendChild(li);
    });

    // Update "Сповіщення"
    inventoryData
        .filter((item) => item.quantity <= 5)
        .forEach((item) => {
            const li = document.createElement("li");
            li.textContent = `Низький запас: ${item.name} (${item.quantity} шт.)`;
            lowStockAlertsList.appendChild(li);
        });
});