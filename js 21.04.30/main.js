document.addEventListener("DOMContentLoaded", () => {
    // Load dynamic menu
    async function loadMenu() {
        const menu = document.getElementById("menu");
        try {
            const response = await fetch("data/menu.json");
            const items = await response.json();
            menu.innerHTML = items.map(item => `
                <li class="nav-item">
                    <a class="nav-link text-white" href="${item.link}">${item.name}</a>
                </li>
            `).join("");
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    }

    // Load comparison drones
    async function loadComparisonData() {
        // Placeholder for loading and comparing drones
        console.log("Comparison data will be loaded");
    }

    // Load actual information
    async function loadActualInformation() {
        // Placeholder for loading actual data
        console.log("Actual information will be displayed");
    }

    loadMenu();
    loadComparisonData();
    loadActualInformation();
});