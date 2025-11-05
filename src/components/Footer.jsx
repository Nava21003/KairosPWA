import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto text-white">
      <div className="footer-gradient">
        <Container className="py-5">
          <Row className="text-center text-md-start gy-4">
            {/* Columna 1: Marca y Redes Sociales */}
            <Col md={4}>
              <div className="mb-3">
                <i
                  className="bi bi-compass"
                  style={{ fontSize: "2.5rem", color: "#ffffff" }}
                ></i>
              </div>
              <h5 className="text-white fw-bold mb-3">
                <span style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                  Kairos
                </span>
              </h5>
              <p
                className="text-white-50 small mb-3"
                style={{ lineHeight: "1.6" }}
              >
                Tu compañero de exploración consciente. Descubre rutas
                personalizadas, mejora tu bienestar digital y transforma cada
                paseo en una oportunidad de crecimiento personal.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <a href="#" className="social-link">
                  <i
                    className="bi bi-facebook"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </a>
                <a href="#" className="social-link">
                  <i
                    className="bi bi-instagram"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </a>
                <a href="#" className="social-link">
                  <i
                    className="bi bi-twitter-x"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </a>
                <a href="#" className="social-link">
                  <i
                    className="bi bi-youtube"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </a>
              </div>
            </Col>

            {/* Columna 2: Exploración */}
            <Col md={4}>
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-map me-2" style={{ color: "#ffffff" }}></i>
                Exploración
              </h5>
              <Nav className="flex-column">
                <Nav.Link
                  as={NavLink}
                  to="/"
                  className="footer-link p-0 mb-2 d-flex align-items-center"
                >
                  <i className="bi bi-house-heart me-2"></i>
                  Inicio
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/promociones"
                  className="footer-link p-0 mb-2 d-flex align-items-center"
                >
                  <i className="bi bi-stars me-2"></i>
                  Descubre Lugares
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/rutas"
                  className="footer-link p-0 mb-2 d-flex align-items-center"
                >
                  <i className="bi bi-signpost-2 me-2"></i>
                  Mis Rutas
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/bienestar"
                  className="footer-link p-0 mb-2 d-flex align-items-center"
                >
                  <i className="bi bi-heart-pulse me-2"></i>
                  Bienestar Digital
                </Nav.Link>
              </Nav>
            </Col>

            {/* Columna 3: Contacto y Soporte */}
            <Col md={4}>
              <h5 className="text-white fw-bold mb-3">
                <i
                  className="bi bi-chat-dots me-2"
                  style={{ color: "#ffffff" }}
                ></i>
                Contacto
              </h5>
              <div className="text-white-50 small">
                <p className="mb-2 d-flex align-items-center">
                  <i
                    className="bi bi-envelope-fill me-2"
                    style={{ color: "#ffffff" }}
                  ></i>
                  <a
                    href="mailto:hola@kairos.app"
                    className="footer-link text-decoration-none"
                  >
                    hola@kairos.app
                  </a>
                </p>
                <p className="mb-2 d-flex align-items-center">
                  <i
                    className="bi bi-headset me-2"
                    style={{ color: "#ffffff" }}
                  ></i>
                  <span>Soporte 24/7</span>
                </p>
                <p className="mb-3 d-flex align-items-start">
                  <i
                    className="bi bi-geo-alt-fill me-2 mt-1"
                    style={{ color: "#ffffff" }}
                  ></i>
                  <span>León, Guanajuato, México</span>
                </p>
              </div>
              <div className="mt-3 d-flex flex-column gap-2">
                <Nav.Link
                  href="#"
                  className="footer-link p-0 small d-inline-flex align-items-center"
                >
                  <i className="bi bi-shield-check me-2"></i>
                  Privacidad y Seguridad
                </Nav.Link>
                <Nav.Link
                  href="#"
                  className="footer-link p-0 small d-inline-flex align-items-center"
                >
                  <i className="bi bi-file-text me-2"></i>
                  Términos de Servicio
                </Nav.Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Barra inferior de copyright */}
      <div className="footer-bottom">
        <Container className="py-3">
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="small mb-0 text-white-50">
                © {new Date().getFullYear()} Kairos. Transformando cada paso en
                crecimiento.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="small mb-0">
                <span className="text-white-50">Hecho con </span>
                <i
                  className="bi bi-heart-fill"
                  style={{ color: "#ffffff" }}
                ></i>
                <span className="text-white-50"> para tu bienestar</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{`
        .footer-gradient {
          background: #000000;
          border-top: 3px solid #333333;
        }

        .footer-bottom {
          background: #0a0a0a;
          backdrop-filter: blur(10px);
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.75) !important;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .footer-link:hover {
          color: #ffffff !important;
          transform: translateX(5px);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .social-link {
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .social-link:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }

        footer a {
          text-decoration: none;
        }

        footer h5 {
          position: relative;
          padding-bottom: 10px;
        }

        footer h5::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #ffffff, transparent);
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          footer h5::after {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
