document.addEventListener("DOMContentLoaded", () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
const needs = JSON.parse(localStorage.getItem("needs")) || [];
console.log(orders, inventory, needs);

    async function loadComparisonData() {
  
        console.log("Comparison data will be loaded");
    }

    async function loadActualInformation() {
        //   loading actual data
        console.log("Actual information will be displayed");
    }

    loadMenu();
    loadComparisonData();
    loadActualInformation();
});