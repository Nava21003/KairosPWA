import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importamos hooks necesarios
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const MiNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para manejar la navegación del logo
  const handleBrandClick = () => {
    navigate("/");
  };

  // Componente auxiliar para los enlaces del menú
  // Esto mantiene tu código limpio y aplica la lógica de ocultar la URL
  const CustomNavItem = ({ to, children, className, end = false }) => {
    // Lógica para saber si el item está activo
    const isActive = end
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <div
        onClick={() => navigate(to)}
        className={`nav-link ${className} ${isActive ? "active" : ""}`}
        style={{ cursor: "pointer" }} // Importante para que parezca un botón
      >
        {children}
      </div>
    );
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="shadow-sm navbar-kairos"
      >
        <Container fluid className="px-4">
          {/* BRAND / LOGO - También convertido a div con onClick */}
          <Navbar.Brand
            onClick={handleBrandClick}
            className="fw-bold d-flex align-items-center navbar-brand-kairos"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
          >
            <i
              className="bi bi-compass me-2"
              style={{ fontSize: "1.8rem", color: "#ffffff" }}
            ></i>
            <span className="text-white brand-text">Kairos</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-0 navbar-toggler-kairos"
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-lg-center">
              <CustomNavItem
                to="/"
                end={true}
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-house-heart me-2"></i> Inicio
              </CustomNavItem>

              <CustomNavItem
                to="/explorar"
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-map me-2"></i> Explorar
              </CustomNavItem>

              <CustomNavItem
                to="/contacto"
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-envelope me-2"></i> Contáctanos
              </CustomNavItem>

              <CustomNavItem
                to="/faq"
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-question-circle me-2"></i> FAQ
              </CustomNavItem>
            </Nav>

            <Nav className="ms-auto align-items-lg-center">
              <CustomNavItem
                to="/login"
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-person-circle me-2"></i> Acceder
              </CustomNavItem>

              <CustomNavItem
                to="/registro"
                className="nav-link-custom px-3 py-2 mx-1"
              >
                <i className="bi bi-person-plus-fill me-2"></i> Registrarse
              </CustomNavItem>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style>{`
        .navbar-kairos {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%) !important;
          border-bottom: 3px solid #404040 !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .brand-text {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* Nota: Se aplica 'nav-link' base de bootstrap + tu clase custom */
        .nav-link-custom {
          color: rgba(255, 255, 255, 0.95) !important;
          font-weight: 500;
          font-size: 1.05rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          backdrop-filter: blur(10px);
          display: flex;       /* Asegura alineación correcta de iconos */
          align-items: center; /* Centrado vertical */
        }

        .nav-link-custom:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .nav-link-custom.active {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.2);
          font-weight: 600;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .nav-link-custom.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 3px;
          background: linear-gradient(90deg, #ffffff, #cccccc);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        }

        .navbar-brand-kairos:hover {
          transform: scale(1.05) rotate(2deg);
          transition: transform 0.3s ease;
        }

        .navbar-toggler-kairos {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }

        .navbar-toggler-kairos:focus {
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.4) !important;
        }

        @media (max-width: 991px) {
          .nav-link-custom {
            margin: 0.25rem 0;
          }
          
          .ms-auto {
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: 0.5rem;
            padding-top: 0.5rem;
          }

          .nav-link-custom.active::after {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default MiNavbar;
