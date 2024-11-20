// Шаблон для запитів до API
const API_BASE_URL = 'http://localhost:5000/api';

// Приклад функції для отримання даних
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) throw new Error('Помилка при отриманні даних');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Приклад функції для надсилання даних
async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Помилка при надсиланні даних');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function deleteRecord(endpoint, id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Помилка при видаленні запису');
        alert('Запис видалено');
        fillTable(endpoint, 'tableId'); // Оновлення таблиці після видалення
    } catch (error) {
        console.error(error);
    }
}

export async function editRecord(endpoint, id) {
    // Логіка для редагування запису
    // Тут можна відкрити модальне вікно для редагування або дозволити редагування безпосередньо в таблиці
}