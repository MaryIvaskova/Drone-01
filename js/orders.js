document.addEventListener("DOMContentLoaded", async () => {
    const ordersKey = "orders";
    const defectsKey = "defects";
    const inventoryKey = "inventory";
    const categoriesUrl = "./data/categories.json";
    const suppliersKey = "suppliers";

    const ordersTable = document.getElementById("orders-table");
    const defectsTable = document.getElementById("defects-table");
    const orderForm = document.getElementById("order-form");
    const categoryDropdown = document.getElementById("order-category");
    const supplierDropdown = document.getElementById("order-supplier");
    const priceInput = document.getElementById("order-price");
    const currencyDropdown = document.getElementById("currency");

    const exchangeRate = 38; // Фіксований курс (UAH за 1 USD)

    // Завантаження категорій
    async function loadCategories() {
        try {
            const response = await fetch(categoriesUrl);
            const categories = await response.json();
            categoryDropdown.innerHTML = categories.map(category => `
                <option value="${category}">${category}</option>
            `).join("");
        } catch (error) {
            console.error("Помилка завантаження категорій:", error);
        }
    }

    // Завантаження постачальників
    function loadSuppliers() {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        supplierDropdown.innerHTML = suppliers.map(supplier => `
            <option value="${supplier.name}">${supplier.name}</option>
        `).join("");
    }

    // Оновлення таблиці замовлень
    function renderOrders() {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        ordersTable.innerHTML = orders.map((order, index) => `
            <tr>
                <td>${order.name}</td>
                <td>${order.invoice || "—"}</td>
                <td>${order.deliveryService}</td>
                <td>${order.quantity}</td>
                <td>${order.category}</td>
                <td>${order.priceUAH} грн</td>
                <td>${(order.priceUAH / exchangeRate).toFixed(2)} $</td>
                <td>${order.deliveryPrice || "—"} грн</td>
                <td>${order.supplier}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateOrderStatus(${index}, this.value)">
                        <option value="В дорозі" ${order.status === "В дорозі" ? "selected" : ""}>В дорозі</option>
                        <option value="У пункті видачі" ${order.status === "У пункті видачі" ? "selected" : ""}>У пункті видачі</option>
                        <option value="Отримано" ${order.status === "Отримано" ? "selected" : ""}>Отримано</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editOrder(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-success" onclick="moveToInventory(${index})">У Інвентар</button>
                    <button class="btn btn-sm btn-danger" onclick="moveToDefects(${index})">До Браку</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteOrder(${index})">Видалити</button>
                    </td>
            </tr>
        `).join("");
    }
    window.editOrder = function (index) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const order = orders[index];
    
        // Заповнюємо форму
        const form = document.getElementById("order-form");
        form.elements["order-name"].value = order.name;
        form.elements["order-invoice"].value = order.invoice;
        form.elements["delivery-service"].value = order.deliveryService;
        form.elements["order-quantity"].value = order.quantity;
        form.elements["order-category"].value = order.category;
        form.elements["order-price"].value = order.priceUAH;
        form.elements["delivery-price"].value = order.deliveryPrice;
        form.elements["order-supplier"].value = order.supplier;
    
        // Видаляємо замовлення для редагування
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        renderOrders();
    
        bootstrap.Modal.getInstance(document.getElementById("orderModal")).show();
    };
    // Оновлення таблиці браку
    function renderDefects() {
        const defects = JSON.parse(localStorage.getItem(defectsKey)) || [];
        defectsTable.innerHTML = defects.map((defect, index) => `
            <tr>
                <td>${defect.name}</td>
                <td>${defect.quantity}</td>
                <td>${defect.category}</td>
                <td>${defect.priceUAH} грн</td>
                <td>${(defect.priceUAH / exchangeRate).toFixed(2)} $</td>
                <td>${defect.reason || "—"}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editDefect(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDefect(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Додавання замовлення
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newOrder = {
            name: orderForm.elements["order-name"].value,
            invoice: orderForm.elements["order-invoice"].value,
            deliveryService: orderForm.elements["delivery-service"].value,
            quantity: parseInt(orderForm.elements["order-quantity"].value),
            category: orderForm.elements["order-category"].value,
            priceUAH: parseFloat(orderForm.elements["order-price"].value),
            deliveryPrice: parseFloat(orderForm.elements["delivery-price"].value),
            supplier: orderForm.elements["order-supplier"].value,
            status: "В дорозі"
        };

        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        orders.push(newOrder);
        localStorage.setItem(ordersKey, JSON.stringify(orders));

        renderOrders();
        orderForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
    });

    // Редагування замовлення
    window.editOrder = function (index) {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        const order = orders[index];

        orderForm.elements["order-name"].value = order.name;
        orderForm.elements["order-invoice"].value = order.invoice;
        orderForm.elements["delivery-service"].value = order.deliveryService;
        orderForm.elements["order-quantity"].value = order.quantity;
        orderForm.elements["order-category"].value = order.category;
        orderForm.elements["order-price"].value = order.priceUAH;
        orderForm.elements["delivery-price"].value = order.deliveryPrice;
        orderForm.elements["order-supplier"].value = order.supplier;

        orders.splice(index, 1);
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        renderOrders();
    };

    // Перенесення замовлення до інвентарю
    window.moveToInventory = function (index) {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        const inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        const order = orders.splice(index, 1)[0];

        inventory.push({
            name: order.name,
            category: order.category,
            quantity: order.quantity,
            price: order.priceUAH,
            supplier: order.supplier
        });

        localStorage.setItem(ordersKey, JSON.stringify(orders));
        localStorage.setItem(inventoryKey, JSON.stringify(inventory));
        renderOrders();
    };

    // Перенесення до браку
    window.moveToDefects = function (index) {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        const defects = JSON.parse(localStorage.getItem(defectsKey)) || [];
        const order = orders[index];
        const defectQuantity = parseInt(prompt(`Введіть кількість для браку (макс ${order.quantity}):`, "1"));
        if (isNaN(defectQuantity) || defectQuantity <= 0 || defectQuantity > order.quantity) {
            alert("Некоректна кількість для браку!");
            return;
        }
        const defect = {
            name: order.name,
            category: order.category,
            quantity: defectQuantity,
            priceUAH: ((order.priceUAH / order.quantity) * defectQuantity).toFixed(2),
            reason: prompt("Вкажіть причину браку:", "—")
        };
        defects.push(defect);
        order.quantity -= defectQuantity;
        if (order.quantity === 0) {
            orders.splice(index, 1);
        }
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        localStorage.setItem(defectsKey, JSON.stringify(defects));
        renderOrders();
        renderDefects();
    };
 // Видалення замовлення
 window.deleteOrder = function (index) {
    const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    orders.splice(index, 1);
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    renderOrders();
};

    // Видалення дефекту
    window.deleteDefect = function (index) {
        const defects = JSON.parse(localStorage.getItem(defectsKey)) || [];
        defects.splice(index, 1);
        localStorage.setItem(defectsKey, JSON.stringify(defects));
        renderDefects();
    };

    // Оновлення статусу замовлення
    window.updateOrderStatus = function (index, status) {
        const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        orders[index].status = status;
        localStorage.setItem(ordersKey, JSON.stringify(orders));
    };

    // Ініціалізація
    await loadCategories();
    loadSuppliers();
    renderOrders();
    renderDefects();
});