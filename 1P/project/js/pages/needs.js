const needsBody = document.getElementById("needs-body");
const showFormBtn = document.getElementById("show-form-btn");
const addNeedForm = document.getElementById("add-need-form");
const needForm = document.getElementById("need-form");
const cancelFormBtn = document.getElementById("cancel-form");

let needsData = [];

// Завантаження даних
const loadNeeds = () => {
    const savedData = localStorage.getItem("needsData");
    if (savedData) {
        needsData = JSON.parse(savedData);
    }
    renderNeedsTable();
    scheduleNotifications();
};

// Збереження даних
const saveNeeds = () => {
    localStorage.setItem("needsData", JSON.stringify(needsData));
};

// Рендеринг таблиці
const renderNeedsTable = () => {
    needsBody.innerHTML = "";
    needsData.forEach((need, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${need.name || "—"}</td>
            <td>${need.quantity || "—"}</td>
            <td>${need.recipient || "—"}</td>
            <td>${need.deadline || "—"}</td>
            <td>${need.priority || "—"}</td>
            <td>${need.description || "—"}</td>
            <td>
                <button class="btn delete-btn" data-index="${index}">Видалити</button>
            </td>
        `;
        needsBody.appendChild(row);
    });
};

// Додавання потреби
const addNeed = (event) => {
    event.preventDefault();

    const name = document.getElementById("drone-name").value.trim();
    const quantity = parseInt(document.getElementById("need-quantity").value.trim()) || 0;
    const recipient = document.getElementById("need-recipient").value.trim();
    const deadline = document.getElementById("need-deadline").value;
    const priority = document.getElementById("need-priority").value;
    const description = document.getElementById("need-description").value.trim();

    const newNeed = { name, quantity, recipient, deadline, priority, description };

    needsData.push(newNeed);
    saveNeeds();
    renderNeedsTable();
    toggleForm();
};

// Налаштування сповіщень
const scheduleNotifications = () => {
    needsData.forEach((need) => {
        if (need.deadline) {
            const deadlineDate = new Date(need.deadline);
            const today = new Date();
            const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            if (daysLeft === 3) {
                alert(`Сповіщення: потреба у дроні "${need.name}" завершується через 3 дні.`);
            }
        }
    });
};

// Видалення потреби
const deleteNeed = (index) => {
    needsData.splice(index, 1);
    saveNeeds();
    renderNeedsTable();
};

// Відкриття/закриття форми
const toggleForm = () => {
    addNeedForm.classList.toggle("hidden");
    needForm.reset();
};

// Події
showFormBtn.addEventListener("click", toggleForm);
cancelFormBtn.addEventListener("click", toggleForm);
needForm.addEventListener("submit", addNeed);
needsBody.addEventListener("click", (event) => {
    const index = event.target.dataset.index;
    if (event.target.classList.contains("delete-btn")) {
        deleteNeed(index);
    }
});

// Ініціалізація
loadNeeds();