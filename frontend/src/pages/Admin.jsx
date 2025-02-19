import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "./Admin.css";

const Admin = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

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

    // Verificar si la imagen se está agregando correctamente al FormData
    console.log("FormData enviado:", formData);

    try {
      await axios.post("https://tienda-virtual-n5qz.onrender.com/api/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalTitle("Producto Agregado");
      setModalMessage("El producto ha sido agregado con éxito.");
      setShowModal(true);
      setProducto({ nombre: "", descripcion: "", precio: "", imagen: null });
    } catch (error) {
      console.log("Error al agregar producto:", error);
      setModalTitle("Error");
      setModalMessage("Hubo un error al agregar el producto.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Agregar Producto</h2>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="imagen"
                onChange={handleFileChange}
                required
              />
            </Form.Group>


            <Button type="submit" variant="primary" block>
              Agregar Producto
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Modal para mostrar mensajes de éxito o error */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
