import { Database } from "../core/database.js";

export const FormHandler = (() => {
    const formElement = document.getElementById("inventory-form");
    const modal = document.getElementById("modal");
    const toggleFormBtn = document.getElementById("toggle-form");
    const closeModalBtn = document.getElementById("close-modal");

    // Показ/приховування форми
    function toggleForm() {
        modal.classList.toggle("hidden");
    }

    // Скасування форми
    document.getElementById("cancel-button").addEventListener("click", () => {
        formElement.reset();
        modal.classList.add("hidden");
    });

    // Додавання нового елемента
    async function addItem(event) {
        event.preventDefault();

        // Отримуємо дані з форми
        const id = Date.now().toString(); // Генеруємо унікальний ID
        const name = document.getElementById("item-name").value;
        const quantity = parseInt(document.getElementById("item-quantity").value, 10);
        const category = document.getElementById("item-category").value;
        const priceUSD = parseFloat(document.getElementById("item-price-usd").value) || 0;

        const newItem = { id, name, quantity, category, priceUSD };

        // Тригеримо подію додавання елемента
        document.dispatchEvent(new CustomEvent("itemAdded", { detail: newItem }));

        // Скидаємо форму
        formElement.reset();
        toggleForm();
    }

    // Ініціалізація
    function init() {
        toggleFormBtn.addEventListener("click", toggleForm);
        closeModalBtn.addEventListener("click", toggleForm);
        formElement.addEventListener("submit", addItem);
    }

    return { init };
})();