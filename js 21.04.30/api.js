// URL для API-запитів
const API_URLS = {
    PRIVATBANK: "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    CATEGORIES: "data/categories.json",
    DRONES: "data/drones.json",
    INVENTORY: "data/inventory.json",
    NEEDS: "data/needs.json",
    ORDERS: "data/orders.json",
    SUPPLIERS: "data/suppliers.json"
};

// Кешування курсу валют у LocalStorage на 24 години
const CACHE_KEY = "exchangeRate";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 години

/**
 * Отримання курсу валют з API ПриватБанку.
 * @returns {Promise<number>} - Курс долара до гривні.
 */
export async function getExchangeRate() {
    const cachedRate = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
        return cachedRate.rate;
    }

    try {
        const response = await fetch(API_URLS.PRIVATBANK);
        const data = await response.json();
        const usdRate = parseFloat(data.find((item) => item.ccy === "USD").buy);

        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: usdRate, timestamp: Date.now() }));
        return usdRate;
    } catch (error) {
        console.error("Помилка отримання курсу валют:", error);
        return 38; // Значення за замовчуванням
    }
}

/**
 * Завантаження категорій із локального JSON.
 * @returns {Promise<string[]>} - Масив категорій.
 */
export async function getCategories() {
    try {
        const response = await fetch(API_URLS.CATEGORIES);
        return await response.json();
    } catch (error) {
        console.error("Помилка завантаження категорій:", error);
        return [];
    }
}

/**
 * Завантаження даних з файлу JSON.
 * @param {string} dataType - Тип даних (drones, inventory, needs, orders, suppliers).
 * @returns {Promise<any>} - Дані у форматі JSON.
 */
export async function fetchData(dataType) {
    try {
        const response = await fetch(API_URLS[dataType.toUpperCase()]);
        return await response.json();
    } catch (error) {
        console.error(`Помилка завантаження даних для ${dataType}:`, error);
        return [];
    }
}

/**
 * Збереження даних у LocalStorage.
 * @param {string} key - Ключ LocalStorage.
 * @param {any} data - Дані для збереження.
 */
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Помилка збереження даних для ключа ${key}:`, error);
    }
}

/**
 * Отримання даних із LocalStorage.
 * @param {string} key - Ключ LocalStorage.
 * @returns {any} - Дані у форматі JSON.
 */
export function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Помилка завантаження даних для ключа ${key}:`, error);
        return [];
    }
}