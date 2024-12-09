document.addEventListener("DOMContentLoaded", () => {
    // Ключі для LocalStorage
    const dataKeys = {
        orders: "orders",
        inventory: "inventory",
        readyDrones: "readyDrones",
        services: "services",
        suppliers: "suppliers"
    };

    // Тестові дані
    const testData = {
        orders: [
            {
                name: "Мотор A2207",
                invoice: "INV-001",
                deliveryService: "Нова Пошта",
                quantity: 20,
                category: "Мотори",
                priceUAH: 1500,
                deliveryPrice: 200,
                supplier: "DroneTech",
                status: "В дорозі"
            },
            {
                name: "Рама ZF220",
                invoice: "INV-002",
                deliveryService: "Meest",
                quantity: 10,
                category: "Рами",
                priceUAH: 2500,
                deliveryPrice: 300,
                supplier: "FrameMasters",
                status: "У пункті видачі"
            }
        ],
        inventory: [
            {
                id: "INV-001",
                name: "Мотор A2207",
                category: "Мотори",
                quantity: 50,
                priceUAH: 1500,
                supplier: "DroneTech"
            },
            {
                id: "INV-002",
                name: "Рама ZF220",
                category: "Рами",
                quantity: 20,
                priceUAH: 2500,
                supplier: "FrameMasters"
            },
            {
                id: "INV-003",
                name: "Пропелер T5040C",
                category: "Пропелери",
                quantity: 100,
                priceUAH: 50,
                supplier: "PropelWorld"
            }
        ],
        readyDrones: [
            {
                id: "DRONE-001",
                name: "RS220 Explorer",
                components: ["Мотор A2207", "Рама ZF220", "Пропелер T5040C"],
                priceUAH: 12500,
                services: ["Калібрування", "Тестовий політ"],
                photo: "photo1.jpg"
            },
            {
                id: "DRONE-002",
                name: "FTX100 Racer",
                components: ["Мотор B1505", "Рама XT100", "Пропелер R5040C"],
                priceUAH: 15000,
                services: ["Тестовий політ"],
                photo: "photo2.jpg"
            }
        ],
        services: [
            { droneName: "RS220 Explorer", serviceName: "Калібрування", costUAH: 500 },
            { droneName: "RS220 Explorer", serviceName: "Тестовий політ", costUAH: 1000 },
            { droneName: "FTX100 Racer", serviceName: "Тестовий політ", costUAH: 1000 }
        ],
        suppliers: [
            {
                name: "DroneTech",
                contact: "drone-tech@example.com",
                altContact: "098-123-4567",
                items: ["Мотори", "Камери"],
                availability: true
            },
            {
                name: "FrameMasters",
                contact: "frame-masters@example.com",
                altContact: "050-987-6543",
                items: ["Рами", "Пропелери"],
                availability: true
            },
            {
                name: "PropelWorld",
                contact: "propel-world@example.com",
                altContact: "063-456-7890",
                items: ["Пропелери", "Антени"],
                availability: false
            }
        ]
    };

    // Ініціалізація тестових даних
    function initializeTestData() {
        Object.keys(dataKeys).forEach((key) => {
            localStorage.setItem(dataKeys[key], JSON.stringify(testData[key]));
        });
        alert("Тестові дані успішно ініціалізовано!");
        window.location.reload();
    }

    // Очищення тестових даних
    function clearTestData() {
        Object.values(dataKeys).forEach((key) => {
            localStorage.removeItem(key);
        });
        alert("Тестові дані очищено!");
        window.location.reload();
    }

    // Рендер контролів для тестових даних
    function renderTestControls() {
        const testControls = document.createElement("div");
        testControls.className = "test-controls";
        testControls.innerHTML = `
            <button id="initialize-test-data" class="btn btn-secondary m-2">Ініціалізувати тестові дані</button>
            <button id="clear-test-data" class="btn btn-danger m-2">Очистити тестові дані</button>
        `;
        document.body.prepend(testControls);

        document.getElementById("initialize-test-data").addEventListener("click", initializeTestData);
        document.getElementById("clear-test-data").addEventListener("click", clearTestData);
    }

    renderTestControls();
});