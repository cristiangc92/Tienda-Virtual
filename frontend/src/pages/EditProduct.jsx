import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`)
      .then((res) => setProducto(res.data))
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setErrorMessage("Producto no encontrado.");
        } else {
          setErrorMessage("Error al cargar el producto.");
        }
        setShowErrorModal(true);
      });
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProducto({ ...producto, imagen: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (producto.nombre) formData.append("nombre", producto.nombre);
    if (producto.descripcion) formData.append("descripcion", producto.descripcion);
    if (producto.precio) formData.append("precio", producto.precio);
    if (producto.imagen instanceof File) {
      formData.append("imagen", producto.imagen);
    }

    try {
      await axios.put(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Hubo un error al actualizar el producto.");
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Producto</h2>
      <div className="p-4 bg-light rounded">
        <form className="d-flex flex-row align-items-center gap-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="nombre" value={producto.nombre} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Descripción</label>
            <textarea className="form-control" name="descripcion" value={producto.descripcion} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Precio</label>
            <input type="number" className="form-control" name="precio" value={producto.precio} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Imagen</label>
            <input type="file" className="form-control" name="imagen" onChange={handleFileChange} />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="button" className="btn btn-warning w-100" onClick={() => setShowModal(true)}>
              Confirmar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Edición</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres guardar los cambios del producto <strong>{producto.nombre}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => { handleSubmit(); setShowModal(false); }}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¡Éxito!</h5>
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body">
                <p>El producto ha sido actualizado con éxito.</p>
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

      {/* Modal de Error */}
      {showErrorModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Error</h5>
                <button type="button" className="btn-close" onClick={() => setShowErrorModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{errorMessage}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowErrorModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
