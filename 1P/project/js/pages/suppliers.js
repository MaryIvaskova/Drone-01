// DOM Elements
const suppliersBody = document.getElementById("suppliers-body");
const showFormBtn = document.getElementById("show-form-btn");
const addSupplierForm = document.getElementById("add-supplier-form");
const supplierForm = document.getElementById("supplier-form");
const cancelFormBtn = document.getElementById("cancel-form");

// Масив для зберігання даних
let suppliersData = [];

// Завантаження даних із LocalStorage
const loadSuppliers = () => {
    const savedData = localStorage.getItem("suppliersData");
    if (savedData) {
        suppliersData = JSON.parse(savedData);
    }
    renderSuppliersTable();
};

// Збереження даних у LocalStorage
const saveSuppliers = () => {
    localStorage.setItem("suppliersData", JSON.stringify(suppliersData));
};

// Рендеринг таблиці
const renderSuppliersTable = () => {
    suppliersBody.innerHTML = ""; // Очищуємо таблицю
    suppliersData.forEach((supplier, index) => {
        const links = supplier.links.length
            ? supplier.links.map(link => `<a href="${link}" target="_blank">${link}</a>`).join(", ")
            : "—";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${supplier.name || "—"}</td>
            <td>${supplier.contact || "—"}</td>
            <td>${supplier.components.length ? supplier.components.join(", ") : "—"}</td>
            <td>${links}</td>
            <td>${supplier.description || "—"}</td>
            <td>
                <button class="btn delete-btn" data-index="${index}">Видалити</button>
            </td>
        `;
        suppliersBody.appendChild(row);
    });
};

// Додавання нового постачальника
const addSupplier = (event) => {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки

    const name = document.getElementById("supplier-name").value.trim();
    const contact = document.getElementById("supplier-contact").value.trim();
    const components = document.getElementById("supplier-components").value
        .split(",")
        .map(c => c.trim());
    const links = document.getElementById("supplier-links").value
        .split(",")
        .map(link => link.trim());
    const description = document.getElementById("supplier-description").value.trim();

    const newSupplier = {
        name: name || "—",
        contact: contact || "—",
        components: components.filter(c => c), // Видаляємо порожні значення
        links: links.filter(link => link),
        description: description || "—"
    };

    suppliersData.push(newSupplier);
    saveSuppliers();
    renderSuppliersTable();
    toggleForm();
};

// Видалення постачальника
const deleteSupplier = (index) => {
    suppliersData.splice(index, 1); // Видаляємо зі списку
    saveSuppliers();
    renderSuppliersTable();
};

// Відкриття/закриття форми
const toggleForm = () => {
    addSupplierForm.classList.toggle("hidden");
    supplierForm.reset();
};

// Події
showFormBtn.addEventListener("click", toggleForm);
cancelFormBtn.addEventListener("click", toggleForm);
supplierForm.addEventListener("submit", addSupplier);
suppliersBody.addEventListener("click", (event) => {
    const index = event.target.dataset.index;
    if (event.target.classList.contains("delete-btn")) {
        deleteSupplier(index);
    }
});

// Ініціалізація
loadSuppliers();