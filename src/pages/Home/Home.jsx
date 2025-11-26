import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Home = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

  const sections = [section1Ref, section2Ref, section3Ref, section4Ref];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let newIndex = 0;
      sections.forEach((section, index) => {
        if (section.current && section.current.offsetTop <= scrollPosition) {
          newIndex = index;
        }
      });
      setCurrentIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (direction) => {
    let nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= sections.length) nextIndex = sections.length - 1;

    if (sections[nextIndex].current) {
      sections[nextIndex].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <>
      {/* SECCIÓN 1: HERO & INTRO */}
      <section
        ref={section1Ref}
        className="hero-section full-screen-section text-dark position-relative overflow-hidden"
      >
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>

        <Container className="position-relative" style={{ zIndex: 10 }}>
          <Row className="align-items-center justify-content-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <div className="hero-badge mb-4">
                <span
                  className="badge rounded-pill px-4 py-2"
                  style={{
                    backgroundColor: "rgba(144, 238, 144, 0.2)",
                    color: "#2d5016",
                    border: "2px solid #4a7c59",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  <i className="bi bi-stars me-2"></i>
                  Tu Coach Personal de Bienestar
                </span>
              </div>

              <h1 className="display-3 fw-bold mb-4 hero-title">
                Transforma el
                <span className="gradient-text d-block">Scroll Infinito</span>
                en Exploración Real
              </h1>

              <p
                className="lead mb-4"
                style={{
                  fontSize: "1.2rem",
                  lineHeight: "1.8",
                  color: "rgba(45, 80, 22, 0.85)",
                }}
              >
                KAIROS es tu compañero inteligente que convierte el tiempo
                digital en crecimiento personal. Descubre lugares únicos, mejora
                tu bienestar y vive experiencias significativas.
              </p>

              <div className="d-flex gap-3 mb-4 flex-wrap justify-content-center justify-content-lg-start">
                <Button href="#" size="lg" className="cta-primary px-4 py-3">
                  <i className="bi bi-google-play me-2"></i>
                  Descargar para Android
                </Button>
                <Button
                  as={NavLink}
                  to="/promociones"
                  size="lg"
                  className="cta-secondary px-4 py-3"
                >
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Explorar Ahora
                </Button>
              </div>

              <div className="hero-stats d-flex gap-4 flex-wrap justify-content-center justify-content-lg-start">
                <div className="stat-item">
                  <div className="stat-number">5K+</div>
                  <div className="stat-label">Usuarios Activos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15K+</div>
                  <div className="stat-label">Rutas Creadas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">4.8★</div>
                  <div className="stat-label">Valoración</div>
                </div>
              </div>
            </Col>

            <Col lg={6} className="text-center">
              <div className="hero-visual position-relative">
                <div className="phone-mockup">
                  <div className="mockup-screen">
                    <div className="screen-content">
                      <div className="app-header-mockup mb-4">
                        <i
                          className="bi bi-compass"
                          style={{ fontSize: "3rem", color: "#90ee90" }}
                        ></i>
                        <h3 className="text-white mt-2 mb-0 fw-bold">KAIROS</h3>
                        <p className="text-white-50 small mb-0">
                          Tu Guía de Exploración
                        </p>
                      </div>

                      <div className="qr-section">
                        <div className="qr-code-box mx-auto">
                          <div className="pulse-ring"></div>
                          <i
                            className="bi bi-qr-code"
                            style={{ fontSize: "3.5rem", color: "#4a7c59" }}
                          ></i>
                        </div>
                        <p
                          className="mt-3 mb-2 fw-bold text-white"
                          style={{ fontSize: "1.1rem" }}
                        >
                          Escanea para Descargar
                        </p>
                        <p className="text-white-50 small mb-4">
                          Disponible para Android
                        </p>
                      </div>

                      <div className="app-features-mockup">
                        <div
                          className="feature-pill"
                          style={{
                            color: "white",
                            background: "rgba(255,255,255,0.2)",
                            padding: "5px 15px",
                            borderRadius: "20px",
                          }}
                        >
                          <i className="bi bi-shield-check me-2"></i>
                          Seguridad Total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="floating-element element-1">
                  <i
                    className="bi bi-geo-alt-fill"
                    style={{ fontSize: "2rem", color: "#90ee90" }}
                  ></i>
                </div>
                <div className="floating-element element-2">
                  <i
                    className="bi bi-heart-pulse-fill"
                    style={{ fontSize: "2rem", color: "#5f9ea0" }}
                  ></i>
                </div>
                <div className="floating-element element-3">
                  <i
                    className="bi bi-star-fill"
                    style={{ fontSize: "1.5rem", color: "#8fbc8f" }}
                  ></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN 2: PROPÓSITO + CARACTERÍSTICAS */}
      <section
        ref={section2Ref}
        className="combined-section full-screen-section d-flex align-items-center position-relative"
      >
        <div className="bg-decor-circle"></div>
        <Container>
          <div className="text-center mb-5">
            <span className="section-label">Nuestra Esencia y Tecnología</span>
            <h2 className="display-5 fw-bold text-dark mt-3">
              Transformación Digital con Propósito
            </h2>
            <p
              className="text-secondary lead mx-auto mt-3"
              style={{ maxWidth: "700px" }}
            >
              Fusionamos nuestra misión de vida con tecnología de punta para
              crear tu ecosistema de bienestar.
            </p>
          </div>

          <Row className="gy-4 gx-lg-5 justify-content-center">
            <Col lg={5} className="d-flex flex-column gap-4">
              <h3 className="fw-bold text-dark mb-2 d-flex align-items-center">
                <i className="bi bi-heart-pulse-fill text-success me-3"></i> El
                Propósito
              </h3>

              <div className="compact-card mission-card">
                <div className="compact-icon mission-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="compact-content">
                  <h5 className="fw-bold mb-2">Misión: Exploración Real</h5>
                  <p className="text-secondary mb-0">
                    Transformar el tiempo digital pasivo en experiencias
                    tangibles en el mundo real.
                  </p>
                </div>
              </div>

              <div className="compact-card vision-card">
                <div className="compact-icon vision-icon">
                  <i className="bi bi-eye-fill"></i>
                </div>
                <div className="compact-content">
                  <h5 className="fw-bold mb-2">Visión: Ecosistema IA</h5>
                  <p className="text-secondary mb-0">
                    Ser líderes globales fusionando Inteligencia Artificial con
                    bienestar diario.
                  </p>
                </div>
              </div>

              <div className="compact-card values-card">
                <div className="compact-icon values-icon">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <div className="compact-content">
                  <h5 className="fw-bold mb-2">Valores Fundamentales</h5>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <Badge bg="light" text="dark" className="border p-2 fs-6">
                      Conciencia
                    </Badge>
                    <Badge bg="light" text="dark" className="border p-2 fs-6">
                      Proactividad
                    </Badge>
                    <Badge bg="light" text="dark" className="border p-2 fs-6">
                      Seguridad
                    </Badge>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              lg={1}
              className="d-none d-lg-flex align-items-center justify-content-center position-relative"
            >
              <div className="vertical-divider">
                <div className="divider-icon">
                  <i className="bi bi-x-diamond-fill fs-4"></i>
                </div>
              </div>
            </Col>

            <Col lg={5} className="d-flex flex-column gap-4">
              <h3 className="fw-bold text-dark mb-2 d-flex align-items-center justify-content-lg-end">
                Los 3 Pilares{" "}
                <i className="bi bi-layers-fill text-primary ms-3"></i>
              </h3>

              <div className="compact-card feature-style">
                <div className="compact-content text-lg-end order-2 order-lg-1">
                  <h5 className="fw-bold mb-2">Rutas Inteligentes</h5>
                  <p className="text-secondary mb-0">
                    IA generativa que crea caminos únicos basados en tus gustos
                    personales.
                  </p>
                </div>
                <div className="compact-icon feature-icon-1 order-1 order-lg-2 ms-lg-4 me-4 me-lg-0">
                  <i className="bi bi-signpost-2-fill"></i>
                </div>
              </div>

              <div className="compact-card feature-style">
                <div className="compact-content text-lg-end order-2 order-lg-1">
                  <h5 className="fw-bold mb-2">Coach Proactivo</h5>
                  <p className="text-secondary mb-0">
                    Monitoreo digital que sugiere "Paseos de Mejora" en el
                    momento exacto.
                  </p>
                </div>
                <div className="compact-icon feature-icon-2 order-1 order-lg-2 ms-lg-4 me-4 me-lg-0">
                  <i className="bi bi-cpu-fill"></i>
                </div>
              </div>

              <div className="compact-card feature-style">
                <div className="compact-content text-lg-end order-2 order-lg-1">
                  <h5 className="fw-bold mb-2">Seguridad Total</h5>
                  <p className="text-secondary mb-0">
                    Botón de pánico y rastreo GPS en tiempo real para tu
                    tranquilidad.
                  </p>
                </div>
                <div className="compact-icon feature-icon-3 order-1 order-lg-2 ms-lg-4 me-4 me-lg-0">
                  <i className="bi bi-shield-fill-check"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN 3: IDEA CENTRAL & ECOSISTEMA */}
      <section
        ref={section3Ref}
        className="purpose-section full-screen-section bg-white"
        aria-labelledby="central-idea"
      >
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={6} className="order-2 order-lg-1">
              <div className="content-wrapper">
                <span className="section-label">
                  <i className="bi bi-lightbulb-fill me-2"></i>
                  Idea Central
                </span>

                <h2
                  id="central-idea"
                  className="display-4 fw-bold text-dark mt-4 mb-4"
                >
                  Red Inteligente para la Mejora Personal
                </h2>

                <p className="text-secondary lead mb-4 description-text">
                  KAIROS es tu{" "}
                  <span className="text-gradient fw-bold">Coach Proactivo</span>{" "}
                  que sugiere acciones en el mundo real, promoviendo la
                  exploración consciente y el bienestar digital.
                </p>

                <div className="feature-highlight-box p-4 mb-4">
                  <div className="highlight-header mb-4">
                    <i className="bi bi-diagram-3-fill text-success fs-2"></i>
                    <h3 className="h4 fw-bold mt-2 mb-0">
                      Dos Plataformas, un Ecosistema
                    </h3>
                  </div>

                  <div className="platform-list">
                    <div className="platform-item mb-3">
                      <div className="platform-icon android-gradient">
                        <i className="bi bi-phone-fill"></i>
                      </div>
                      <div className="platform-content">
                        <h4 className="h5 fw-bold mb-2">
                          Aplicación Nativa Android
                        </h4>
                        <p className="text-secondary mb-0">
                          Motor de experiencia que maneja descubrimiento, rutas,
                          coaching con IA y seguridad.
                        </p>
                      </div>
                    </div>

                    <div className="platform-item">
                      <div className="platform-icon web-gradient">
                        <i className="bi bi-laptop-fill"></i>
                      </div>
                      <div className="platform-content">
                        <h4 className="h5 fw-bold mb-2">PWA/Portal Web</h4>
                        <p className="text-secondary mb-0">
                          Centro de administración enfocado en gestión de
                          contenidos, monetización y promoción.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6} className="order-1 order-lg-2">
              <div className="ecosystem-visual">
                <div className="visual-container">
                  <div className="phone-mockup-visual">
                    <div className="phone-notch"></div>
                    <div className="phone-screen-visual">
                      <div className="screen-content-visual">
                        <div className="app-icon-wrapper">
                          <i className="bi bi-compass-fill app-icon"></i>
                        </div>
                        <h3 className="text-white fw-bold mt-3 mb-1">KAIROS</h3>
                        <p className="text-white-50 small mb-0">
                          Explora & Crece
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="connection-line">
                    <div className="connection-segment"></div>
                    <div className="connection-dot dot-pulse"></div>
                    <div className="connection-segment"></div>
                  </div>

                  <div className="web-mockup">
                    <div className="web-browser-bar">
                      <div className="browser-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="browser-url">kairos-admin.com</div>
                    </div>
                    <div className="web-content">
                      <div className="web-icon-wrapper">
                        <i className="bi bi-grid-3x3-gap-fill web-icon"></i>
                      </div>
                      <h4 className="fw-bold mt-3 mb-1">Admin Portal</h4>
                      <p className="text-secondary small mb-0">
                        Gestión & Analytics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN: CIERRE IMPACTANTE */}
      <section
        ref={section4Ref}
        className="cta-final-section full-screen-section position-relative overflow-hidden"
      >
        <div className="cta-background"></div>
        <div className="cta-mesh-gradient"></div>

        <Container className="position-relative" style={{ zIndex: 10 }}>
          <Row className="justify-content-center text-center py-5">
            <Col lg={9} xl={8}>
              <div className="cta-icon-container mb-4">
                <div className="cta-icon-orbit orbit-1"></div>
                <div className="cta-icon-orbit orbit-2"></div>
                <div className="cta-icon-orbit orbit-3"></div>
                <div className="cta-icon-large">
                  <i className="bi bi-rocket-takeoff-fill"></i>
                </div>
              </div>

              <h2 className="display-3 fw-bold text-white mb-4">
                ¿Listo para Transformar tu Experiencia Digital?
              </h2>
              <p className="lead text-white-50 mb-5 px-lg-5">
                Únete a KAIROS y descubre cómo la IA puede mejorar tu día a día
              </p>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <NavLink to="/contacto" className="btn-cta-primary">
                  <i className="bi bi-envelope-fill me-2"></i>
                  Contáctanos
                  <i className="bi bi-arrow-right ms-2"></i>
                </NavLink>
                <NavLink to="/demo" className="btn-cta-secondary">
                  <i className="bi bi-play-circle-fill me-2"></i>
                  Ver Demo
                </NavLink>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="floating-icons">
          <div className="floating-icon icon-1">
            <i className="bi bi-stars"></i>
          </div>
          <div className="floating-icon icon-2">
            <i className="bi bi-compass"></i>
          </div>
          <div className="floating-icon icon-3">
            <i className="bi bi-lightbulb"></i>
          </div>
          <div className="floating-icon icon-4">
            <i className="bi bi-heart-fill"></i>
          </div>
        </div>
      </section>

      <div className="nav-dock">
        <button
          className="nav-btn"
          onClick={() => scrollToSection("up")}
          disabled={currentIndex === 0}
          aria-label="Subir sección"
        >
          <i className="bi bi-chevron-up"></i>
        </button>

        <div className="nav-indicators">
          {sections.map((_, idx) => (
            <div
              key={idx}
              className={`nav-dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => {
                sections[idx].current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            ></div>
          ))}
        </div>

        <button
          className="nav-btn"
          onClick={() => scrollToSection("down")}
          disabled={currentIndex === sections.length - 1}
          aria-label="Bajar sección"
        >
          <i className="bi bi-chevron-down"></i>
        </button>
      </div>

      <style>{`
        /* === NUEVA CLASE MAESTRA: SECCIONES PANTALLA COMPLETA === */
        /* Esta clase obliga a que todas las sections midan al menos el 100% de la ventana
           y centra su contenido verticalmente */
        .full-screen-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          box-sizing: border-box;
        }

        /* === VARIABLES GLOBALES & RESET === */
        :root {
          --color-primary: #1e4d2b;
          --color-secondary: #2d7a3e;
          --color-accent: #3d9651;
          --color-light-green: #90ee90;
          --color-teal: #5f9ea0;
          --color-sage: #8fbc8f;
          --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* === NAV DOCK LATERAL === */
        .nav-dock {
          position: fixed;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 15px 10px;
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.5);
        }

        .nav-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          color: white;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(74, 124, 89, 0.3);
        }

        .nav-btn:hover:not(:disabled) {
          transform: scale(1.1);
          background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
        }

        .nav-btn:disabled {
          background: #e0e0e0;
          color: #a0a0a0;
          cursor: not-allowed;
          box-shadow: none;
        }

        .nav-indicators {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 10px 0;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          background-color: #cbd5e1;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot:hover {
          transform: scale(1.5);
          background-color: var(--color-sage);
        }

        .nav-dot.active {
          background-color: var(--color-primary);
          transform: scale(1.5);
        }

        /* Responsive: Ocultar o reducir en móviles si estorba */
        @media (max-width: 991px) {
          .nav-dock {
            right: 15px;
            padding: 10px 8px;
            gap: 10px;
            display: none; /* Opcional: ocultar en móviles muy pequeños */
          }
          .nav-btn {
             width: 35px; height: 35px; font-size: 1rem;
          }
          .nav-dot { width: 6px; height: 6px; }
          
          /* IMPORTANTE: En móvil, las secciones dejan de ser 100vh forzoso 
             para que el scroll sea natural si el contenido es muy largo */
          .full-screen-section {
            min-height: auto;
            padding-top: 4rem;
            padding-bottom: 4rem;
            display: block; /* Desactivar flex centrado en móvil para evitar cortes */
          }
        }

        /* === HERO SECTION === */
        .hero-section {
          background: #ffffff;
          /* height controlado por full-screen-section */
        }
        .hero-gradient {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(74, 124, 89, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(95, 158, 160, 0.15) 0%, transparent 50%);
          z-index: 1;
        }
        .hero-particles {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, rgba(144, 238, 144, 0.3), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(143, 188, 143, 0.3), transparent);
          background-size: 200% 200%;
          animation: particles 20s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes particles {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #4a7c59 0%, #2d5016 50%, #4a7c59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        
        /* Phone Mockup (Hero) */
        .phone-mockup {
          position: relative;
          width: 320px; height: 640px;
          margin: 0 auto;
          background: #1a1a1a;
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 3px #000000;
        }
        .mockup-screen {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #5f9ea0 100%);
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }
        .screen-content { text-align: center; width: 100%; }
        .qr-section { padding: 2rem 0; position: relative; }
        .qr-code-box {
          width: 140px; height: 140px;
          background: white;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: relative; z-index: 2;
        }
        .pulse-ring {
          position: absolute;
          width: 140px; height: 140px;
          border: 3px solid #90ee90;
          border-radius: 20px;
          animation: pulse 2s ease-out infinite;
          opacity: 0; top: 50%; left: 50%;
          transform: translate(-50%, -50%); z-index: 1;
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        /* Buttons & Stats */
        .cta-primary {
          background: linear-gradient(135deg, #4a7c59 0%, #2d5016 100%);
          border: none; color: #ffffff; font-weight: 700;
          border-radius: 12px; transition: all 0.3s ease;
        }
        .cta-primary:hover { transform: translateY(-3px); background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%); }
        .cta-secondary {
          background: rgba(143, 188, 143, 0.1);
          border: 2px solid #8fbc8f; color: #4a7c59;
          font-weight: 600; border-radius: 12px; transition: all 0.3s ease;
          text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
        }
        .cta-secondary:hover {
          background: rgba(143, 188, 143, 0.2); border-color: #4a7c59;
          color: #2d5016; transform: translateY(-3px);
        }
        .stat-item { text-align: center; }
        .stat-number { font-size: 2rem; font-weight: 700; color: #4a7c59; line-height: 1; }
        .stat-label { font-size: 0.85rem; color: rgba(45, 80, 22, 0.6); margin-top: 0.25rem; }
        
        /* Floating Elements */
        .floating-element { position: absolute; animation: float 6s ease-in-out infinite; }
        .element-1 { top: 10%; right: -10%; animation-delay: 0s; }
        .element-2 { bottom: 20%; left: -5%; animation-delay: 2s; }
        .element-3 { top: 60%; right: -5%; animation-delay: 4s; }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        /* === SECCIÓN COMBINADA (COMPACTA Y GRANDE) === */
        .combined-section {
            background: linear-gradient(to bottom, #ffffff 0%, #f9fcf9 100%);
            /* height controlado por full-screen-section */
        }
        .bg-decor-circle {
            position: absolute;
            width: 900px; height: 900px;
            background: radial-gradient(circle, rgba(144, 238, 144, 0.08) 0%, transparent 70%);
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 0; pointer-events: none;
        }
        .section-label {
            display: inline-flex; align-items: center; padding: 8px 20px;
            background: rgba(144, 238, 144, 0.15); border: 1px solid #4a7c59;
            border-radius: 50px; color: #2d5016; font-size: 0.9rem;
            font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
        }

        /* Cards Compactas */
        .compact-card {
            background: white; border-radius: 20px; padding: 1.5rem;
            display: flex; align-items: center;
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 6px 20px rgba(0,0,0,0.03);
            transition: all 0.3s ease; position: relative; z-index: 1; height: 100%;
        }
        .compact-card:hover {
            transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-color: rgba(74, 124, 89, 0.4);
        }
        .compact-icon {
            width: 60px; height: 60px; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; flex-shrink: 0;
        }
        .compact-content { flex-grow: 1; }

        /* Estilos Propósito */
        .mission-card { border-left: 5px solid #4a7c59; }
        .mission-icon { background: rgba(74, 124, 89, 0.12); color: #4a7c59; margin-right: 20px; }
        .vision-card { border-left: 5px solid #5f9ea0; }
        .vision-icon { background: rgba(95, 158, 160, 0.12); color: #5f9ea0; margin-right: 20px; }
        .values-card { border-left: 5px solid #8fbc8f; }
        .values-icon { background: rgba(143, 188, 143, 0.12); color: #8fbc8f; margin-right: 20px; }

        /* Estilos Features */
        .feature-style { background: #fff; }
        .feature-icon-1 { background: linear-gradient(135deg, #4a7c59, #2d5016); color: white; box-shadow: 0 6px 15px rgba(74, 124, 89, 0.3); }
        .feature-icon-2 { background: linear-gradient(135deg, #5f9ea0, #4a7c59); color: white; box-shadow: 0 6px 15px rgba(95, 158, 160, 0.3); }
        .feature-icon-3 { background: linear-gradient(135deg, #8fbc8f, #4a7c59); color: white; box-shadow: 0 6px 15px rgba(143, 188, 143, 0.3); }

        /* Divisor Central */
        .vertical-divider {
            width: 3px; height: 100%;
            background: linear-gradient(to bottom, transparent, #d0d0d0, transparent);
            position: relative; display: flex; align-items: center; justify-content: center;
        }
        .divider-icon { background: #fff; padding: 15px; color: #bbb; }

        /* === IDEA CENTRAL & ECOSISTEMA === */
        .text-gradient {
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .feature-highlight-box {
          background: linear-gradient(135deg, #f7fcf7 0%, #ffffff 100%);
          border-left: 5px solid var(--color-secondary); border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06); transition: all 0.4s;
        }
        .feature-highlight-box:hover { transform: translateY(-5px); box-shadow: 0 15px 50px rgba(45, 122, 62, 0.15); }
        
        .platform-item {
          display: flex; align-items: flex-start; gap: 1.25rem; padding: 1.25rem;
          background: white; border-radius: 16px; transition: all 0.4s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }
        .platform-item:hover { transform: translateX(12px); box-shadow: 0 8px 30px rgba(45, 122, 62, 0.15); }
        .platform-icon {
          width: 56px; height: 56px; border-radius: 14px; display: flex;
          align-items: center; justify-content: center; font-size: 1.6rem; color: white;
        }
        .android-gradient { background: linear-gradient(135deg, #90ee90 0%, #4a7c59 100%); }
        .web-gradient { background: linear-gradient(135deg, #5f9ea0 0%, #8fbc8f 100%); }

        /* Visual Container (Phone + Web) */
        .visual-container {
          display: flex; align-items: center; justify-content: center;
          gap: 2.5rem; flex-wrap: wrap; perspective: 1200px;
        }
        .phone-mockup-visual {
          width: 260px; height: 520px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
          border-radius: 40px; padding: 14px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
          position: relative; animation: floatPhone 7s ease-in-out infinite;
        }
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0) rotateY(-5deg); }
          50% { transform: translateY(-25px) rotateY(5deg); }
        }
        .phone-screen-visual {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%);
          border-radius: 32px; overflow: hidden; position: relative;
        }
        .screen-content-visual {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; padding: 2.5rem;
        }
        .app-icon-wrapper {
          width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px); border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          animation: iconPulse 3s ease-in-out infinite;
        }
        .app-icon { font-size: 4rem; color: var(--color-light-green); }

        /* Connection Line */
        .connection-line { display: flex; align-items: center; gap: 0.4rem; }
        .connection-segment { width: 40px; height: 3px; background: var(--color-secondary); border-radius: 2px; }
        .connection-dot {
          width: 14px; height: 14px; background: var(--color-secondary);
          border-radius: 50%; animation: dotPulse 2s ease-in-out infinite;
        }
        
        /* Web Mockup */
        .web-mockup {
          width: 300px; height: 220px; background: white;
          border-radius: 24px; box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
          overflow: hidden; animation: floatWeb 7s ease-in-out infinite; animation-delay: 0.5s;
        }
        @keyframes floatWeb {
          0%, 100% { transform: translateY(0) rotateY(5deg); }
          50% { transform: translateY(-20px) rotateY(-5deg); }
        }
        .web-browser-bar {
          background: #f8f8f8; padding: 0.9rem; display: flex; align-items: center;
          gap: 0.75rem; border-bottom: 1px solid #ddd;
        }
        .browser-dots { display: flex; gap: 0.45rem; }
        .browser-dots span { width: 11px; height: 11px; border-radius: 50%; }
        .browser-dots span:nth-child(1) { background: #ff5f56; }
        .browser-dots span:nth-child(2) { background: #ffbd2e; }
        .browser-dots span:nth-child(3) { background: #27c93f; }
        .browser-url {
          flex: 1; background: white; padding: 0.4rem 0.8rem;
          border-radius: 6px; font-size: 0.75rem; color: #999; border: 1px solid #e0e0e0;
        }
        .web-content {
          padding: 2rem; text-align: center; display: flex; flex-direction: column;
          align-items: center; justify-content: center; height: calc(100% - 50px);
        }
        .web-icon-wrapper {
          width: 70px; height: 70px; background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
          border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white;
        }

        /* === CTA FINAL === */
        .cta-final-section { background: #0a1f0f; /* height controlado por full-screen-section */ }
        .cta-background {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0a1f0f 0%, #1e4d2b 30%, #2d7a3e 70%, #3d9651 100%);
          z-index: 1;
        }
        .cta-icon-container { position: relative; width: 140px; height: 140px; margin: 0 auto; }
        .cta-icon-orbit {
          position: absolute; border: 2px dashed rgba(144, 238, 144, 0.3);
          border-radius: 50%; animation: rotate 20s linear infinite;
        }
        .orbit-1 { inset: -10px; animation-duration: 15s; }
        .orbit-2 { inset: -25px; animation-duration: 20s; animation-direction: reverse; }
        .orbit-3 { inset: -40px; animation-duration: 25s; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .cta-icon-large {
          width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;
          background: rgba(144, 238, 144, 0.2); border-radius: 50%; position: relative; z-index: 2;
          animation: ctaPulse 3s ease-in-out infinite;
        }
        .cta-icon-large i { font-size: 4.5rem; color: var(--color-light-green); }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(144, 238, 144, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 60px rgba(144, 238, 144, 0.7); transform: scale(1.08); }
        }

        .btn-cta-primary {
          display: inline-flex; align-items: center; padding: 1.15rem 2.75rem;
          background: white; color: var(--color-primary); border-radius: 50px;
          font-weight: 700; text-decoration: none; transition: all 0.4s;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        .btn-cta-primary:hover { transform: translateY(-6px); background: var(--color-light-green); }
        
        .btn-cta-secondary {
          display: inline-flex; align-items: center; padding: 1.15rem 2.75rem;
          background: transparent; color: white; border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px; font-weight: 700; text-decoration: none; transition: all 0.4s;
        }
        .btn-cta-secondary:hover { transform: translateY(-6px); background: rgba(255,255,255,0.2); border-color: white; color: white; }

        .floating-icon { position: absolute; font-size: 3.5rem; color: rgba(144, 238, 144, 0.2); animation: iconFloat 10s infinite; }
        .icon-1 { top: 10%; left: 8%; }
        .icon-2 { top: 65%; right: 12%; }
        .icon-3 { bottom: 15%; left: 15%; }
        .icon-4 { top: 35%; right: 20%; }
        @keyframes iconFloat { 0%, 100% { transform: translateY(0); opacity: 0.2; } 50% { transform: translateY(-40px); opacity: 0.4; } }

        /* Responsive adjustments */
        @media (max-width: 991px) {
          .hero-title { font-size: 2.5rem; }
          .phone-mockup { width: 280px; height: 560px; }
          .visual-container { gap: 2rem; }
          .connection-line { flex-direction: column; }
          .connection-segment { width: 3px; height: 30px; }
          
          /* Compact Section Responsive */
          .compact-content.text-lg-end { text-align: left !important; }
          .feature-style .compact-icon { margin-right: 20px !important; margin-left: 0 !important; }
          .order-lg-1 { order: 1 !important; }
          .order-lg-2 { order: 0 !important; }
          .vertical-divider { display: none; }
        }
      `}</style>
    </>
  );
};

export default Home;
