import React, { useState, useContext, useEffect } from "react";
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
import FaqContext from "../../Context/Faq/FaqContext";

const Faq = () => {
  // 1. Consumimos el contexto
  const { faqs, getFaqs } = useContext(FaqContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeKey, setActiveKey] = useState("0");
  const [loading, setLoading] = useState(true);

  // 2. Cargar preguntas al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getFaqs();
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line
  }, []);

  // 3. Helper para iconos
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

    return "bi-question-circle";
  };

  // 4. Filtrar datos (CORREGIDO EL ERROR)
  const filteredFaqs = faqs.filter((item) => {
    // Convertimos a String explícitamente para evitar crash si es number o boolean
    const rawStatus = item.estatus ? String(item.estatus) : "";
    const status = rawStatus.toLowerCase();

    // Ajusta esto según cómo guarde tu BD el estatus:
    // Si guarda "Visible", esto funciona.
    // Si guarda 1, agregamos la comparación || status === "1"
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
      <section className="faq-section">
        {/* === HEADER === */}
        <Container className="pt-5 pb-5 position-relative">
          <div className="bg-blob"></div>

          <Row className="justify-content-center text-center position-relative z-2">
            <Col lg={8}>
              <div className="d-inline-block mb-3">
                <span className="subtitle-badge">
                  <i className="bi bi-life-preserver me-2"></i> Centro de Ayuda
                </span>
              </div>
              <h1 className="display-5 fw-bold text-dark mb-3">
                ¿Cómo podemos <span className="text-gradient">ayudarte?</span>
              </h1>
              <p className="text-muted lead mb-4">
                Resuelve tus dudas sobre KAIROS y empieza tu desconexión
                digital.
              </p>

              {/* Buscador */}
              <div className="search-box-wrapper mx-auto shadow-lg">
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="bg-white border-0 ps-4 text-primary">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar temas (ej. seguridad, precio...)"
                    className="border-0 py-3 ps-2 shadow-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="link"
                      className="text-muted text-decoration-none pe-4 bg-white border-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Container>

        {/* === LISTA DE TARJETAS === */}
        <Container className="pb-5 position-relative z-2">
          <Row className="justify-content-center">
            <Col lg={8}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="text-muted mt-2">Cargando preguntas...</p>
                </div>
              ) : filteredFaqs.length > 0 ? (
                <Accordion
                  defaultActiveKey="0"
                  className="custom-accordion gap-3 d-flex flex-column"
                  onSelect={(e) => setActiveKey(e)}
                >
                  {filteredFaqs.map((item, index) => {
                    // Usamos idPregunta como key si existe, sino index
                    const key = item.idPregunta || index;
                    const isActive = activeKey === index.toString();
                    const iconClass = getIconByCategory(item.categoria);

                    return (
                      <Accordion.Item
                        eventKey={index.toString()}
                        key={key}
                        className={`accordion-card border-0 rounded-4 overflow-hidden mb-0 ${
                          isActive ? "is-active shadow" : "shadow-sm"
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
                                  isActive ? "text-primary" : "text-muted"
                                }`}
                              >
                                {item.categoria || "General"}
                              </span>
                              <span className="fw-bold text-dark h6 m-0 d-block text-start">
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
                    <i className="bi bi-search display-4 text-muted"></i>
                  </div>
                  <h4 className="text-dark fw-bold">Sin resultados</h4>
                  <p className="text-muted">
                    No encontramos preguntas visibles que coincidan con "
                    {searchTerm}"
                  </p>
                  <Button
                    variant="outline-success"
                    onClick={() => setSearchTerm("")}
                    className="rounded-pill px-4"
                  >
                    Ver todas las preguntas
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>

        {/* === CTA === */}
        <Container className="pb-5 mb-4">
          <div className="text-center mt-4">
            <p className="text-muted mb-3 small">
              ¿No encontraste lo que buscabas?
            </p>
            <NavLink
              to="/contacto"
              className="text-decoration-none fw-bold text-primary link-hover-effect"
            >
              Contactar a Soporte Técnico{" "}
              <i className="bi bi-arrow-right ms-1"></i>
            </NavLink>
          </div>
        </Container>
      </section>

      <style>{`
        /* === VARIABLES & FUENTES === */
        :root {
          --kairos-green: #1e4d2b;
          --kairos-light: #e8f5e9;
          --kairos-accent: #2d7a3e;
          --text-dark: #2c3e50;
        }

        .faq-section {
          background-color: #f8fcf9; 
          background-image: radial-gradient(#e1efe3 1px, transparent 1px);
          background-size: 20px 20px;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .bg-blob {
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(144, 238, 144, 0.15) 0%, rgba(255,255,255,0) 70%);
            z-index: 0;
            pointer-events: none;
        }

        .subtitle-badge {
            background: rgba(30, 77, 43, 0.08);
            color: var(--kairos-green);
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .text-gradient {
            background: linear-gradient(90deg, var(--kairos-green), var(--kairos-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .search-box-wrapper {
            max-width: 550px;
            border-radius: 50px;
            transition: transform 0.3s ease;
        }
        .search-box-wrapper:hover {
            transform: translateY(-2px);
        }
        .search-input-group {
            border-radius: 50px;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .accordion-card {
            background: #fff;
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.03) !important;
        }

        .accordion-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
        }

        .accordion-card.is-active {
            border-left: 4px solid var(--kairos-green) !important;
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

        .icon-box {
            width: 40px;
            height: 40px;
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
            background-color: var(--kairos-light);
            color: var(--kairos-green);
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
            height: 2px;
            background-color: var(--kairos-light);
            margin-bottom: 1rem;
        }

        .empty-state .icon-container {
            width: 80px;
            height: 80px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .link-hover-effect {
            position: relative;
            display: inline-block;
        }
        .link-hover-effect::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: var(--kairos-green);
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
        }
        .link-hover-effect:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
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
