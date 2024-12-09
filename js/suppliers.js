document.addEventListener("DOMContentLoaded", () => {
    const suppliersKey = "suppliers";
    const supplierTableBody = document.getElementById("suppliers-table-body");
    const supplierForm = document.getElementById("supplier-form");
    const supplierModal = new bootstrap.Modal(document.getElementById("supplierModal"));
    const saveButton = document.getElementById("save-supplier");

    const nameInput = document.getElementById("supplier-name");
    const contactInput = document.getElementById("supplier-contact");
    const altContactInput = document.getElementById("supplier-alt-contact");
    const itemsInput = document.getElementById("supplier-items");
    const videoInput = document.getElementById("supplier-video");

    // Завантаження постачальників із LocalStorage
    function loadSuppliers() {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        renderSuppliers(suppliers);
    }

    // Збереження постачальника
    function saveSupplier(supplier) {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        suppliers.push(supplier);
        localStorage.setItem(suppliersKey, JSON.stringify(suppliers));
        renderSuppliers(suppliers);
    }

    // Рендеринг таблиці постачальників
    function renderSuppliers(suppliers) {
        supplierTableBody.innerHTML = suppliers.map((supplier, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.altContact || '—'}</td>
                <td>${supplier.items.join(", ")}</td>
                <td>${supplier.availability ? "Наявне" : "Немає"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editSupplier(${index})">Редагувати</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Видалення постачальника
    window.deleteSupplier = function (index) {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        suppliers.splice(index, 1);
        localStorage.setItem(suppliersKey, JSON.stringify(suppliers));
        loadSuppliers();
    };

    // Редагування постачальника
    window.editSupplier = function (index) {
        const suppliers = JSON.parse(localStorage.getItem(suppliersKey)) || [];
        const supplier = suppliers[index];

        nameInput.value = supplier.name;
        contactInput.value = supplier.contact;
        altContactInput.value = supplier.altContact || '';
        itemsInput.value = supplier.items.join(", ");
        videoInput.value = supplier.video || '';

        suppliers.splice(index, 1);
        localStorage.setItem(suppliersKey, JSON.stringify(suppliers));
        loadSuppliers();
        supplierModal.show();
    };

    // Обробка кнопки збереження
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();

        const newSupplier = {
            name: nameInput.value,
            contact: contactInput.value,
            altContact: altContactInput.value || null,
            items: itemsInput.value.split(",").map(item => item.trim()),
            video: videoInput.value || null,
            availability: document.querySelector('input[name="availability"]:checked').value === "true"
        };

        saveSupplier(newSupplier);
        supplierForm.reset();
        supplierModal.hide();
    });

    // Ініціалізація
    loadSuppliers();
});