// needs.js

document.addEventListener("DOMContentLoaded", () => {
    const needsTable = document.getElementById("needs-table");
    const form = document.getElementById("needs-form");
    const statusNotDoneButton = document.getElementById("status-not-done");
    const statusDoneButton = document.getElementById("status-done");
    let currentStatus = "Не виконано";

    // Ініціалізація даних із LocalStorage
    function loadNeeds() {
        const needs = JSON.parse(localStorage.getItem("needs")) || [];
        renderNeeds(needs);
    }

    // Рендеринг таблиці потреб
    function renderNeeds(needs) {
        needsTable.innerHTML = needs.map((need, index) => `
            <tr>
                <td>${need.id}</td>
                <td>${need.name}</td>
                <td>${need.quantity}</td>
                <td>${need.description || "—"}</td>
                <td>${need.customer}</td>
                <td>${need.status}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editNeed(${index})">Редагувати</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNeed(${index})">Видалити</button>
                </td>
            </tr>
        `).join("");
    }

    // Збереження потреби
    function saveNeed(need) {
        const needs = JSON.parse(localStorage.getItem("needs")) || [];
        needs.push(need);
        localStorage.setItem("needs", JSON.stringify(needs));
        renderNeeds(needs);
    }

    // Видалення потреби
    window.deleteNeed = function (index) {
        const needs = JSON.parse(localStorage.getItem("needs")) || [];
        needs.splice(index, 1);
        localStorage.setItem("needs", JSON.stringify(needs));
        renderNeeds(needs);
    };

    // Редагування потреби
    window.editNeed = function (index) {
        const needs = JSON.parse(localStorage.getItem("needs")) || [];
        const need = needs[index];

        form.elements["need-name"].value = need.name;
        form.elements["need-quantity"].value = need.quantity;
        form.elements["need-description"].value = need.description;
        form.elements["need-customer"].value = need.customer;
        currentStatus = need.status;

        // Видаляємо існуючий запис для подальшого збереження
        needs.splice(index, 1);
        localStorage.setItem("needs", JSON.stringify(needs));
        renderNeeds(needs);
    };

    // Обробка кнопок статусу
    statusNotDoneButton.addEventListener("click", () => {
        currentStatus = "Не виконано";
        statusNotDoneButton.classList.add("btn-danger");
        statusDoneButton.classList.remove("btn-success");
    });

    statusDoneButton.addEventListener("click", () => {
        currentStatus = "Виконано";
        statusDoneButton.classList.add("btn-success");
        statusNotDoneButton.classList.remove("btn-danger");
    });

    // Обробка форми
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const need = {
            id: Date.now(),
            name: form.elements["need-name"].value,
            quantity: form.elements["need-quantity"].value,
            description: form.elements["need-description"].value || "—",
            customer: form.elements["need-customer"].value,
            status: currentStatus,
        };

        saveNeed(need);
        form.reset();
        currentStatus = "Не виконано";
        statusNotDoneButton.classList.add("btn-danger");
        statusDoneButton.classList.remove("btn-success");
    });

    // Завантаження даних
    loadNeeds();
});