document.addEventListener("DOMContentLoaded", async () => {
    const supplierTableBody = document.getElementById("suppliers-table-body");
    const supplierForm = document.getElementById("supplier-form");
    const supplierModal = new bootstrap.Modal(document.getElementById("supplierModal"));
    const nameInput = document.getElementById("supplier-name");
    const contactInput = document.getElementById("supplier-contact");
    const itemsInput = document.getElementById("supplier-items");
    const saveButton = document.getElementById("save-supplier");
    const videoInput = document.getElementById("supplier-video");

    // Функція для завантаження постачальників з LocalStorage
    function loadSuppliers() {
        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        renderSuppliers(suppliers);
    }

    // Функція для збереження постачальника
    function saveSupplier(supplier) {
        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.push(supplier);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        renderSuppliers(suppliers);
    }

    // Функція для відображення постачальників у таблиці
    function renderSuppliers(suppliers) {
        supplierTableBody.innerHTML = suppliers.map((supplier, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.items}</td>
                <td>${supplier.availability ? "Наявне" : "Немає"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editSupplier(${index})">Редагувати</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Функція для видалення постачальника
    window.deleteSupplier = function (index) {
        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.splice(index, 1);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        loadSuppliers();
    };

    // Функція для редагування постачальника
    window.editSupplier = function (index) {
        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        const supplier = suppliers[index];

        nameInput.value = supplier.name;
        contactInput.value = supplier.contact;
        itemsInput.value = supplier.items;
        videoInput.value = supplier.video;

        suppliers.splice(index, 1);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        loadSuppliers();
        supplierModal.show();
    };

    // Обробка збереження даних постачальника
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();

        const newSupplier = {
            name: nameInput.value,
            contact: contactInput.value,
            items: itemsInput.value.split(",").map(item => item.trim()),
            video: videoInput.value,
            availability: document.querySelector('input[name="availability"]:checked').value === "true"
        };

        saveSupplier(newSupplier);
        supplierForm.reset();
        supplierModal.hide();
    });

    // Завантаження постачальників при завантаженні сторінки
    loadSuppliers();
});