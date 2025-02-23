import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    axios
      .get("https://tienda-virtual-n5qz.onrender.com/api/productos")
      .then((res) => setProductos(res.data));
  };

  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
  };

  const eliminarProducto = async (id) => {
    await axios.delete(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`);
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 mx-auto">Panel de Administración</span>
        </div>
      </nav>

      <button
        className="btn btn-primary my-3"
        onClick={() => navigate("/admin/nuevo")}
      >
        Agregar Nuevo Producto
      </button>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productos.map((producto) => (
          <div key={producto.id} className="col d-flex justify-content-center">
            <div className="card">
              <img
                src={producto.imagen}
                className="card-img-top img-producto"
                alt={producto.nombre}
              />
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text">
                  <strong>${producto.precio}</strong>
                </p>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/admin/editar/${producto.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEliminar"
                  onClick={() => confirmarEliminacion(producto)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      <div
        className="modal fade"
        id="modalEliminar"
        tabIndex="-1"
        aria-labelledby="modalEliminarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEliminarLabel">
                Confirmar Eliminación
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              {productoAEliminar && (
                <p>
                  ¿Estás seguro de que quieres eliminar <strong>{productoAEliminar.nombre}</strong>?
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => eliminarProducto(productoAEliminar.id)}
                data-bs-dismiss="modal"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer bg-body-tertiary mt-4">
        <div className="container-fluid text-center">
          <span className="mx-auto">Tienda Virtual© 2025. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
