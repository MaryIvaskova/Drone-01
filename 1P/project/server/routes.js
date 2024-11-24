const express = require("express");
const router = express.Router();
const ordersController = require("./controllers/ordersController");

// Маршрути для роботи із замовленнями
router.get("/orders", ordersController.getAllOrders);
router.post("/orders", ordersController.createOrder);
router.put("/orders/:id", ordersController.updateOrder);
router.delete("/orders/:id", ordersController.deleteOrder);

module.exports = router;