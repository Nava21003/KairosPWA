import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Accordion,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setFaqs([
          {
            idPregunta: 1,
            categoria: "General",
            pregunta: "¿Qué es KAIROS?",
            respuesta:
              "KAIROS es una plataforma diseñada para ayudarte a gestionar tu bienestar digital, permitiéndote desconectar de la tecnología y reconectar con el mundo real a través de rutas y actividades personalizadas.",
            estatus: "visible",
          },
          {
            idPregunta: 2,
            categoria: "Suscripción",
            pregunta: "¿La aplicación tiene costo?",
            respuesta:
              "La descarga es gratuita. Ofrecemos una versión básica con funcionalidades limitadas y una suscripción Premium que desbloquea rutas exclusivas y estadísticas avanzadas de bienestar.",
            estatus: "visible",
          },
          {
            idPregunta: 3,
            categoria: "Seguridad",
            pregunta: "¿Mis datos de ubicación son privados?",
            respuesta:
              "Absolutamente. Tu privacidad es nuestra prioridad. Los datos de ubicación solo se usan en tiempo real para la navegación y nunca se comparten con terceros sin tu consentimiento explícito.",
            estatus: "visible",
          },
          {
            idPregunta: 4,
            categoria: "Técnico",
            pregunta: "¿Cómo creo una ruta personalizada?",
            respuesta:
              "Ve a la sección 'Mis Rutas', selecciona el botón '+' y elige los puntos de interés que desees conectar. Nuestro algoritmo optimizará el trayecto para ti.",
            estatus: "visible",
          },
          {
            idPregunta: 5,
            categoria: "Comunidad",
            pregunta: "¿Puedo sugerir un lugar nuevo?",
            respuesta:
              "¡Sí! Nos encanta que la comunidad participe. Puedes sugerir nuevos puntos de interés desde tu perfil en la sección 'Colaborar'.",
            estatus: "visible",
          },
        ]);
        setLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeKey, setActiveKey] = useState("0");

  const getIconByCategory = (category) => {
    if (!category) return "bi-question-circle";
    const cat = category.toLowerCase();

    if (cat.includes("general")) return "bi-stars";
    if (cat.includes("suscripción") || cat.includes("pago"))
      return "bi-wallet2";
    if (cat.includes("seguridad")) return "bi-shield-check";
    if (cat.includes("técnico") || cat.includes("app")) return "bi-wifi-off";
    if (cat.includes("privacidad") || cat.includes("datos"))
      return "bi-fingerprint";
    if (cat.includes("plataforma") || cat.includes("móvil")) return "bi-phone";
    if (cat.includes("rutas") || cat.includes("mapa")) return "bi-map";
    if (cat.includes("comunidad")) return "bi-people";

    return "bi-question-circle";
  };

  const filteredFaqs = faqs.filter((item) => {
    const rawStatus = item.estatus ? String(item.estatus) : "";
    const status = rawStatus.toLowerCase();
    const isVisible =
      status === "visible" || status === "1" || status === "true";

    const term = searchTerm.toLowerCase();

    const matchesSearch =
      item.pregunta.toLowerCase().includes(term) ||
      item.respuesta.toLowerCase().includes(term) ||
      (item.categoria && item.categoria.toLowerCase().includes(term));

    return isVisible && matchesSearch;
  });

  return (
    <>
      <section className="faq-section position-relative overflow-hidden">
        <div className="faq-bg-gradient"></div>
        <div className="faq-particles"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>

        <Container
          className="pt-5 pb-5 position-relative"
          style={{ zIndex: 10 }}
        >
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <div className="d-inline-block mb-3">
                <span className="badge-custom">
                  <i className="bi bi-life-preserver me-2"></i> Centro de Ayuda
                </span>
              </div>
              <h1 className="display-4 fw-bold text-white mb-3">
                ¿Cómo podemos <span className="text-highlight">ayudarte?</span>
              </h1>
              <p className="text-white-50 lead mb-5">
                Resuelve tus dudas sobre KAIROS y empieza tu desconexión digital
                sin contratiempos.
              </p>

              <div className="search-box-wrapper mx-auto">
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="bg-transparent border-0 ps-4 text-light-green">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar temas (ej. seguridad, precio...)"
                    className="bg-transparent border-0 py-3 ps-2 text-white shadow-none search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="link"
                      className="text-white-50 text-decoration-none pe-4 border-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={9}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="text-white-50 mt-2">Cargando preguntas...</p>
                </div>
              ) : filteredFaqs.length > 0 ? (
                <Accordion
                  defaultActiveKey="0"
                  className="custom-accordion gap-3 d-flex flex-column"
                  onSelect={(e) => setActiveKey(e)}
                >
                  {filteredFaqs.map((item, index) => {
                    const key = item.idPregunta || index;
                    const isActive = activeKey === index.toString();
                    const iconClass = getIconByCategory(item.categoria);

                    return (
                      <Accordion.Item
                        eventKey={index.toString()}
                        key={key}
                        className={`accordion-card border-0 rounded-4 overflow-hidden mb-0 ${
                          isActive ? "is-active" : ""
                        }`}
                      >
                        <Accordion.Header>
                          <div className="d-flex align-items-center w-100 pe-3">
                            <div
                              className={`icon-box me-3 ${isActive ? "active" : ""}`}
                            >
                              <i className={`bi ${iconClass}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <span
                                className={`category-text d-block mb-1 ${
                                  isActive ? "text-success" : "text-muted"
                                }`}
                              >
                                {item.categoria || "General"}
                              </span>
                              <span className="fw-bold text-dark h6 m-0 d-block text-start question-text">
                                {item.pregunta}
                              </span>
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="pt-0 ps-5 ms-4 text-secondary text-start">
                          <div className="response-line mb-2"></div>
                          {item.respuesta}
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="text-center py-5 empty-state">
                  <div className="mb-3 icon-container">
                    <i className="bi bi-search display-4 text-white-50"></i>
                  </div>
                  <h4 className="text-white fw-bold">Sin resultados</h4>
                  <p className="text-white-50">
                    No encontramos preguntas visibles que coincidan con "
                    {searchTerm}"
                  </p>
                  <Button
                    variant="outline-success"
                    onClick={() => setSearchTerm("")}
                    className="rounded-pill px-4 btn-reset"
                  >
                    Ver todas las preguntas
                  </Button>
                </div>
              )}
            </Col>
          </Row>

          {/* === CTA === */}
          <div className="text-center mt-5 pt-4">
            <p className="text-white-50 mb-3 small">
              ¿No encontraste lo que buscabas?
            </p>
            <NavLink
              to="/contacto"
              className="btn-contact-support text-decoration-none fw-bold"
            >
              Contactar a Soporte Técnico{" "}
              <i className="bi bi-arrow-right ms-1"></i>
            </NavLink>
          </div>
        </Container>
      </section>

      <style>{`
        /* === VARIABLES (Coinciden con los otros archivos) === */
        :root {
          --color-primary: #1e4d2b;
          --color-secondary: #2d7a3e;
          --color-accent: #3d9651;
          --color-light-green: #90ee90;
        }

        .faq-section {
          background: #0a1f0f;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        /* === FONDO ANIMADO === */
        .faq-bg-gradient {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 10% 20%, #1e4d2b 0%, #0a1f0f 40%),
                      radial-gradient(circle at 90% 80%, #2d5016 0%, #0a1f0f 40%);
          z-index: 1;
        }

        .faq-particles {
          position: absolute; inset: 0;
          background-image: radial-gradient(1.5px 1.5px at 50% 50%, rgba(144, 238, 144, 0.2), transparent);
          background-size: 100px 100px;
          animation: particlesMove 60s linear infinite;
          z-index: 2;
          opacity: 0.5;
        }
        @keyframes particlesMove {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }

        /* === ELEMENTOS FLOTANTES === */
        .floating-shape {
          position: absolute;
          filter: blur(80px);
          z-index: 1;
          animation: floatShape 10s ease-in-out infinite;
        }
        .shape-1 {
          width: 300px; height: 300px;
          background: rgba(144, 238, 144, 0.1);
          top: -100px; left: -100px;
          border-radius: 50%;
        }
        .shape-2 {
          width: 400px; height: 400px;
          background: rgba(95, 158, 160, 0.1);
          bottom: -100px; right: -100px;
          border-radius: 50%;
          animation-delay: 2s;
        }
        @keyframes floatShape {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        /* === TEXTOS & BADGES === */
        .badge-custom {
          background: rgba(144, 238, 144, 0.15);
          color: var(--color-light-green);
          padding: 8px 16px;
          border: 1px solid var(--color-light-green);
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .text-highlight {
          color: transparent;
          background: linear-gradient(90deg, #90ee90, #5f9ea0);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .text-light-green {
            color: var(--color-light-green);
        }

        /* === BUSCADOR === */
        .search-box-wrapper {
          max-width: 600px;
          transition: transform 0.3s ease;
        }
        .search-box-wrapper:hover {
          transform: translateY(-2px);
        }

        .search-input-group {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          overflow: hidden;
        }
        
        .search-input::placeholder {
            color: rgba(255,255,255,0.4);
        }
        .search-input:focus {
            background: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
        }

        /* === ACORDEÓN (TARJETAS) === */
        .accordion-card {
          background: #ffffff; /* Tarjetas blancas para contraste */
          transition: all 0.3s ease;
          border: none !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .accordion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }

        .accordion-card.is-active {
          border-left: 5px solid var(--color-accent) !important;
          background: #fdfdfd;
        }

        /* Colores dentro del acordeón (fondo blanco, texto oscuro) */
        .question-text {
            color: #2c3e50 !important;
        }

        .accordion-button {
          background: transparent !important;
          padding: 1.5rem;
          box-shadow: none !important;
        }
        
        .accordion-button::after {
          background-size: 1.25rem;
          opacity: 0.5;
          transition: all 0.3s;
        }
        .accordion-button:not(.collapsed)::after {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%231e4d2b'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
          transform: rotate(-180deg);
          opacity: 1;
        }

        /* === ICONOS === */
        .icon-box {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background-color: #f1f3f5;
          color: #adb5bd;
          transition: all 0.3s;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .icon-box.active {
          background-color: var(--color-light-green); /* Verde claro */
          color: var(--color-primary); /* Verde oscuro */
        }

        .category-text {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
          transition: color 0.3s;
          text-align: left;
        }

        .response-line {
          width: 30px;
          height: 3px;
          background-color: var(--color-light-green);
          margin-bottom: 1rem;
          border-radius: 2px;
        }

        /* === ESTADO VACÍO & BOTONES === */
        .icon-container {
            width: 80px; height: 80px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto;
        }

        .btn-reset {
            border-color: var(--color-light-green);
            color: var(--color-light-green);
        }
        .btn-reset:hover {
            background-color: var(--color-light-green);
            color: var(--color-primary);
        }

        .btn-contact-support {
            color: var(--color-light-green);
            padding: 10px 20px;
            border-radius: 30px;
            background: rgba(255,255,255,0.05);
            transition: all 0.3s;
        }
        .btn-contact-support:hover {
            background: var(--color-light-green);
            color: var(--color-primary);
        }

        @media (max-width: 576px) {
          .accordion-button { padding: 1rem; }
          .icon-box { display: none; }
          .accordion-body {
            padding-left: 1rem !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Faq;
