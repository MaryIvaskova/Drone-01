const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/orders.json");

// Читання JSON-файлу
const readData = () => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Помилка читання файлу:", err);
        return { orders: [] };
    }
};

// Запис у JSON-файл
const writeData = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        console.log("Дані успішно записано.");
    } catch (err) {
        console.error("Помилка запису у файл:", err);
    }
};

module.exports = { readData, writeData };