document.addEventListener("DOMContentLoaded", () => {
    const drone1Select = document.getElementById("drone1-select");
    const drone2Select = document.getElementById("drone2-select");
    const drone1Details = document.getElementById("drone1-details");
    const drone2Details = document.getElementById("drone2-details");

    // Load drones from LocalStorage
    function loadDrones() {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        const options = drones.map((drone, index) => `<option value="${index}">${drone.model}</option>`).join("");
        drone1Select.innerHTML += options;
        drone2Select.innerHTML += options;
    }

    // Render drone details
    function renderDroneDetails(droneIndex, targetElement) {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        const drone = drones[droneIndex];
        if (drone) {
            targetElement.innerHTML = `
                <img src="${drone.video || 'placeholder.jpg'}" alt="Дрон">
                <ul>
                    <li><strong>Модель:</strong> ${drone.model}</li>
                    <li><strong>Складові:</strong> ${drone.components}</li>
                    <li><strong>Характеристики:</strong> ${drone.characteristics || '—'}</li>
                    <li><strong>Сума витрат:</strong> ${drone.cost} грн</li>
                    <li><strong>Наявність:</strong> ${drone.availability}</li>
                </ul>
            `;
        }
    }

    // Event listeners for selects
    drone1Select.addEventListener("change", () => {
        renderDroneDetails(drone1Select.value, drone1Details);
    });

    drone2Select.addEventListener("change", () => {
        renderDroneDetails(drone2Select.value, drone2Details);
    });

    // Initialize
    loadDrones();
});