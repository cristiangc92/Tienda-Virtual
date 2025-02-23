import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import EditProduct from "./pages/EditProduct";
import NewProduct from "./pages/NewProduct"; // Agregar esta importación
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/editar/:id" element={<EditProduct />} />
        <Route path="/admin/nuevo" element={<NewProduct />} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
