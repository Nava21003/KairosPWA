import React, { useContext } from "react"; // <--- 1. Agrega useContext
import { Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../Context/Auth/AuthContext"; // <--- 2. Importa tu AuthContext

import {
  FaHome,
  FaLayerGroup,
  FaHeart,
  FaHandshake,
  FaStore,
  FaRoute,
  FaMapMarkerAlt,
  FaTags,
  FaUsers,
  FaUserShield,
  FaBell,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const NavbarAdmin = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  // 3. Extraemos la función logout del contexto
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // <--- 4. Ejecutamos la limpieza de datos
    navigate("/"); // <--- 5. Luego redirigimos
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <style>{`
        .sidebar { 
          width: 260px; 
          background: linear-gradient(180deg, #1b1b1d, #2b2b2e, #141414);
          color: #dcdcdc; 
          transition: width .3s, transform .3s; 
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          box-shadow: 4px 0 15px rgba(0,0,0,0.45);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Scrollbar personalizado para el sidebar */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
        }

        .sidebar-collapsed { 
          width: 0;
          padding: 0;
          overflow: hidden;
        }

        .sidebar-header {
          text-align: center;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(6px);
          border-radius: 0 0 6px 6px;
        }

        .sidebar-divider {
            font-size: 0.70rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #6c757d;
            margin: 20px 0 8px 10px;
            font-weight: 700;
            opacity: 0.8;
        }

        .nav-link-kairos { 
          color: #dcdcdc !important;
          margin-bottom: 4px;
          padding: 10px 14px !important;
          border-radius: 8px;
          display: flex;
          align-items: center;
          transition: all .25s;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .nav-link-kairos:hover { 
          background: rgba(255, 255, 255, 0.1);
          color: white !important;
          transform: translateX(4px); 
        }

        .nav-link-kairos.active { 
          background: linear-gradient(90deg, #3e3e3e, #545454);
          color: #4ecca3 !important;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        }

        .logout-btn {
          background: rgba(192, 57, 43, 0.1) !important;
          color: #e74c3c !important;
          border: 1px solid #e74c3c !important;
          width: 100%;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: .25s;
        }

        .logout-btn:hover {
          background: #c0392b !important;
          color: white !important;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
        }
      `}</style>

      <div>
        <div className="sidebar-header mb-3 p-3">🏛️ Kairos Admin</div>

        <Nav className="flex-column px-3">
          {/* === SECCIÓN: PRINCIPAL === */}
          <Nav.Link as={NavLink} to="/admin" end className="nav-link-kairos">
            <FaHome className="me-3" /> Dashboard
          </Nav.Link>

          {/* === SECCIÓN: GESTIÓN DE CONTENIDO === */}
          <div className="sidebar-divider">Gestión de Contenido</div>

          <Nav.Link
            as={NavLink}
            to="/admin/categorias"
            className="nav-link-kairos"
          >
            <FaLayerGroup className="me-3" /> Categorías
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/intereses"
            className="nav-link-kairos"
          >
            <FaHeart className="me-3" /> Intereses
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/lugares"
            className="nav-link-kairos"
          >
            <FaStore className="me-3" /> Lugares
          </Nav.Link>

          <Nav.Link as={NavLink} to="/admin/rutas" className="nav-link-kairos">
            <FaRoute className="me-3" /> Rutas
          </Nav.Link>

          <Nav.Link as={NavLink} to="/admin/pois" className="nav-link-kairos">
            <FaMapMarkerAlt className="me-3" /> Puntos de Interés
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/promociones"
            className="nav-link-kairos"
          >
            <FaTags className="me-3" /> Promociones
          </Nav.Link>

          {/* === SECCIÓN: ADMINISTRACIÓN === */}
          <div className="sidebar-divider">Administración</div>

          <Nav.Link as={NavLink} to="/admin/socios" className="nav-link-kairos">
            <FaHandshake className="me-3" /> Socios Afiliados
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/usuarios"
            className="nav-link-kairos"
          >
            <FaUsers className="me-3" /> Usuarios
          </Nav.Link>

          <Nav.Link as={NavLink} to="/admin/roles" className="nav-link-kairos">
            <FaUserShield className="me-3" /> Roles y Permisos
          </Nav.Link>

          {/* === SECCIÓN: COMUNICACIÓN & DATOS (NUEVO) === */}
          <div className="sidebar-divider">Comunicación & Monitoreo</div>

          <Nav.Link
            as={NavLink}
            to="/admin/notificaciones"
            className="nav-link-kairos"
          >
            <FaBell className="me-3" /> Notificaciones
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/actividad"
            className="nav-link-kairos"
          >
            <FaChartLine className="me-3" /> Actividad Global
          </Nav.Link>

          {/* === SECCIÓN: SISTEMA === */}
          <div className="sidebar-divider">Sistema</div>

          <Nav.Link
            as={NavLink}
            to="/admin/configuracion"
            className="nav-link-kairos"
          >
            <FaCog className="me-3" /> Configuración
          </Nav.Link>
        </Nav>
      </div>

      <div className="px-3 mb-4">
        <Button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
