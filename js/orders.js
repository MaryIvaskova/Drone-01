document.addEventListener('DOMContentLoaded', () => {
    const categoriesUrl = 'data/categories.json';
    const ordersKey = 'orders';
    const defectsKey = 'defects';

    const ordersTable = document.getElementById('orders-table');
    const defectsTable = document.getElementById('defects-table');
    const categoryDropdown = document.getElementById('order-category');
    const orderForm = document.getElementById('order-form');

    // Завантаження категорій у форму
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Помилка завантаження категорій:', error));

    // Завантаження збережених даних
    loadFromLocalStorage(ordersKey, addOrderToTable);
    loadFromLocalStorage(defectsKey, addDefectToTable);

    // Додавання замовлення
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const order = {
            name: document.getElementById('order-name').value,
            invoice: document.getElementById('order-invoice').value || 'N/A',
            deliveryService: document.getElementById('delivery-service').value,
            quantity: Number(document.getElementById('order-quantity').value),
            category: document.getElementById('order-category').value,
            price: Number(document.getElementById('order-price').value),
            deliveryPrice: Number(document.getElementById('delivery-price').value) || 0,
            supplier: document.getElementById('order-supplier').value || 'N/A',
            status: 'Новий',
        };

        addOrderToTable(order);
        saveToLocalStorage(ordersKey, order);

        // Очищення форми
        orderForm.reset();
        document.getElementById('orderModal').classList.remove('show');
    });

    // Додавання рядка в таблицю замовлень
    function addOrderToTable(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.name}</td>
            <td>${order.invoice}</td>
            <td>${order.deliveryService}</td>
            <td>${order.quantity}</td>
            <td>${order.category}</td>
            <td>${order.price}</td>
            <td>${order.deliveryPrice}</td>
            <td>${order.supplier}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editOrder(this)">Редагувати</button>
                <button class="btn btn-success btn-sm" onclick="moveToInventory('${order.name}')">У Інвентар</button>
                <button class="btn btn-warning btn-sm" onclick="addToDefects('${order.name}')">У Брак</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder(this)">Видалити</button>
            </td>
        `;
        ordersTable.appendChild(row);
    }

    // Редагування замовлення
    window.editOrder = function (button) {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Заповнення форми
        document.getElementById('order-name').value = cells[0].innerText;
        document.getElementById('order-invoice').value = cells[1].innerText;
        document.getElementById('delivery-service').value = cells[2].innerText;
        document.getElementById('order-quantity').value = cells[3].innerText;
        document.getElementById('order-category').value = cells[4].innerText;
        document.getElementById('order-price').value = cells[5].innerText;
        document.getElementById('delivery-price').value = cells[6].innerText;
        document.getElementById('order-supplier').value = cells[7].innerText;

        // Видалення старого рядка
        row.remove();
        updateLocalStorage(ordersKey);
    };

    // Додавання у таблицю браку
    window.addToDefects = function (orderName) {
        const rows = Array.from(ordersTable.querySelectorAll('tr'));
        const defectRow = rows.find(row => row.cells[0].innerText === orderName);

        if (defectRow) {
            const defect = {
                name: defectRow.cells[0].innerText,
                quantity: Number(defectRow.cells[3].innerText),
                category: defectRow.cells[4].innerText,
                price: Number(defectRow.cells[5].innerText),
                deliveryPrice: Number(defectRow.cells[6].innerText),
                reason: prompt('Вкажіть причину браку:', ''),
            };

            addDefectToTable(defect);
            saveToLocalStorage(defectsKey, defect);

            defectRow.remove();
            updateLocalStorage(ordersKey);
        }
    };

    // Додавання рядка у таблицю браку
    function addDefectToTable(defect) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${defect.name}</td>
            <td>${defect.quantity}</td>
            <td>${defect.category}</td>
            <td>${defect.price}</td>
            <td>${defect.deliveryPrice}</td>
            <td>${defect.reason || 'N/A'}</td>
        `;
        defectsTable.appendChild(row);
    }

    // Видалення замовлення
    window.deleteOrder = function (button) {
        const row = button.closest('tr');
        row.remove();
        updateLocalStorage(ordersKey);
    };

    // Збереження в LocalStorage
    function saveToLocalStorage(key, data) {
        let storage = JSON.parse(localStorage.getItem(key)) || [];
        storage.push(data);
        localStorage.setItem(key, JSON.stringify(storage));
    }

    // Завантаження з LocalStorage
    function loadFromLocalStorage(key, callback) {
        const storage = JSON.parse(localStorage.getItem(key)) || [];
        storage.forEach(item => callback(item));
    }

    // Оновлення LocalStorage після видалення
    function updateLocalStorage(key) {
        const rows = Array.from(ordersTable.querySelectorAll('tr'));
        const updatedData = rows.map(row => ({
            name: row.cells[0].innerText,
            invoice: row.cells[1].innerText,
            deliveryService: row.cells[2].innerText,
            quantity: Number(row.cells[3].innerText),
            category: row.cells[4].innerText,
            price: Number(row.cells[5].innerText),
            deliveryPrice: Number(row.cells[6].innerText),
            supplier: row.cells[7].innerText,
            status: row.cells[8].innerText,
        }));
        localStorage.setItem(key, JSON.stringify(updatedData));
    }

    // Переміщення у інвентар (приклад)
    window.moveToInventory = function (orderName) {
        alert(`Замовлення "${orderName}" переміщено у інвентар.`);
        // Логіка для інвентарю
    };
});