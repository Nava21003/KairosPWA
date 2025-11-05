import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Table,
  Button,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Explorar = () => {
  return (
    <>
      {/* Sección 1: Hero de Exploración / Título Principal */}
      <section
        className="exploration-hero-section text-dark d-flex align-items-center position-relative py-5"
        aria-labelledby="main-title"
      >
        <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1
                id="main-title"
                className="display-4 fw-bold mb-3"
                style={{ color: "#2d5016" }}
              >
                KAIROS: Tu Camino a la Mejora
              </h1>
              <p
                className="lead mb-4"
                style={{
                  fontSize: "1.3rem",
                  lineHeight: "1.8",
                  color: "rgba(45, 80, 22, 0.75)",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
              >
                Conoce el ecosistema digital que fusiona la{" "}
                <strong>Inteligencia Artificial</strong> con el{" "}
                <strong>Bienestar Digital</strong>, transformando tu uso pasivo
                de la tecnología en crecimiento personal tangible.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                <span className="info-tag-badge success">
                  <i className="bi bi-android2 me-2" aria-hidden="true"></i>
                  App Nativa Android
                </span>
                <span className="info-tag-badge primary">
                  <i className="bi bi-globe me-2" aria-hidden="true"></i>
                  Portal Web PWA
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 2: Idea Central y Plataformas Desacopladas */}
      <section className="purpose-section py-5" aria-labelledby="central-idea">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <span className="section-label">Idea Central</span>
              <h2
                id="central-idea"
                className="display-5 fw-bold text-dark mt-3 mb-4"
              >
                Red Inteligente para la Mejora Personal y la Planificación de
                Rutas
              </h2>
              <p className="text-secondary lead">
                KAIROS es un <strong>Coach Proactivo</strong> que sugiere
                acciones en el mundo real, promoviendo la{" "}
                <strong>exploración consciente</strong> y el{" "}
                <strong>bienestar digital</strong>.
              </p>

              <h3 className="fw-bold mt-4 mb-3" style={{ color: "#4a7c59" }}>
                Dos Plataformas, un Ecosistema:
              </h3>
              <ListGroup variant="flush" className="platform-list">
                <ListGroup.Item className="d-flex align-items-start">
                  <i
                    className="bi bi-phone-fill me-3 mt-1"
                    style={{ color: "#2d5016" }}
                    aria-hidden="true"
                  ></i>
                  <div>
                    <strong>
                      Aplicación Nativa Android (Motor de Experiencia):
                    </strong>{" "}
                    El núcleo para el usuario final. Maneja el descubrimiento,
                    las rutas, el coaching con IA y la seguridad.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start">
                  <i
                    className="bi bi-laptop-fill me-3 mt-1"
                    style={{ color: "#5f9ea0" }}
                    aria-hidden="true"
                  ></i>
                  <div>
                    <strong>
                      PWA/Portal Web (Centro de Administración y Marketing):
                    </strong>{" "}
                    Enfocado en la gestión de contenidos (CRUDS), la
                    monetización y la promoción.
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col lg={6} className="text-center">
              <div className="mockup-diagram-wrapper">
                <div
                  className="phone-mockup-small"
                  aria-label="Mockup de la aplicación móvil KAIROS"
                >
                  <div className="mockup-screen-small">
                    <div className="screen-content-small">
                      <i
                        className="bi bi-compass-fill"
                        style={{ fontSize: "5rem", color: "#90ee90" }}
                        aria-hidden="true"
                      ></i>
                      <h3 className="text-white mt-2 fw-bold">KAIROS APP</h3>
                      <p className="text-white-50 small mb-0">Rutas e IA</p>
                    </div>
                  </div>
                </div>
                <i
                  className="bi bi-arrow-left-right exchange-icon"
                  aria-hidden="true"
                ></i>
                <div
                  className="web-mockup-small"
                  aria-label="Mockup del portal de administración"
                >
                  <i
                    className="bi bi-bar-chart-fill"
                    style={{ fontSize: "3rem", color: "#4a7c59" }}
                    aria-hidden="true"
                  ></i>
                  <h3 className="fw-bold mt-2" style={{ color: "#2d5016" }}>
                    Admin Portal
                  </h3>
                  <p className="text-secondary small mb-0">Gestión y BI</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 3: Arquitectura y Componentes Clave */}
      <section
        className="features-section py-5 bg-light-green"
        aria-labelledby="architecture-title"
      >
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label light">Arquitectura</span>
            <h2
              id="architecture-title"
              className="display-5 fw-bold text-dark mt-3 mb-2"
            >
              Microservicios Desacoplados
            </h2>
            <p className="text-secondary lead">
              Elegimos una arquitectura de Microservicios Desacoplados para
              garantizar <strong>Escalabilidad</strong>,{" "}
              <strong>Flexibilidad Tecnológica</strong> y{" "}
              <strong>Resiliencia Operacional</strong>.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="arch-card h-100 green">
                <Card.Body className="d-flex flex-column">
                  <div className="arch-icon">
                    <i className="bi bi-cpu" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold mb-2">
                    Motor de IA y Rutas
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    Microservicio independiente para el procesamiento intensivo
                    de modelos de Machine Learning (Python/TensorFlow) que
                    generan rutas optimizadas y el coaching proactivo.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="arch-card h-100 teal">
                <Card.Body className="d-flex flex-column">
                  <div className="arch-icon">
                    <i className="bi bi-currency-dollar" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold mb-2">
                    Monetización y BI
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    Encargado de recibir eventos de conversión (clics en
                    promociones) y alimentar el Dashboard con métricas clave. Su
                    fallo no detiene la experiencia central.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="arch-card h-100 sage">
                <Card.Body className="d-flex flex-column">
                  <div className="arch-icon">
                    <i className="bi bi-key-fill" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold mb-2">
                    Servicio de Autenticación
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    Gestión separada y segura de usuarios finales (App Android)
                    y administradores (PWA), garantizando el Control de Acceso
                    basado en Roles (RBAC).
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="arch-card h-100 extra">
                <Card.Body className="d-flex flex-column">
                  <div className="arch-icon">
                    <i className="bi bi-journal-album" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold mb-2">
                    Servicio de Contenido (POIs)
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    CRUD para Lugares, categorías de interés y metadatos.
                    Consumido por la App para mostrar el mapa interactivo y por
                    el motor de rutas.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="arch-card h-100 api-gateway">
                <Card.Body className="d-flex flex-column">
                  <div className="arch-icon">
                    <i className="bi bi-router-fill" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold mb-2">API Gateway</Card.Title>
                  <Card.Text className="flex-grow-1">
                    El único punto de entrada de la aplicación. Dirige el
                    tráfico de manera eficiente al microservicio
                    correspondiente, aislando la lógica interna.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 4: Confianza y Seguridad (Requerimientos No Funcionales) */}
      <section
        className="security-section py-5 bg-light-green"
        aria-labelledby="security-title"
      >
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label light">Confianza y Resiliencia</span>
            <h2
              id="security-title"
              className="display-5 fw-bold text-dark mt-3 mb-2"
            >
              Nuestra Prioridad es la Seguridad y Fiabilidad
            </h2>
            <p className="text-secondary lead">
              Requerimientos No Funcionales que garantizan la calidad y
              estabilidad de KAIROS.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="security-card h-100">
                <Card.Body className="d-flex flex-column text-center">
                  <div className="security-icon icon-1">
                    <i
                      className="bi bi-shield-lock-fill"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <Card.Title className="fw-bold">Control de Acceso</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Implementación de{" "}
                    <strong>RBAC (Role-Based Access Control)</strong> para
                    restringir el acceso a funcionalidades sensibles como los
                    CRUDs y el BI.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="security-card h-100">
                <Card.Body className="d-flex flex-column text-center">
                  <div className="security-icon icon-2">
                    <i className="bi bi-clock-history" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold">
                    Rendimiento Crítico
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    El tiempo de respuesta de transacciones críticas (generación
                    de ruta y obtención de POIs) debe ser{" "}
                    <strong>inferior a 1 segundo</strong>.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="security-card h-100">
                <Card.Body className="d-flex flex-column text-center">
                  <div className="security-icon icon-3">
                    <i className="bi bi-wifi-off" aria-hidden="true"></i>
                  </div>
                  <Card.Title className="fw-bold">
                    Resiliencia Offline
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    El módulo de Rutas y Lugares en Android permitirá la{" "}
                    <strong>Persistencia de Datos para Uso Offline</strong> para
                    acceder a información vital sin cobertura.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Final */}
      <section
        className="cta-section py-5 text-white text-center"
        aria-labelledby="cta-title"
      >
        <div className="cta-decoration-top" aria-hidden="true"></div>
        <Container className="py-5">
          <div className="cta-content">
            <div className="cta-icon-wrapper mb-4">
              <i
                className="bi bi-stars"
                style={{ fontSize: "3.5rem", color: "#90ee90" }}
                aria-hidden="true"
              ></i>
            </div>
            <h2 id="cta-title" className="display-5 fw-bold mb-4">
              ¿Listo para unirte a la Exploración Real?
            </h2>
            <p
              className="lead mb-5 text-white-50"
              style={{ maxWidth: "700px", margin: "0 auto 2rem" }}
            >
              Descubre el poder de KAIROS en tu día a día y convierte el scroll
              infinito en experiencias significativas.
            </p>
            <Button
              as={NavLink}
              to="/inicio"
              size="lg"
              className="cta-final-btn px-5 py-3"
            >
              <i className="bi bi-download me-2" aria-hidden="true"></i>
              Volver al Inicio para Descargar
            </Button>
          </div>
        </Container>
        <div className="cta-decoration-bottom" aria-hidden="true"></div>
      </section>

      {/* Estilos CSS */}
      <style>{`
        /* --- General Styling for Consistency --- */
        .section-label {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(144, 238, 144, 0.15);
          border: 1px solid #4a7c59;
          border-radius: 50px;
          color: #2d5016;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section-label.light {
          background: rgba(143, 188, 143, 0.15);
          border-color: #8fbc8f;
          color: #4a7c59;
        }

        .bg-light-green {
          background-color: #f7fcf7;
        }

        .info-tag-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1.25rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .info-tag-badge.success {
            background-color: #e6ffe6;
            border: 1px solid #4a7c59;
            color: #2d5016;
        }

        .info-tag-badge.primary {
            background-color: #e6f7ff;
            border: 1px solid #5f9ea0;
            color: #5f9ea0;
        }

        /* --- Exploration Hero Section --- */
        .exploration-hero-section {
          background: linear-gradient(180deg, #ffffff 0%, #f7fcf7 100%);
          min-height: 50vh;
        }

        /* --- Platform List (Section 2) --- */
        .platform-list .list-group-item {
            border: none;
            background-color: transparent;
            font-size: 1.05rem;
            line-height: 1.5;
            padding: 0.75rem 0;
        }

        /* Mockup Diagram Wrapper */
        .mockup-diagram-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 3rem 0;
            flex-wrap: wrap;
        }

        .phone-mockup-small, .web-mockup-small {
            transition: transform 0.3s ease;
            padding: 1.5rem;
            border-radius: 20px;
            text-align: center;
        }

        .phone-mockup-small {
            width: 200px;
            height: 400px;
            background: #1a1a1a;
            border-radius: 30px;
            padding: 8px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .mockup-screen-small {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .web-mockup-small {
            background-color: #ffffff;
            border: 2px solid #e0e0e0;
            width: 220px;
            height: 180px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .exchange-icon {
            font-size: 2.5rem;
            color: #4a7c59;
            animation: pulse-exchange 2s infinite ease-in-out;
        }

        @keyframes pulse-exchange {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }

        /* --- Architecture Section (Section 3) --- */
        .arch-card {
            background: #ffffff;
            border-radius: 15px;
            border: 1px solid rgba(74, 124, 89, 0.15);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            text-align: center;
        }

        .arch-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(74, 124, 89, 0.1);
        }

        .arch-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 2rem;
            background: rgba(74, 124, 89, 0.1);
            color: #4a7c59;
        }
        
        .arch-card.teal .arch-icon { 
            color: #5f9ea0; 
            background: rgba(95, 158, 160, 0.1); 
        }
        
        .arch-card.sage .arch-icon { 
            color: #8fbc8f; 
            background: rgba(143, 188, 143, 0.1); 
        }
        
        .arch-card.extra .arch-icon { 
            color: #2d5016; 
            background: rgba(45, 80, 22, 0.1); 
        }
        
        .arch-card.api-gateway .arch-icon { 
            color: #5f9ea0; 
            background: rgba(95, 158, 160, 0.1); 
        }

        /* --- Scope Table (Section 4) --- */
        .scope-table {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .scope-table thead th {
            border: none;
            padding: 1.25rem 1rem;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .scope-table tbody tr td {
            padding: 1rem;
            vertical-align: top;
            font-size: 0.95rem;
        }
        
        .bg-success-light { 
            background-color: #e6ffe6 !important; 
            color: #2d5016; 
        }
        
        .bg-primary-light { 
            background-color: #e6f7ff !important; 
            color: #5f9ea0; 
        }
        
        .bg-warning-light { 
            background-color: #fff8e1 !important; 
            color: #b58d09; 
        }
        
        /* --- Security Section (Section 5) --- */
        .security-card {
            background: #ffffff;
            border-radius: 15px;
            border: 1px solid #e0e0e0;
            transition: all 0.3s ease;
            height: 100%;
        }

        .security-card:hover {
            border-color: #4a7c59;
            box-shadow: 0 8px 20px rgba(74, 124, 89, 0.1);
        }

        .security-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.8rem;
        }
        
        .icon-1 { 
            background-color: rgba(74, 124, 89, 0.2); 
            color: #2d5016; 
        }
        
        .icon-2 { 
            background-color: rgba(95, 158, 160, 0.2); 
            color: #5f9ea0; 
        }
        
        .icon-3 { 
            background-color: rgba(143, 188, 143, 0.2); 
            color: #8fbc8f; 
        }

        /* --- CTA Final --- */
        .cta-section {
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #5f9ea0 100%);
          position: relative;
          overflow: hidden;
          margin-top: 4rem;
        }

        .cta-decoration-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: #ffffff;
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%);
        }

        .cta-decoration-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
        }

        .cta-icon-wrapper {
          width: 100px;
          height: 100px;
          background: rgba(144, 238, 144, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 30px rgba(144, 238, 144, 0.3);
        }

        .cta-final-btn {
          background: white;
          color: #2d5016;
          border: none;
          font-weight: 700;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .cta-final-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          background: #90ee90;
          color: #2d5016;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .mockup-diagram-wrapper {
            gap: 1rem;
          }
          
          .phone-mockup-small {
            width: 150px;
            height: 300px;
          }
          
          .web-mockup-small {
            width: 180px;
            height: 150px;
          }
          
          .exchange-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Explorar;
