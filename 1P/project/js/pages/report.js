document.addEventListener("DOMContentLoaded", () => {
    // Ініціалізація IndexedDB для роботи зі звітами
    const dbName = "DroneProjectDB";
    const storeName = "drones";

    let db;

    const openDatabase = () => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => {
            console.error("Помилка відкриття бази даних.");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("База даних відкрита.");
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            }
        };
    };

    const fetchDronesData = (callback) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const request = store.getAll();
        request.onsuccess = (event) => {
            callback(event.target.result);
        };
        request.onerror = () => {
            console.error("Помилка отримання даних.");
        };
    };

    // Рендер таблиці собівартості дронів
    const renderDronesCostTable = (data) => {
        const tbody = document.getElementById("drones-cost-table").querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach((drone) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${drone.name}</td>
                <td>${drone.quantity}</td>
                <td>${drone.totalCost}</td>
                <td>${drone.components.join(", ")}</td>
            `;
            tbody.appendChild(row);
        });
    };

    // Рендер таблиці витрат
    const renderExpensesTable = (expenses) => {
        const tbody = document.getElementById("expenses-table").querySelector("tbody");
        tbody.innerHTML = "";

        expenses.forEach((expense) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
                <td>${expense.details}</td>
            `;
            tbody.appendChild(row);
        });
    };

    // Формування звіту
    const generateReport = (month) => {
        fetchDronesData((drones) => {
            // Фільтруємо дані за місяцем
            const filteredDrones = drones.filter((drone) => new Date(drone.date).getMonth() + 1 === parseInt(month));
            const expenses = [
                { category: "Компоненти", amount: 50000, details: "Покупка нових деталей" },
                { category: "Зарплати", amount: 80000, details: "Виплата зарплат співробітникам" },
            ];

            renderDronesCostTable(filteredDrones);
            renderExpensesTable(expenses);
        });
    };

    // Обробник подачі форми
    document.getElementById("month-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedMonth = document.getElementById("month-select").value;
        generateReport(selectedMonth);
    });

    // Відкрити базу даних
    openDatabase();
});
