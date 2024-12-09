document.addEventListener("DOMContentLoaded", () => {
    const droneList = document.getElementById("drone-list");
    const detailsDrone1 = document.getElementById("details-drone1");
    const detailsDrone2 = document.getElementById("details-drone2");

    // Завантаження даних готових дронів
    const readyDrones = JSON.parse(localStorage.getItem("readyDrones")) || [];

    // Відображення списку готових дронів
    readyDrones.forEach((drone, index) => {
        const item = document.createElement("div");
        item.classList.add("list-group-item", "draggable");
        item.setAttribute("draggable", true);
        item.textContent = `${drone.name} (₴${drone.priceUAH})`;
        item.dataset.index = index;

        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", index);
        });

        droneList.appendChild(item);
    });

    // Відображення деталей дрона
    function displayDroneDetails(drone, container) {
        const componentsTable = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Компонент</th>
                        <th>Ціна (₴)</th>
                    </tr>
                </thead>
                <tbody>
                    ${drone.components
                        .map(
                            (component) =>
                                `<tr><td>${component}</td><td>${getComponentPrice(component)}</td></tr>`
                        )
                        .join("")}
                </tbody>
            </table>
        `;
        const totalPrice = `
            <p><strong>Загальна собівартість: ₴${drone.priceUAH}</strong></p>
        `;
        container.innerHTML = componentsTable + totalPrice;
    }

    // Отримання ціни компонента
    function getComponentPrice(componentName) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const component = inventory.find((item) => item.name === componentName);
        return component ? component.priceUAH : "N/A";
    }

    // Перетягування для порівняння
    ["drone1", "drone2"].forEach((id) => {
        const container = document.getElementById(id);

        container.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        container.addEventListener("drop", (e) => {
            e.preventDefault();
            const index = e.dataTransfer.getData("text");
            const drone = readyDrones[index];
            if (id === "drone1") {
                displayDroneDetails(drone, detailsDrone1);
            } else {
                displayDroneDetails(drone, detailsDrone2);
            }
        });
    });
});