document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuFile = "./data/menu.json"; // Path to the JSON file

    fetch(menuFile)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch menu data");
            }
            return response.json();
        })
        .then(menuItems => {
            // Dynamically generate sidebar content
            const menuList = document.createElement("ul");
            menuList.classList.add("nav", "flex-column", "p-2");

            menuItems.forEach(item => {
                const menuItem = document.createElement("li");
                menuItem.classList.add("nav-item", "my-1");

                const menuLink = document.createElement("a");
                menuLink.classList.add("nav-link", "text-light");
                menuLink.href = item.link;
                menuLink.textContent = item.name;

                menuItem.appendChild(menuLink);
                menuList.appendChild(menuItem);
            });

            sidebar.appendChild(menuList);
        })
        .catch(error => {
            console.error("Error loading menu:", error);
            sidebar.innerHTML = "<p class='text-danger'>Menu failed to load.</p>";
        });
});