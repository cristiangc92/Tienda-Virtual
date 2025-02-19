require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const Producto = require("./models/Producto");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Conectar a la base de datos
db.sync({ force: false }) // Poner en true solo la primera vez para resetear la BD
  .then(() => console.log("Tablas sincronizadas"))
  .catch((err) => console.log("Error al sincronizar", err));

app.use("/api/productos", require("./routes/productos"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
