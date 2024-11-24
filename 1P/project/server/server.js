const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = 3000;
const cors = require("cors");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Маршрути
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});