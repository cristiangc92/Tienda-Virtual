import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewProduct = () => {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProducto({ ...producto, imagen: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("descripcion", producto.descripcion);
    formData.append("precio", producto.precio);
    formData.append("imagen", producto.imagen);

    try {
      await axios.post("https://tienda-virtual-n5qz.onrender.com/api/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al agregar producto", error);
      alert("Hubo un error al agregar el producto");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/admin"); // Redirige al panel de administración
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={producto.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={producto.descripcion} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input type="number" className="form-control" name="precio" value={producto.precio} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input type="file" className="form-control" name="imagen" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Producto</button>
      </form>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="modalExitoLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalExitoLabel">¡Éxito!</h5>
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <p>El producto ha sido agregado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleCloseSuccessModal}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProduct;
