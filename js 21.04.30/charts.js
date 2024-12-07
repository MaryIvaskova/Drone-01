/**
 * Ініціалізація графіка за допомогою Chart.js
 * @param {string} canvasId - ID елемента <canvas>.
 * @param {string} chartType - Тип графіка (наприклад, 'bar', 'line', 'pie').
 * @param {Object} chartData - Дані для графіка.
 * @param {Object} chartOptions - Опції для графіка.
 */
export function initializeChart(canvasId, chartType, chartData, chartOptions) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions,
    });
}

/**
 * Створення графіка витрат за категоріями
 * @param {string} canvasId - ID елемента <canvas>.
 * @param {Array<string>} categories - Список категорій.
 * @param {Array<number>} expenses - Витрати для кожної категорії.
 */
export function renderCategoryExpensesChart(canvasId, categories, expenses) {
    const data = {
        labels: categories,
        datasets: [
            {
                label: "Витрати за категоріями",
                data: expenses,
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#cc65fe",
                    "#ffce56",
                    "#4bc0c0",
                    "#9966ff",
                    "#ff9f40",
                    "#4bc0c0",
                    "#c9cbcf",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#ffffff",
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        `Витрати: ${tooltipItem.raw.toLocaleString("uk-UA")} грн`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#ffffff" },
                grid: { color: "#444444" },
            },
            y: {
                ticks: { color: "#ffffff" },
                grid: { color: "#444444" },
            },
        },
    };

    initializeChart(canvasId, "bar", data, options);
}

/**
 * Створення графіка порівняння витрат між місяцями
 * @param {string} canvasId - ID елемента <canvas>.
 * @param {Array<string>} months - Список місяців.
 * @param {Array<number>} currentExpenses - Витрати за поточний місяць.
 * @param {Array<number>} previousExpenses - Витрати за попередній місяць.
 */
export function renderMonthlyComparisonChart(
    canvasId,
    months,
    currentExpenses,
    previousExpenses
) {
    const data = {
        labels: months,
        datasets: [
            {
                label: "Поточний місяць",
                data: currentExpenses,
                backgroundColor: "#36a2eb",
                borderWidth: 1,
            },
            {
                label: "Попередній місяць",
                data: previousExpenses,
                backgroundColor: "#ff6384",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#ffffff",
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        `Витрати: ${tooltipItem.raw.toLocaleString("uk-UA")} грн`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#ffffff" },
                grid: { color: "#444444" },
            },
            y: {
                ticks: { color: "#ffffff" },
                grid: { color: "#444444" },
            },
        },
    };

    initializeChart(canvasId, "bar", data, options);
}

/**
 * Створення кругового графіка
 * @param {string} canvasId - ID елемента <canvas>.
 * @param {Array<string>} labels - Мітки.
 * @param {Array<number>} dataValues - Дані для кожної мітки.
 */
export function renderPieChart(canvasId, labels, dataValues) {
    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#cc65fe",
                    "#ffce56",
                    "#4bc0c0",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#ffffff",
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString("uk-UA")} грн`,
                },
            },
        },
    };

    initializeChart(canvasId, "pie", data, options);
}