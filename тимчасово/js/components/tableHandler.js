import { fetchData } from '..api.js';

// Функція для заповнення таблиці даними
export async function fillTable(endpoint, tableId) {
    const data = await fetchData(endpoint);
    if (data) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = ''; // Очистити таблицю перед заповненням

        data.forEach(item => {
            const row = document.createElement('tr');
            Object.values(item).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    } else {
        console.error(`Не вдалося отримати дані для ${tableId}`);
    }
}
export async function fillTable(endpoint, tableId) {
    const data = await fetchData(endpoint);
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Кнопка редагування
        const editButton = document.createElement('button');
        editButton.textContent = 'Редагувати';
        editButton.onclick = () => editRecord(endpoint, item.id);
        row.appendChild(editButton);

        // Кнопка видалення
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.onclick = () => deleteRecord(endpoint, item.id);
        row.appendChild(deleteButton);

        tableBody.appendChild(row);
    });
}
