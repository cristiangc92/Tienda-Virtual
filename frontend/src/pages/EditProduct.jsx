import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });

  useEffect(() => {
    // Obtener los datos del producto
    axios.get(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`).then((res) => {
      setProducto(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // Si el usuario selecciona una nueva imagen, se guarda en el estado
    setProducto({ ...producto, imagen: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Solo agregar los campos que fueron modificados
    if (producto.nombre) formData.append("nombre", producto.nombre);
    if (producto.descripcion) formData.append("descripcion", producto.descripcion);
    if (producto.precio) formData.append("precio", producto.precio);

    // Si hay una nueva imagen seleccionada, agregarla
    if (producto.imagen instanceof File) {
      formData.append("imagen", producto.imagen);
    }

    try {
      // Enviar los cambios al backend
      await axios.put(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Producto actualizado con éxito");
      navigate("/");  // Redirigir al home o a la página que desees
    } catch (error) {
      console.error("Error al modificar producto", error);
      alert("Hubo un error al actualizar el producto");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            className="form-control"
            name="imagen"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
