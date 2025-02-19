const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Producto = db.define("producto", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    imagen: { type: DataTypes.STRING }, // Ahora puede ser una URL o un archivo local
  });

module.exports = Producto;
