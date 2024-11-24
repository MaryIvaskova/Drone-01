import { saveData, loadData } from "../core/database.js"; // Для взаємодії з базою даних (або LocalStorage)

document.addEventListener("DOMContentLoaded", () => {
    const ordersBody = document.getElementById("orders-body");
    const defectBody = document.getElementById("defect-body");
    const orderForm = document.getElementById("order-form");
    const formTitle = document.getElementById("form-title");
    const cancelEditButton = document.getElementById("cancel-edit");
    const selectedOrders = new Set();

    let editingOrderId = null;

    // Завантаження даних із бази даних
    let ordersData = loadData("ordersData", []);
    let defectsData = loadData("defectsData", []);

    // Збереження даних
    const persistData = () => {
        saveData("ordersData", ordersData);
        saveData("defectsData", defectsData);
    };

    // Рендер таблиці замовлень
    const renderOrdersTable = () => {
        ordersBody.innerHTML = "";
        ordersData.forEach((order) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="select-order" data-id="${order.id}"></td>
                <td>${order.orderDate}</td>
                <td>${order.arrivalDate || ""}</td>
                <td>${order.name}</td>
                <td>${order.category || ""}</td>
                <td>${order.description}</td>
                <td>${order.quantity}</td>
                <td>${order.priceUSD || ""}</td>
                <td>${order.deliveryPriceUAH || ""}</td>
                <td>${order.postalService || ""}</td>
                <td><a href="${order.shopLink || "#"}" target="_blank">Посилання</a></td>
                <td><a href="${order.backupLink || "#"}" target="_blank">Запасний</a></td>
                <td>${order.invoiceNumber || ""}</td>
                <td>${order.discount || ""}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn defect-btn" data-id="${order.id}">Брак</button>
                    <button class="btn edit-btn" data-id="${order.id}">Редагувати</button>
                    <button class="btn inventory-btn" data-id="${order.id}">+</button>
                </td>
            `;
            ordersBody.appendChild(row);
        });
    };

    // Рендер таблиці браку
    const renderDefectTable = () => {
        defectBody.innerHTML = "";
        defectsData.forEach((defect) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${defect.orderDate}</td>
                <td>${defect.name}</td>
                <td>${defect.category || ""}</td>
                <td>${defect.description}</td>
                <td>${defect.quantity}</td>
                <td>${defect.note || "—"}</td>
            `;
            defectBody.appendChild(row);
        });
    };

    // Обробка додавання в брак
    const handleDefect = () => {
        if (selectedOrders.size === 0) {
            alert("Будь ласка, виберіть хоча б одне замовлення для браку.");
            return;
        }

        selectedOrders.forEach((id) => {
            const orderIndex = ordersData.findIndex(order => order.id === id);
            if (orderIndex !== -1) {
                const order = ordersData[orderIndex];
                const defectCount = prompt(`Скільки одиниць з ${order.quantity} є бракованими для "${order.name}"?`, "0");
                if (defectCount === null) return; // Користувач натиснув "Cancel"
                
                const defectQuantity = parseInt(defectCount, 10);

                if (!isNaN(defectQuantity) && defectQuantity > 0 && defectQuantity <= order.quantity) {
                    // Додаємо браковані дані
                    defectsData.push({
                        ...order,
                        quantity: defectQuantity,
                        note: `Брак для "${order.name}"`
                    });

                    // Оновлюємо залишок у замовленнях
                    order.quantity -= defectQuantity;

                    // Якщо кількість = 0, видаляємо з таблиці замовлень
                    if (order.quantity === 0) {
                        ordersData.splice(orderIndex, 1);
                    }
                } else {
                    alert(`Некоректна кількість для "${order.name}".`);
                }
            }
        });

        selectedOrders.clear(); // Очищаємо вибір
        document.querySelectorAll(".select-order:checked").forEach((checkbox) => {
            checkbox.checked = false;
        });

        persistData();
        renderOrdersTable();
        renderDefectTable();
    };

    // Додавання/Редагування замовлення
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newOrder = {
            id: editingOrderId || Date.now(),
            orderDate: document.getElementById("order-date").value,
            arrivalDate: document.getElementById("arrival-date").value,
            name: document.getElementById("order-name").value,
            description: document.getElementById("order-description").value,
            category: document.getElementById("order-category").value || "Інше",
            quantity: parseInt(document.getElementById("order-quantity").value, 10),
            priceUSD: parseFloat(document.getElementById("order-price").value),
            deliveryPriceUAH: parseFloat(document.getElementById("order-delivery-price").value) || 0,
            postalService: document.getElementById("postal-service").value,
            shopLink: document.getElementById("shop-link").value || "",
            backupLink: document.getElementById("backup-link").value || "",
            invoiceNumber: document.getElementById("invoice-number").value || "",
            discount: document.getElementById("discount").value || "",
            status: "В дорозі"
        };

        if (editingOrderId) {
            const index = ordersData.findIndex(order => order.id === editingOrderId);
            if (index !== -1) ordersData[index] = newOrder;
            editingOrderId = null;
            formTitle.textContent = "Додати нове замовлення";
        } else {
            ordersData.push(newOrder);
        }

        persistData();
        renderOrdersTable();
        orderForm.reset();
    });

    renderOrdersTable();
    renderDefectTable();
});