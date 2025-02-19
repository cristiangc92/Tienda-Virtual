const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Producto = require("../models/Producto");
const router = express.Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'djfobc4lo',  // Reemplaza con tu Cloud name
  api_key: '526842571593466',  // Reemplaza con tu API Key
  api_secret: 'l6rttKHtsAwYuNAzQkMOcxEynlk'  // Reemplaza con tu API Secret
});

// Configuración de Multer para usar memoria (no almacenamos localmente)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("imagen");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear producto con imagen subida a Cloudinary
router.post("/", upload.single("imagen"), async (req, res) => {
  console.log('Archivo recibido:', req.file); // Verifica si el archivo está presente en req.file
  try {
    const { nombre, descripcion, precio } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevoProducto = await Producto.create({ nombre, descripcion, precio, imagen });
    res.json(nuevoProducto);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Modificar un producto
router.put("/:id", upload, async (req, res) => {
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
      // Subir la nueva imagen a Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "productos",
        use_filename: true,
        unique_filename: true
      });

      updatedData.imagen = result.secure_url;  // URL de la nueva imagen
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
      // Extraer el ID de la imagen de la URL (esto depende de cómo almacenes la URL de la imagen)
      const imageId = producto.imagen.split('/').pop().split('.')[0]; // Asumiendo que la URL es algo como: https://res.cloudinary.com/.../imagen.jpg
      
      // Eliminar la imagen de Cloudinary
      await cloudinary.uploader.destroy(imageId);
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
