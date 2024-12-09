document.addEventListener("DOMContentLoaded", async () => {
    const inventoryTable = document.getElementById("inventory-table");
    const inventoryForm = document.getElementById("inventory-form");
    const categoryDropdown = document.getElementById("item-category");
    const supplierDropdown = document.getElementById("item-supplier");
    const priceUAHInput = document.getElementById("item-price-uah");
    const priceUSDInput = document.getElementById("item-price-usd");
    const filterCategoryInput = document.getElementById("filter-category");
    const moveToDronesButton = document.getElementById("move-to-drones");

    const inventoryKey = "inventory";
    const categoriesUrl = "./data/categories.json";
    const suppliersKey = "suppliers";

    let exchangeRate = 1;

    // Функція для завантаження категорій із JSON
    async function loadCategories() {
        try {
            const response = await fetch(categoriesUrl);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const categories = await response.json();
            categoryDropdown.innerHTML = categories.map(category => `
                <option value="${category}">${category}</option>
            `).join("");
        } catch (error) {
            console.error("Помилка завантаження категорій:", error);
        }
    }

    // Функція для завантаження постачальників із LocalStorage
    function loadSuppliers() {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        if (suppliers.length === 0) {
            console.warn("Постачальники не знайдені в LocalStorage.");
            return;
        }
        supplierDropdown.innerHTML = suppliers.map(supplier => `
            <option value="${supplier.name}">${supplier.name}</option>
        `).join("");
    }

    // Функція для отримання курсу валют із ПриватБанку
    async function fetchExchangeRate() {
        try {
            const response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
            const rates = await response.json();
            const usdRate = rates.find(rate => rate.ccy === "USD");
            exchangeRate = parseFloat(usdRate.buy);
            console.log("Курс USD:", exchangeRate);
        } catch (error) {
            console.error("Помилка отримання курсу валют:", error);
            exchangeRate = 38; // Резервний курс для ручної перевірки
        }
    }

    // Конвертація гривень у долари
    function updatePriceUSD() {
        const priceUAH = parseFloat(priceUAHInput.value) || 0;
        priceUSDInput.value = (priceUAH / exchangeRate).toFixed(2);
    }

    // Збереження даних у LocalStorage
    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Отримання даних із LocalStorage
    function getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    // Додавання нового товару
    inventoryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now(),
            name: inventoryForm.elements["item-name"].value,
            quantity: parseInt(inventoryForm.elements["item-quantity"].value),
            category: inventoryForm.elements["item-category"].value,
            priceUAH: parseFloat(inventoryForm.elements["item-price-uah"].value),
            priceUSD: parseFloat(priceUSDInput.value),
            supplier: inventoryForm.elements["item-supplier"].value
        };

        const inventory = getFromStorage(inventoryKey);
        inventory.push(newItem);
        saveToStorage(inventoryKey, inventory);

        renderInventory();
        inventoryForm.reset();
    });

    // Рендеринг таблиці інвентарю
    function renderInventory() {
        const inventory = getFromStorage(inventoryKey);
        inventoryTable.innerHTML = inventory.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.category}</td>
                <td>${item.priceUAH} грн</td>
                <td>${item.priceUSD} $</td>
                <td>${item.supplier}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editItem(${item.id})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Видалення товару
    window.deleteItem = function (id) {
        const inventory = getFromStorage(inventoryKey).filter(item => item.id !== id);
        saveToStorage(inventoryKey, inventory);
        renderInventory();
    };

    // Редагування товару
    window.editItem = function (id) {
        const inventory = getFromStorage(inventoryKey);
        const item = inventory.find(i => i.id === id);

        inventoryForm.elements["item-name"].value = item.name;
        inventoryForm.elements["item-quantity"].value = item.quantity;
        inventoryForm.elements["item-category"].value = item.category;
        inventoryForm.elements["item-price-uah"].value = item.priceUAH;
        priceUSDInput.value = item.priceUSD;
        inventoryForm.elements["item-supplier"].value = item.supplier;

        saveToStorage(inventoryKey, inventory.filter(i => i.id !== id));
        renderInventory();
    };

    // Фільтрація за категоріями
    filterCategoryInput.addEventListener("input", () => {
        const inventory = getFromStorage(inventoryKey);
        const filteredInventory = inventory.filter(item => item.category.includes(filterCategoryInput.value));
        inventoryTable.innerHTML = filteredInventory.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.category}</td>
                <td>${item.priceUAH} грн</td>
                <td>${item.priceUSD} $</td>
                <td>${item.supplier}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editItem(${item.id})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Видалити</button>
                </td>
            </tr>
        `).join("");
    });

    // Ініціалізація
    await fetchExchangeRate();
    await loadCategories();
    loadSuppliers();
    renderInventory();

    priceUAHInput.addEventListener("input", updatePriceUSD);
});