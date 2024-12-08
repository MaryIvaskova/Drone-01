document.addEventListener("DOMContentLoaded", () => {
    const droneTableBody = document.getElementById("drone-table-body");
    const droneForm = document.getElementById("drone-form");

    const selectedComponents = JSON.parse(localStorage.getItem("selectedComponents"));
console.log(selectedComponents);

    // Load drones from LocalStorage
    function loadDrones() {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        droneTableBody.innerHTML = drones.map((drone, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${drone.model}</td>
                <td>${drone.cost}</td>
                <td>${drone.components}</td>
                <td>${drone.characteristics || "—"}</td>
                <td>${drone.video || "—"}</td>
                <td>${drone.availability}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editDrone(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDrone(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Save drone to LocalStorage
    function saveDrone(drone) {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        drones.push(drone);
        localStorage.setItem("drones", JSON.stringify(drones));
        loadDrones();
    }

    // Delete drone
    window.deleteDrone = function (index) {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        drones.splice(index, 1);
        localStorage.setItem("drones", JSON.stringify(drones));
        loadDrones();
    };

    // Edit drone
    window.editDrone = function (index) {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        const drone = drones[index];
        droneForm.elements["model"].value = drone.model;
        droneForm.elements["components"].value = drone.components;
        droneForm.elements["characteristics"].value = drone.characteristics || "";
        droneForm.elements["availability"].value = drone.availability;

        drones.splice(index, 1);
        localStorage.setItem("drones", JSON.stringify(drones));
    };

    // Handle form submission
    droneForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newDrone = {
            model: droneForm.elements["model"].value,
            components: droneForm.elements["components"].value,
            characteristics: droneForm.elements["characteristics"].value || null,
            video: droneForm.elements["video-status"].value || null,
            availability: droneForm.elements["availability"].value,
            cost: calculateCost(droneForm.elements["components"].value)
        };
        saveDrone(newDrone);
        droneForm.reset();
    });

    // Calculate cost
    function calculateCost(components) {
        const componentList = components.split(",");
        return componentList.length * 500; // Example: 500 грн per component
    }

    // Initialize
    loadDrones();
});