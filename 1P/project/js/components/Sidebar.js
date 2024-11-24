document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");

    // Дані для сідбару
    const sidebarLinks = [
        { name: "Головна", path: "../pages/index.html" },
        { name: "Інвентар", path: "../pages/inventory.html" },
        { name: "Замовлення", path: "../pages/orders.html" },
        { name: "Готові дрони", path: "../pages/ready-drones.html" },
        { name: "Потреби", path: "../pages/needs.html" },
        { name: "Постачальники", path: "../pages/suppliers.html" },
        { name: "Місячний звіт", path: "../pages/report.html" },
        { name: "Деталі дронів", path: "../pages/drone-details.html" },
    ];

    // Рендеринг сідбару
    const renderSidebar = () => {
        const list = document.createElement("ul");
        list.className = "sidebar-list";

        sidebarLinks.forEach(link => {
            const listItem = document.createElement("li");
            const anchor = document.createElement("a");

            anchor.href = link.path;
            anchor.textContent = link.name;

            // Додавання класу для активної сторінки
            if (window.location.pathname.includes(link.path.split('/').pop())) {
                anchor.classList.add("active");
            }

            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });

        sidebar.appendChild(list);
    };

    renderSidebar();
});