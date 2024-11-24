const { readData, writeData } = require("../db");

// Отримати всі замовлення
exports.getAllOrders = (req, res) => {
    const data = readData();
    res.json(data.orders);
};

// Додати нове замовлення
exports.createOrder = (req, res) => {
    const data = readData();
    const newOrder = { id: Date.now(), ...req.body };
    data.orders.push(newOrder);
    writeData(data);
    res.status(201).json(newOrder);
};

// Оновити замовлення
exports.updateOrder = (req, res) => {
    const data = readData();
    const orderIndex = data.orders.findIndex((order) => order.id === parseInt(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: "Замовлення не знайдено" });
    }
    data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body };
    writeData(data);
    res.json(data.orders[orderIndex]);
};

// Видалити замовлення
exports.deleteOrder = (req, res) => {
    const data = readData();
    const updatedOrders = data.orders.filter((order) => order.id !== parseInt(req.params.id));
    data.orders = updatedOrders;
    writeData(data);
    res.json({ message: "Замовлення видалено" });
};