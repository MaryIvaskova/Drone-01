fetch("http://localhost:3000/api/orders")
    .then((response) => response.json())
    .then((orders) => {
        const tableBody = document.getElementById("orders-body");
        tableBody.innerHTML = ""; // Очистка таблиці

        orders.forEach((order) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.orderDate}</td>
                <td>${order.arrivalDate || ""}</td>
                <td>${order.name}</td>
                <td>${order.category || ""}</td>
                <td>${order.description}</td>
                <td>${order.quantity || ""}</td>
                <td>${order.priceUSD || ""}</td>
                <td>${order.deliveryPriceUAH || ""}</td>
                <td><a href="${order.shopLink}" target="_blank">Посилання</a></td>
                <td><a href="${order.backupLink}" target="_blank">Запасний</a></td>
                <td>${order.invoiceNumber || ""}</td>
                <td>${order.discount || ""}</td>
                <td>${order.status}</td>
            `;
            tableBody.appendChild(row);
        });
    });
    document.getElementById("add-order-form").addEventListener("submit", (e) => {
        e.preventDefault();
    
        const newOrder = {
            orderDate: document.getElementById("order-date").value,
            arrivalDate: document.getElementById("arrival-date").value,
            name: document.getElementById("order-name").value,
            category: document.getElementById("order-category").value,
            description: document.getElementById("order-description").value,
            quantity: parseInt(document.getElementById("order-quantity").value, 10),
            priceUSD: parseFloat(document.getElementById("order-price-usd").value),
            deliveryPriceUAH: parseFloat(document.getElementById("order-delivery-price").value),
            shopLink: document.getElementById("order-shop-link").value,
            backupLink: document.getElementById("order-backup-link").value,
            invoiceNumber: document.getElementById("order-invoice").value,
            discount: document.getElementById("order-discount").value,
            status: "В дорозі",
            postalService: document.getElementById("postal-service").value,
        };
    
        fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newOrder),
        }).then(() => {
            // Оновити таблицю після додавання
            fetchOrders();
            e.target.reset();
        });
    });