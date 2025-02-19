const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Producto = require("../models/Producto");
const router = express.Router();

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

const upload = multer({ storage });

// Servir imágenes estáticas
router.use("/uploads", express.static("uploads"));

// Obtener todos los productos
router.get("/", async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// Crear producto con imagen subida
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevoProducto = await Producto.create({ nombre, descripcion, precio, imagen });
    res.json(nuevoProducto);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Modificar un producto
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    // Buscar el producto en la base de datos
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Crear un objeto para los datos que serán actualizados
    const updatedData = {};

    // Solo actualizamos los campos que se pasaron en la solicitud
    if (nombre) updatedData.nombre = nombre;
    if (descripcion) updatedData.descripcion = descripcion;
    if (precio) updatedData.precio = precio;

    // Si se sube una nueva imagen, la agregamos al objeto de actualización
    if (req.file) {
      updatedData.imagen = `/uploads/${req.file.filename}`;
    }

    // Actualizar el producto con los datos proporcionados
    await producto.update(updatedData);

    res.json(producto);
  } catch (error) {
    console.error("Error al modificar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto en la base de datos
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si el producto tiene una imagen
    if (producto.imagen) {
      const imagePath = path.join(__dirname, "..", producto.imagen);

      // Eliminar el archivo de imagen si existe
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar el producto de la base de datos
    await producto.destroy();

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;