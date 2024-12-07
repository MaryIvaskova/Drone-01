document.addEventListener("DOMContentLoaded", () => {
    const totalDronesElement = document.getElementById("total-drones");
    const totalCostElement = document.getElementById("total-cost");

    // Fetch and calculate the report
    function generateReport() {
        const drones = JSON.parse(localStorage.getItem("drones")) || [];
        const totalDrones = drones.length;
        const totalCost = drones.reduce((sum, drone) => sum + (parseFloat(drone.cost) || 0), 0);

        totalDronesElement.textContent = totalDrones;
        totalCostElement.textContent = `${totalCost.toFixed(2)} грн`;
    }

    // Initialize the report
    generateReport();
});