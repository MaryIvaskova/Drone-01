export const saveData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Дані для ключа "${key}" успішно збережені.`);
    } catch (error) {
        console.error(`Помилка збереження даних для ключа "${key}":`, error);
    }
};

export const loadData = (key, defaultValue = []) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Помилка завантаження даних для ключа "${key}":`, error);
        return defaultValue;
    }
};