document.addEventListener("DOMContentLoaded", async () => {
    const inventoryTableBody = document.getElementById("inventory-table");
    const form = document.getElementById("inventory-form");
    const categorySelect = document.getElementById("item-category");
    const priceUAHInput = document.getElementById("item-price-uah");
    const priceUSDInput = document.getElementById("item-price-usd");

    let exchangeRate = 1;

    // Завантаження категорій із JSON
    async function loadCategories() {
        try {
            const response = await fetch("data/categories.json");
            const categories = await response.json();
            categorySelect.innerHTML = categories.map(category => 
                `<option value="${category}">${category}</option>`
            ).join("");
        } catch (error) {
            console.error("Помилка завантаження категорій:", error);
        }
    }

    // Отримання курсу валют через API ПриватБанку
    async function fetchExchangeRate() {
        try {
            const response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
            const rates = await response.json();
            const usdRate = rates.find(rate => rate.ccy === "USD");
            exchangeRate = parseFloat(usdRate.buy);
        } catch (error) {
            console.error("Помилка отримання курсу валют:", error);
        }
    }

    // Конвертація валюти
    function updateUSDPrice() {
        const priceUAH = parseFloat(priceUAHInput.value) || 0;
        priceUSDInput.value = (priceUAH / exchangeRate).toFixed(2);
    }

    // Збереження товару в LocalStorage
    function saveItem(item) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.push(item);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
    }

    // Рендеринг таблиці
    function renderInventory() {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventoryTableBody.innerHTML = inventory.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.category}</td>
                <td>${item.priceUAH}</td>
                <td>${item.priceUSD}</td>
                <td>${item.compatibility || "—"}</td>
                <td>${item.supplier || "—"}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editItem(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Видалення товару
    window.deleteItem = function (index) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
    };

    // Редагування товару
    window.editItem = function (index) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const item = inventory[index];

        form.elements["item-name"].value = item.name;
        form.elements["item-quantity"].value = item.quantity;
        form.elements["item-category"].value = item.category;
        form.elements["item-price-uah"].value = item.priceUAH;
        form.elements["item-price-usd"].value = item.priceUSD;
        form.elements["item-supplier"].value = item.supplier;
        form.elements["item-compatibility"].value = item.compatibility;

        // Видаляємо поточний товар для оновлення
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
    };

    // Обробка форми додавання товару
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newItem = {
            name: form.elements["item-name"].value,
            quantity: form.elements["item-quantity"].value,
            category: form.elements["item-category"].value,
            priceUAH: form.elements["item-price-uah"].value,
            priceUSD: form.elements["item-price-usd"].value,
            supplier: form.elements["item-supplier"].value,
            compatibility: form.elements["item-compatibility"].value
        };

        saveItem(newItem);
        form.reset();
    });

    // Ініціалізація
    await loadCategories();
    await fetchExchangeRate();
    priceUAHInput.addEventListener("input", updateUSDPrice);
    renderInventory();
});