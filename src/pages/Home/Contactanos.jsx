import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import MensajesContext from "../../Context/Mensajes/MensajesContext";

const Contactanos = () => {
  const { createMensaje } = useContext(MensajesContext);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [uiState, setUiState] = useState({
    loading: false,
    success: false,
    error: false,
    errorMessage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (uiState.success || uiState.error) {
      setUiState({ ...uiState, success: false, error: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setUiState({
        ...uiState,
        error: true,
        errorMessage: "Por favor completa los campos obligatorios.",
      });
      return;
    }

    setUiState({
      loading: true,
      success: false,
      error: false,
      errorMessage: "",
    });

    try {
      const datosParaEnviar = {
        nombre: formData.nombre,
        correo: formData.email,
        asunto: formData.asunto,
        mensaje: formData.mensaje,
      };

      await createMensaje(datosParaEnviar);

      setUiState({
        loading: false,
        success: true,
        error: false,
        errorMessage: "",
      });
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      let msg = "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.";

      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        msg =
          "No se puede conectar con el servidor. Verifica que tu API esté corriendo en el puerto 5219.";
      } else if (error.response && error.response.data) {
        msg = `Error del servidor: ${JSON.stringify(error.response.data)}`;
      }

      setUiState({
        loading: false,
        success: false,
        error: true,
        errorMessage: msg,
      });
    }
  };

  return (
    <>
      <section className="contact-section position-relative overflow-hidden">
        <div className="contact-bg-gradient"></div>
        <div className="contact-particles"></div>

        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>

        <Container className="position-relative" style={{ zIndex: 10 }}>
          <Row className="justify-content-center align-items-center min-vh-100 py-5">
            <Col lg={5} className="text-white mb-5 mb-lg-0 pe-lg-5">
              <div className="info-wrapper">
                <div className="badge-contact mb-4">
                  <i className="bi bi-chat-dots-fill me-2"></i> Contáctanos
                </div>

                <h1 className="display-4 fw-bold mb-4">
                  Hablemos de tu <br />
                  <span className="text-highlight">Bienestar Digital</span>
                </h1>

                <p className="lead text-white-50 mb-5">
                  ¿Tienes dudas sobre KAIROS? ¿Quieres una demo personalizada?
                  Estamos aquí para guiarte en tu exploración.
                </p>

                <div className="contact-details d-flex flex-column gap-4">
                  <div className="detail-item d-flex align-items-center">
                    <div className="icon-box">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Nuestra Sede</h6>
                      <p className="small text-white-50 mb-0">
                        León, Guanajuato, México
                      </p>
                    </div>
                  </div>

                  <div className="detail-item d-flex align-items-center">
                    <div className="icon-box">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Correo Electrónico</h6>
                      <p className="small text-white-50 mb-0">
                        hola@kairos-app.com
                      </p>
                    </div>
                  </div>

                  <div className="detail-item d-flex align-items-center">
                    <div className="icon-box">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Llámanos</h6>
                      <p className="small text-white-50 mb-0">
                        +52 (477) 123 4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="social-links mt-5 d-flex gap-3">
                  <a href="#" className="social-btn">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="social-btn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="social-btn">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} xl={5}>
              <div className="form-card">
                <div className="form-header mb-4">
                  <h3 className="fw-bold text-dark">Envíanos un Mensaje</h3>
                  <p className="text-secondary small">
                    Te responderemos en menos de 24 horas.
                  </p>
                </div>

                {uiState.success && (
                  <Alert variant="success" className="mb-3 animate-fade-in">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    ¡Mensaje enviado con éxito! Nos pondremos en contacto
                    pronto.
                  </Alert>
                )}

                {uiState.error && (
                  <Alert variant="danger" className="mb-3 animate-fade-in">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {uiState.errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-secondary">
                          Nombre Completo
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          required
                          placeholder="Ej. Juan Pérez"
                          className="custom-input"
                          value={formData.nombre}
                          onChange={handleChange}
                          disabled={uiState.loading}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-secondary">
                          Correo Electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          required
                          placeholder="nombre@correo.com"
                          className="custom-input"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={uiState.loading}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-secondary">
                          Asunto
                        </Form.Label>
                        <Form.Select
                          className="custom-input"
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          disabled={uiState.loading}
                        >
                          <option value="">Selecciona un tema</option>
                          <option value="soporte">Soporte Técnico</option>
                          <option value="ventas">Información de Ventas</option>
                          <option value="demo">Solicitar Demo</option>
                          <option value="otro">Otro</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-secondary">
                          Mensaje
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="mensaje"
                          required
                          placeholder="Cuéntanos cómo podemos ayudarte..."
                          className="custom-input"
                          value={formData.mensaje}
                          onChange={handleChange}
                          disabled={uiState.loading}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mt-4">
                      <Button
                        type="submit"
                        className="w-100 btn-submit-custom"
                        disabled={uiState.loading}
                      >
                        {uiState.loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar Mensaje{" "}
                            <i className="bi bi-send-fill ms-2"></i>
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        /* === VARIABLES (Coinciden con Home) === */
        :root {
          --color-primary: #1e4d2b;
          --color-secondary: #2d7a3e;
          --color-accent: #3d9651;
          --color-light-green: #90ee90;
          --color-teal: #5f9ea0;
        }

        .contact-section {
          background: #0a1f0f;
          min-height: 100vh;
          font-family: 'Inter', sans-serif; /* Asegúrate de tener la fuente o usa la del sistema */
        }

        /* === FONDO ANIMADO === */
        .contact-bg-gradient {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 10% 20%, #1e4d2b 0%, #0a1f0f 40%),
                      radial-gradient(circle at 90% 80%, #2d5016 0%, #0a1f0f 40%);
          z-index: 1;
        }

        .contact-particles {
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

        /* === ESTILOS INFO IZQUIERDA === */
        .badge-contact {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(144, 238, 144, 0.15);
          border: 1px solid var(--color-light-green);
          border-radius: 50px;
          color: var(--color-light-green);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .text-highlight {
          color: transparent;
          background: linear-gradient(90deg, #90ee90, #5f9ea0);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .icon-box {
          width: 50px; height: 50px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-right: 15px;
          color: var(--color-light-green);
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }
        
        .detail-item:hover .icon-box {
          transform: scale(1.1) rotate(5deg);
          background: rgba(144, 238, 144, 0.2);
          color: white;
        }

        .social-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background: var(--color-light-green);
          border-color: var(--color-light-green);
          color: var(--color-primary);
          transform: translateY(-3px);
        }

        /* === FORM CARD (Derecha) === */
        .form-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.8s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; } to { opacity: 1; }
        }

        /* === INPUTS PERSONALIZADOS === */
        .custom-input {
          background-color: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .custom-input:focus {
          background-color: #ffffff;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px rgba(61, 150, 81, 0.1);
          color: var(--color-primary);
        }
        .custom-input:disabled {
            background-color: #e9ecef;
            cursor: not-allowed;
        }

        /* === BOTÓN SUBMIT === */
        .btn-submit-custom {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          border: none;
          padding: 1rem;
          font-weight: 700;
          border-radius: 12px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        
        .btn-submit-custom:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(45, 122, 62, 0.3);
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
        }
        .btn-submit-custom:disabled {
            opacity: 0.7;
            cursor: wait;
        }

        /* === RESPONSIVE === */
        @media (max-width: 991px) {
          .info-wrapper { text-align: center; }
          .contact-details { align-items: center; }
          .detail-item { flex-direction: column; text-align: center; }
          .icon-box { margin-right: 0; margin-bottom: 10px; }
          .social-links { justify-content: center; }
          .form-card { padding: 1.5rem; }
        }
      `}</style>
    </>
  );
};

export default Contactanos;
