// DOM Elements
const inventoryBody = document.getElementById("inventory-body");
const showFormBtn = document.getElementById("show-form-btn");
const addItemForm = document.getElementById("add-item-form");
const inventoryForm = document.getElementById("inventory-form");
const cancelFormBtn = document.getElementById("cancel-form");

// Інвентарні дані
let inventoryData = [];
let categories = ["Електроніка", "Механіка"]; // Початкові категорії
let exchangeRates = { USD: 1, UAH: 36.6 }; // Курси валют (будуть оновлені з API)

// Отримання даних курсу валют
const fetchExchangeRates = async () => {
    try {
        const response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
        const rates = await response.json();
        const usdRate = rates.find(rate => rate.ccy === "USD");
        if (usdRate) {
            exchangeRates.UAH = parseFloat(usdRate.sale);
        }
    } catch (error) {
        console.error("Не вдалося отримати курси валют:", error);
    }
};

// Завантаження інвентарю
const loadInventory = () => {
    const savedData = localStorage.getItem("inventoryData");
    if (savedData) {
        inventoryData = JSON.parse(savedData);
    }
    renderInventoryTable();
};

// Збереження інвентарю
const saveInventory = () => {
    localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
};

// Рендеринг таблиці інвентарю
const renderInventoryTable = () => {
    inventoryBody.innerHTML = "";
    inventoryData.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td class="${item.quantity === 0 ? "red" : item.quantity < 5 ? "yellow" : ""}">${item.quantity}</td>
            <td>${item.category}</td>
            <td>${item.priceUSD.toFixed(2)}</td>
            <td>${item.priceUAH.toFixed(2)}</td>
            <td>${(item.quantity * item.priceUAH).toFixed(2)}</td>
            <td>
                <button class="btn edit-btn" data-index="${index}">Редагувати</button>
                <button class="btn delete-btn" data-index="${index}">Видалити</button>
                <button class="btn add-btn" data-index="${index}">+1</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
};

// Додавання нового елемента
const addItem = (event) => {
    event.preventDefault();

    const name = document.getElementById("item-name").value;
    const quantity = parseInt(document.getElementById("item-quantity").value, 10);
    const category = document.getElementById("item-category").value || document.getElementById("item-new-category").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const currency = document.getElementById("item-currency").value;

    const priceUSD = currency === "USD" ? price : price / exchangeRates.UAH;
    const priceUAH = currency === "UAH" ? price : price * exchangeRates.UAH;

    const newItem = {
        id: Date.now(),
        name,
        quantity,
        category,
        priceUSD,
        priceUAH,
    };

    inventoryData.push(newItem);

    // Додавання нової категорії
    if (category && !categories.includes(category)) {
        const occurrences = inventoryData.filter(item => item.category === category).length;
        if (occurrences >= 3) {
            categories.push(category);
        }
    }

    saveInventory();
    renderInventoryTable();
    toggleForm();
};

// Видалення елемента
const deleteItem = (index) => {
    inventoryData.splice(index, 1);
    saveInventory();
    renderInventoryTable();
};

// Редагування елемента
const editItem = (index) => {
    const item = inventoryData[index];
    document.getElementById("item-name").value = item.name;
    document.getElementById("item-quantity").value = item.quantity;
    document.getElementById("item-category").value = item.category;
    document.getElementById("item-price").value = item.priceUSD;
    document.getElementById("item-currency").value = "USD";

    toggleForm();
    inventoryForm.onsubmit = (e) => {
        e.preventDefault();
        updateItem(index);
    };
};

// Оновлення елемента
const updateItem = (index) => {
    const name = document.getElementById("item-name").value;
    const quantity = parseInt(document.getElementById("item-quantity").value, 10);
    const category = document.getElementById("item-category").value || document.getElementById("item-new-category").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const currency = document.getElementById("item-currency").value;

    const priceUSD = currency === "USD" ? price : price / exchangeRates.UAH;
    const priceUAH = currency === "UAH" ? price : price * exchangeRates.UAH;

    inventoryData[index] = {
        ...inventoryData[index],
        name,
        quantity,
        category,
        priceUSD,
        priceUAH,
    };

    saveInventory();
    renderInventoryTable();
    toggleForm();
};

// Додавання одиниці до існуючого елемента
const addOneToItem = (index) => {
    inventoryData[index].quantity += 1;
    saveInventory();
    renderInventoryTable();
};

// Відкриття/закриття форми
const toggleForm = () => {
    addItemForm.classList.toggle("hidden");
    inventoryForm.reset();
};

// Події
showFormBtn.addEventListener("click", toggleForm);
cancelFormBtn.addEventListener("click", toggleForm);
inventoryForm.addEventListener("submit", addItem);
inventoryBody.addEventListener("click", (event) => {
    const index = event.target.dataset.index;
    if (event.target.classList.contains("edit-btn")) {
        editItem(index);
    } else if (event.target.classList.contains("delete-btn")) {
        deleteItem(index);
    } else if (event.target.classList.contains("add-btn")) {
        addOneToItem(index);
    }
});

// Ініціалізація
fetchExchangeRates().then(loadInventory);