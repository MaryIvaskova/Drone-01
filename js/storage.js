/**
 * Отримання даних із LocalStorage
 * @param {string} key - Ключ LocalStorage.
 * @returns {Array|Object} - Дані у форматі JSON.
 */
export function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Помилка завантаження даних із ключа "${key}":`, error);
        return [];
    }
}

/**
 * Збереження даних у LocalStorage
 * @param {string} key - Ключ LocalStorage.
 * @param {Array|Object} data - Дані для збереження.
 */
export function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Помилка збереження даних для ключа "${key}":`, error);
    }
}

/**
 * Додавання запису до LocalStorage
 * @param {string} key - Ключ LocalStorage.
 * @param {Object} item - Об'єкт для додавання.
 */
export function addItem(key, item) {
    try {
        const data = getData(key);
        data.push(item);
        saveData(key, data);
    } catch (error) {
        console.error(`Помилка додавання запису до ключа "${key}":`, error);
    }
}

/**
 * Видалення запису з LocalStorage за ID
 * @param {string} key - Ключ LocalStorage.
 * @param {number|string} id - ID запису для видалення.
 */
export function deleteItemById(key, id) {
    try {
        const data = getData(key);
        const updatedData = data.filter((item) => item.id !== id);
        saveData(key, updatedData);
    } catch (error) {
        console.error(`Помилка видалення запису з ключа "${key}":`, error);
    }
}

/**
 * Оновлення запису в LocalStorage
 * @param {string} key - Ключ LocalStorage.
 * @param {Object} updatedItem - Оновлений об'єкт.
 */
export function updateItem(key, updatedItem) {
    try {
        const data = getData(key);
        const updatedData = data.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
        );
        saveData(key, updatedData);
    } catch (error) {
        console.error(`Помилка оновлення запису в ключі "${key}":`, error);
    }
}

/**
 * Очистка даних у LocalStorage
 * @param {string} key - Ключ LocalStorage.
 */
export function clearData(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Помилка очищення даних для ключа "${key}":`, error);
    }
}