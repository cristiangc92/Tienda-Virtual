import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get("https://tienda-virtual-n5qz.onrender.com/api/productos").then((res) => setProductos(res.data));
    }, []);

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            await axios.delete(`https://tienda-virtual-n5qz.onrender.com/api/productos/${id}`);
            setProductos(productos.filter((producto) => producto.id !== id));
        }
    };

    return (
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1 mx-auto">Tienda Virtual</span>
            </div>
          </nav>
      
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {productos.map((producto) => (
              <div key={producto.id} className="col d-flex justify-content-center">
                <div className="card">
                  <img
                    src={`https://tienda-virtual-n5qz.onrender.com/${producto.imagen}`}
                    className="card-img-top img-producto"
                    alt={producto.nombre}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.descripcion}</p>
                    <p className="card-text">
                      <strong>${producto.precio}</strong>
                    </p>
                    <a
                      href={`https://wa.me/123456789?text=Hola, me interesa ${producto.nombre}`}
                      className="btn btn-success"
                    >
                      <i className="fab fa-whatsapp"></i> Comprar
                    </a>
                    <button
                      className="btn btn-warning ms-2"
                      onClick={() => window.location.href = `/admin/${producto.id}`}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <footer className="footer bg-body-tertiary">
                <div className="container-fluid text-center">
                    <span className="mx-auto">Tienda Virtual© 2025. Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
      );
}      

export default Home;
