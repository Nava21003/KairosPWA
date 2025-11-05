import React from "react";
import { Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaTag,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";

const NavbarAdmin = ({ sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
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

          /* 👇 CLAVE PARA PEGAR EL BOTÓN ABAJO 👇 */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sidebar-collapsed { 
          width: 0;
          padding: 0;
        }

        .sidebar-header {
          text-align: center;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(6px);
          border-radius: 6px;
        }

        .nav-link-kairos { 
          color: #dcdcdc !important;
          margin-bottom: 6px;
          padding: 10px 14px !important;
          border-radius: 8px;
          display: flex;
          align-items: center;
          transition: all .25s;
          font-weight: 500;
        }

        .nav-link-kairos.active, 
        .nav-link-kairos:hover { 
          background: linear-gradient(90deg, #3e3e3e, #545454);
          color: white !important;
          transform: translateX(4px); 
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        }

        .logout-btn {
          background: #c0392b !important;
          border: none !important;
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
          opacity: .85;
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>

      {/* ENCABEZADO */}
      <div>
        <div className="sidebar-header mb-4 p-3">🏛️ Kairos Admin</div>

        <Nav className="flex-column px-3">
          <Nav.Link as={NavLink} to="/admin" end className="nav-link-kairos">
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/gestion"
            className="nav-link-kairos"
          >
            <FaMapMarkedAlt className="me-2" /> Gestión de POIs
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/promociones"
            className="nav-link-kairos"
          >
            <FaTag className="me-2" /> Promociones
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/usuarios"
            className="nav-link-kairos"
          >
            <FaUsers className="me-2" /> Usuarios
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/configuracion"
            className="nav-link-kairos"
          >
            <FaCogs className="me-2" /> Configuración
          </Nav.Link>
        </Nav>
      </div>

      {/* BOTÓN CERRAR SESIÓN PEGADO HASTA ABAJO */}
      <div className="px-3 mb-4">
        <Button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
