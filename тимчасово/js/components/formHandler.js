
    import { postData } from '..api.js';
import { fillTable } from './tableHandler.js';

export function setupForm(formId, endpoint, tableId) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await postData(endpoint, data);
        if (response) {
            alert('Запис успішно додано!');
            form.reset();
            fillTable(endpoint, tableId); // Оновлюємо таблицю після додавання запису
        } else {
            alert('Помилка при додаванні запису');
        }
    });
}