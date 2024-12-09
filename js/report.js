document.addEventListener("DOMContentLoaded", () => {
    const dronesKey = "ready-drones"; // Дані зібраних дронів
    const monthSelect = document.getElementById("month-select");
    const reportTable = document.getElementById("report-table");
    const exportCsvButton = document.getElementById("export-csv");
    const expensesChart = document.getElementById("expenses-chart");

    // Завантаження даних
    function loadDrones() {
        return JSON.parse(localStorage.getItem(dronesKey)) || [];
    }

    // Фільтрація за місяцем
    function filterByMonth(data, month) {
        return data.filter(drone => new Date(drone.productionDate).getMonth() === month);
    }

    // Завантаження місяців
    function populateMonths(data) {
        const uniqueMonths = [...new Set(data.map(drone => new Date(drone.productionDate).getMonth()))];
        monthSelect.innerHTML = uniqueMonths.map(month => `
            <option value="${month}">${new Date(0, month).toLocaleString('uk', { month: 'long' })}</option>
        `).join("");
    }

    // Оновлення таблиці
    function renderReportTable(drones) {
        const rows = drones.flatMap(drone => 
            drone.components.map(component => `
                <tr>
                    <td>${drone.name}</td>
                    <td>${component.category}</td>
                    <td>${component.name}</td>
                    <td>${component.quantity}</td>
                    <td>${component.cost} грн</td>
                    <td>${component.quantity * component.cost} грн</td>
                </tr>
            `)
        );
        reportTable.innerHTML = rows.join("");
    }

    // Генерація графіка
    function renderChart(drones) {
        const categories = [...new Set(drones.flatMap(drone => drone.components.map(c => c.category)))];
        const expenses = categories.map(category =>
            drones.flatMap(drone => drone.components.filter(c => c.category === category))
                  .reduce((sum, comp) => sum + (comp.quantity * comp.cost), 0)
        );

        new Chart(expensesChart, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: expenses,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Експорт CSV
    function exportToCsv(drones) {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Назва дрона,Категорія,Компонент,Кількість,Вартість за одиницю,Загальна вартість"]
            .concat(drones.flatMap(drone =>
                drone.components.map(c => `${drone.name},${c.category},${c.name},${c.quantity},${c.cost},${c.quantity * c.cost}`)
            ))
            .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Ініціалізація
    const drones = loadDrones();
    populateMonths(drones);

    monthSelect.addEventListener("change", () => {
        const month = parseInt(monthSelect.value, 10);
        const filteredData = filterByMonth(drones, month);
        renderReportTable(filteredData);
        renderChart(filteredData);
    });

    exportCsvButton.addEventListener("click", () => {
        const month = parseInt(monthSelect.value, 10);
        const filteredData = filterByMonth(drones, month);
        exportToCsv(filteredData);
    });

    if (drones.length) {
        const firstMonth = new Date(drones[0].productionDate).getMonth();
        monthSelect.value = firstMonth;
        renderReportTable(filterByMonth(drones, firstMonth));
        renderChart(filterByMonth(drones, firstMonth));
    }
});