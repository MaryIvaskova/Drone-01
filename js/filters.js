/**
 * Фільтрація даних за текстовими полями
 * @param {Array<Object>} data - Масив даних для фільтрації.
 * @param {string} filterKey - Ключ, за яким потрібно виконати фільтрацію.
 * @param {string} filterValue - Значення для фільтрації.
 * @returns {Array<Object>} - Відфільтровані дані.
 */
export function filterByText(data, filterKey, filterValue) {
    if (!filterValue) return data;
    return data.filter((item) =>
        item[filterKey].toLowerCase().includes(filterValue.toLowerCase())
    );
}

/**
 * Фільтрація даних за числовими полями
 * @param {Array<Object>} data - Масив даних для фільтрації.
 * @param {string} filterKey - Ключ, за яким потрібно виконати фільтрацію.
 * @param {number} min - Мінімальне значення.
 * @param {number} max - Максимальне значення.
 * @returns {Array<Object>} - Відфільтровані дані.
 */
export function filterByRange(data, filterKey, min, max) {
    return data.filter((item) => {
        const value = item[filterKey];
        return (
            (min === null || value >= min) &&
            (max === null || value <= max)
        );
    });
}

/**
 * Сортування даних
 * @param {Array<Object>} data - Масив даних для сортування.
 * @param {string} sortKey - Ключ, за яким потрібно виконати сортування.
 * @param {boolean} ascending - Порядок сортування (true для зростання, false для спадання).
 * @returns {Array<Object>} - Відсортовані дані.
 */
export function sortByKey(data, sortKey, ascending = true) {
    return [...data].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return ascending ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return ascending ? 1 : -1;
        return 0;
    });
}

/**
 * Застосування кількох фільтрів
 * @param {Array<Object>} data - Масив даних.
 * @param {Object} filters - Об'єкт фільтрів із ключами та значеннями.
 * @returns {Array<Object>} - Відфільтровані дані.
 */
export function applyFilters(data, filters) {
    let filteredData = [...data];
    for (const [key, filter] of Object.entries(filters)) {
        if (typeof filter === "string") {
            filteredData = filterByText(filteredData, key, filter);
        } else if (typeof filter === "object" && filter.min !== undefined) {
            filteredData = filterByRange(
                filteredData,
                key,
                filter.min,
                filter.max
            );
        }
    }
    return filteredData;
}

/**
 * Оновлення відображення таблиці після застосування фільтрів і сортування
 * @param {Array<Object>} data - Початковий масив даних.
 * @param {Object} filters - Фільтри для застосування.
 * @param {Object} sortConfig - Конфігурація сортування ({ key: string, ascending: boolean }).
 * @param {Function} renderFunction - Функція для оновлення таблиці.
 */
export function updateTable(data, filters, sortConfig, renderFunction) {
    let result = applyFilters(data, filters);
    if (sortConfig && sortConfig.key) {
        result = sortByKey(result, sortConfig.key, sortConfig.ascending);
    }
    renderFunction(result);
}