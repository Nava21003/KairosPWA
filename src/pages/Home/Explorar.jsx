import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Explorar = () => {
  return (
    <>
      {/* Sección 1: Hero Principal Mejorado */}
      <section
        className="exploration-hero-section text-white d-flex align-items-center position-relative"
        aria-labelledby="main-title"
      >
        <div className="hero-overlay"></div>

        <div className="hero-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>

        <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
          <Row className="justify-content-center text-center align-items-center min-vh-100">
            <Col lg={10} xl={8}>
              <div className="hero-content-wrapper">
                <div className="hero-badge mb-4">
                  <i className="bi bi-stars me-2"></i>
                  Innovación Digital
                </div>

                <h1
                  id="main-title"
                  className="display-1 fw-bold mb-4 hero-title"
                >
                  KAIROS
                </h1>

                <div className="hero-subtitle-wrapper mb-4">
                  <h2 className="hero-subtitle-text">Tu Camino a la Mejora</h2>
                </div>

                <p className="lead mb-5 hero-description px-lg-5">
                  Descubre el ecosistema digital que fusiona la{" "}
                  <span className="highlight-text">
                    Inteligencia Artificial
                  </span>{" "}
                  con el{" "}
                  <span className="highlight-text">Bienestar Digital</span>,
                  transformando tu uso pasivo de la tecnología en crecimiento
                  personal tangible.
                </p>

                <div className="d-flex justify-content-center gap-4 mt-5 flex-wrap">
                  <div className="platform-badge android">
                    <div className="platform-badge-inner">
                      <i className="bi bi-android2"></i>
                      <div className="platform-badge-content">
                        <div className="badge-title">App Nativa</div>
                        <div className="badge-subtitle">Android</div>
                      </div>
                    </div>
                  </div>
                  <div className="platform-badge web">
                    <div className="platform-badge-inner">
                      <i className="bi bi-globe"></i>
                      <div className="platform-badge-content">
                        <div className="badge-title">Portal Web</div>
                        <div className="badge-subtitle">PWA</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="scroll-indicator mt-5">
                  <div className="scroll-indicator-line"></div>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 2: Idea Central Renovada */}
      <section
        className="purpose-section py-5 bg-white"
        aria-labelledby="central-idea"
      >
        <Container className="py-5">
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
                        <h4 className="h6 fw-bold mb-2">
                          Aplicación Nativa Android
                        </h4>
                        <p className="small text-secondary mb-0">
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
                        <h4 className="h6 fw-bold mb-2">PWA/Portal Web</h4>
                        <p className="small text-secondary mb-0">
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
                  <div className="phone-mockup">
                    <div className="phone-notch"></div>
                    <div className="phone-screen">
                      <div className="screen-content">
                        <div className="app-icon-wrapper">
                          <i className="bi bi-compass-fill app-icon"></i>
                        </div>
                        <h3 className="text-white fw-bold mt-3 mb-1">KAIROS</h3>
                        <p className="text-white-50 small mb-0">
                          Explora & Crece
                        </p>
                        <div className="screen-indicators mt-4">
                          <div className="indicator active"></div>
                          <div className="indicator"></div>
                          <div className="indicator"></div>
                        </div>
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

      {/* Sección 3: Arquitectura Moderna */}
      <section
        className="architecture-section py-5 bg-gradient-soft"
        aria-labelledby="architecture-title"
      >
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label">
              <i className="bi bi-cpu-fill me-2"></i>
              Arquitectura
            </span>
            <h2
              id="architecture-title"
              className="display-4 fw-bold text-dark mt-4 mb-3"
            >
              Microservicios Desacoplados
            </h2>
            <p
              className="text-secondary lead mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Arquitectura moderna que garantiza{" "}
              <strong className="text-gradient">Escalabilidad</strong>,{" "}
              <strong className="text-gradient">Flexibilidad</strong> y{" "}
              <strong className="text-gradient">Resiliencia</strong>
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={4}>
              <div className="architecture-card card-ai">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-cpu"></i>
                  </div>
                  <h3 className="card-title">Motor de IA y Rutas</h3>
                  <p className="card-description">
                    Procesamiento intensivo con ML (Python/TensorFlow) para
                    rutas optimizadas y coaching proactivo.
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-lightning-charge-fill"></i>
                    <span>Alta Performance</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="architecture-card card-monetization">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                  <h3 className="card-title">Monetización y BI</h3>
                  <p className="card-description">
                    Eventos de conversión y dashboard con métricas clave.
                    Operación independiente sin afectar funcionalidad central.
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-graph-up-arrow"></i>
                    <span>Analytics</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="architecture-card card-auth">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <h3 className="card-title">Autenticación</h3>
                  <p className="card-description">
                    Gestión segura de usuarios y administradores con Control de
                    Acceso basado en Roles (RBAC).
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Seguridad</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="architecture-card card-content">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <h3 className="card-title">Servicio de Contenido</h3>
                  <p className="card-description">
                    CRUD para lugares (POIs), categorías y metadatos. Alimenta
                    mapas interactivos y motor de rutas.
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-database-fill"></i>
                    <span>Data Layer</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="architecture-card card-gateway">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-router-fill"></i>
                  </div>
                  <h3 className="card-title">API Gateway</h3>
                  <p className="card-description">
                    Punto único de entrada. Enrutamiento eficiente a
                    microservicios aislando lógica interna.
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-diagram-3-fill"></i>
                    <span>Orchestration</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="architecture-card card-infra">
                <div className="card-gradient-bg"></div>
                <div className="card-inner">
                  <div className="card-icon-wrapper">
                    <i className="bi bi-server"></i>
                  </div>
                  <h3 className="card-title">Infraestructura</h3>
                  <p className="card-description">
                    Cloud-native con contenedores, balanceadores y auto-scaling
                    para máxima disponibilidad.
                  </p>
                  <div className="card-badge">
                    <i className="bi bi-cloud-fill"></i>
                    <span>Cloud Ready</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 4: Seguridad y Fiabilidad */}
      <section
        className="security-section py-5 bg-white"
        aria-labelledby="security-title"
      >
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label">
              <i className="bi bi-shield-check me-2"></i>
              Confianza y Resiliencia
            </span>
            <h2
              id="security-title"
              className="display-4 fw-bold text-dark mt-4 mb-3"
            >
              Seguridad y Fiabilidad Primero
            </h2>
            <p
              className="text-secondary lead mx-auto"
              style={{ maxWidth: "650px" }}
            >
              Requerimientos no funcionales que garantizan calidad y estabilidad
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="security-card">
                <div className="security-icon-large icon-security">
                  <i className="bi bi-shield-lock-fill"></i>
                  <div className="icon-ripple"></div>
                </div>
                <h3 className="h3 fw-bold mb-3 text-center">
                  Control de Acceso
                </h3>
                <p className="text-secondary text-center mb-4">
                  <strong>RBAC</strong> (Role-Based Access Control) para
                  restringir acceso a funcionalidades sensibles.
                </p>
                <div className="security-stats">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Multi-nivel de permisos</span>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="security-card">
                <div className="security-icon-large icon-performance">
                  <i className="bi bi-speedometer2"></i>
                  <div className="icon-ripple"></div>
                </div>
                <h3 className="h3 fw-bold mb-3 text-center">
                  Rendimiento Crítico
                </h3>
                <p className="text-secondary text-center mb-4">
                  Transacciones críticas con tiempo de respuesta
                  <strong> &lt; 1 segundo</strong> garantizado.
                </p>
                <div className="security-stats">
                  <i className="bi bi-lightning-charge-fill text-warning"></i>
                  <span>Ultra-rápido</span>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="security-card">
                <div className="security-icon-large icon-offline">
                  <i className="bi bi-wifi-off"></i>
                  <div className="icon-ripple"></div>
                </div>
                <h3 className="h3 fw-bold mb-3 text-center">Modo Offline</h3>
                <p className="text-secondary text-center mb-4">
                  Persistencia de datos para acceso sin conexión a información
                  vital de rutas y lugares.
                </p>
                <div className="security-stats">
                  <i className="bi bi-cloud-arrow-down-fill text-info"></i>
                  <span>Siempre disponible</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 5: CTA Final Renovado */}
      <section className="cta-final-section position-relative overflow-hidden">
        <div className="cta-background"></div>
        <div className="cta-mesh-gradient"></div>

        <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
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

      {/* Estilos CSS Mejorados */}
      <style>{`
        /* === Variables Globales === */
        :root {
          --color-primary: #1e4d2b;
          --color-secondary: #2d7a3e;
          --color-accent: #3d9651;
          --color-light-green: #90ee90;
          --color-teal: #5f9ea0;
          --color-sage: #8fbc8f;
          --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* === Hero Section Mejorado === */
        .exploration-hero-section {
          background: linear-gradient(135deg, #0a1f0f 0%, #1e4d2b 50%, #2d7a3e 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(144, 238, 144, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(61, 150, 81, 0.15) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
          z-index: 1;
        }

        .hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--color-light-green);
          border-radius: 50%;
          box-shadow: 0 0 20px var(--color-light-green);
          animation: particleFloat 25s infinite ease-in-out;
        }

        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 70%; right: 15%; animation-delay: 5s; width: 8px; height: 8px; }
        .particle-3 { bottom: 20%; left: 25%; animation-delay: 10s; }
        .particle-4 { top: 40%; right: 30%; animation-delay: 15s; width: 5px; height: 5px; }
        .particle-5 { bottom: 40%; right: 10%; animation-delay: 20s; }

        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(150px, -150px) scale(1.8); opacity: 0.8; }
          90% { opacity: 0.3; }
        }

        .min-vh-100 {
          min-height: 100vh;
        }

        .hero-content-wrapper {
          animation: heroFadeIn 1.4s var(--transition-smooth);
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.85rem 1.75rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(144, 238, 144, 0.3);
          border-radius: 50px;
          color: var(--color-light-green);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.4s var(--transition-smooth);
        }

        .hero-badge:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--color-light-green);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(144, 238, 144, 0.3);
        }

        .hero-title {
          font-size: 7rem;
          font-weight: 900;
          letter-spacing: -3px;
          text-shadow: 
            0 5px 20px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(144, 238, 144, 0.3);
          color: #ffffff;
          line-height: 1;
          margin-bottom: 2rem;
        }

        .hero-subtitle-wrapper {
          position: relative;
          display: inline-block;
        }

        .hero-subtitle-text {
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--color-light-green);
          letter-spacing: 2px;
          text-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
        }

        .hero-description {
          font-size: 1.35rem;
          font-weight: 300;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .highlight-text {
          color: var(--color-light-green);
          font-weight: 700;
          text-shadow: 0 0 30px rgba(144, 238, 144, 0.6);
          position: relative;
        }

        .platform-badge {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 0.5rem;
          transition: all 0.5s var(--transition-smooth);
          position: relative;
          overflow: hidden;
        }

        .platform-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .platform-badge:hover::before {
          transform: translateX(100%);
        }

        .platform-badge:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .platform-badge-inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem 1.5rem;
        }

        .platform-badge i {
          font-size: 3rem;
          transition: transform 0.4s var(--transition-smooth);
        }

        .platform-badge:hover i {
          transform: scale(1.2) rotate(5deg);
        }

        .platform-badge.android i {
          color: var(--color-light-green);
          filter: drop-shadow(0 0 20px var(--color-light-green));
        }

        .platform-badge.web i {
          color: var(--color-teal);
          filter: drop-shadow(0 0 20px var(--color-teal));
        }

        .platform-badge-content {
          text-align: left;
        }

        .badge-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .badge-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .scroll-indicator {
          position: relative;
          display: inline-block;
        }

        .scroll-indicator-line {
          width: 2px;
          height: 50px;
          background: linear-gradient(180deg, transparent, var(--color-light-green));
          margin: 0 auto 1rem;
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        .scroll-indicator i {
          font-size: 2.5rem;
          color: var(--color-light-green);
          animation: scrollBounce 2s ease-in-out infinite;
          display: block;
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(15px); opacity: 1; }
        }

        /* === Section Labels === */
        .section-label {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, rgba(144, 238, 144, 0.1), rgba(45, 122, 62, 0.1));
          border: 2px solid var(--color-secondary);
          border-radius: 50px;
          color: var(--color-primary);
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 4px 15px rgba(45, 122, 62, 0.1);
        }

        .bg-gradient-soft {
          background: linear-gradient(180deg, #f7fcf7 0%, #ffffff 50%, #f7fcf7 100%);
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* === Purpose Section === */
        .purpose-section {
          position: relative;
        }

        .content-wrapper {
          animation: slideInLeft 0.8s var(--transition-smooth);
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .description-text {
          font-size: 1.15rem;
          line-height: 1.8;
        }

        .feature-highlight-box {
          background: linear-gradient(135deg, #f7fcf7 0%, #ffffff 100%);
          border-left: 5px solid var(--color-secondary);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
          transition: all 0.4s var(--transition-smooth);
        }

        .feature-highlight-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(45, 122, 62, 0.15);
        }

        .highlight-header {
          text-align: center;
        }

        .platform-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .platform-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.25rem;
          background: white;
          border-radius: 16px;
          border: 2px solid transparent;
          transition: all 0.4s var(--transition-smooth);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }

        .platform-item:hover {
          transform: translateX(12px);
          border-color: var(--color-secondary);
          box-shadow: 0 8px 30px rgba(45, 122, 62, 0.15);
        }

        .platform-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 1.6rem;
          flex-shrink: 0;
          color: white;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .android-gradient {
          background: linear-gradient(135deg, #90ee90 0%, #4a7c59 100%);
        }

        .web-gradient {
          background: linear-gradient(135deg, #5f9ea0 0%, #8fbc8f 100%);
        }

        .platform-content {
          flex: 1;
        }

        /* === Ecosystem Visual Mejorado === */
        .ecosystem-visual {
          padding: 3rem 2rem;
          animation: slideInRight 0.8s var(--transition-smooth);
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .visual-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
          perspective: 1200px;
        }

        .phone-mockup {
          width: 260px;
          height: 520px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
          border-radius: 40px;
          padding: 14px;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          animation: floatPhone 7s ease-in-out infinite;
        }

        @keyframes floatPhone {
          0%, 100% { transform: translateY(0) rotateY(-5deg); }
          50% { transform: translateY(-25px) rotateY(5deg); }
        }

        .phone-notch {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 28px;
          background: #000;
          border-radius: 0 0 18px 18px;
          z-index: 10;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%);
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .screen-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2.5rem;
        }

        .app-icon-wrapper {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: iconPulse 3s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(144, 238, 144, 0.3); }
          50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(144, 238, 144, 0.6); }
        }

        .app-icon {
          font-size: 4rem;
          color: var(--color-light-green);
        }

        .screen-indicators {
          display: flex;
          gap: 0.6rem;
        }

        .indicator {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          width: 24px;
          border-radius: 5px;
        }

        .connection-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .connection-segment {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
          border-radius: 2px;
        }

        .connection-dot {
          width: 14px;
          height: 14px;
          background: var(--color-secondary);
          border-radius: 50%;
          box-shadow: 0 0 20px var(--color-secondary);
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
        }

        .web-mockup {
          width: 300px;
          height: 220px;
          background: white;
          border-radius: 24px;
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          animation: floatWeb 7s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes floatWeb {
          0%, 100% { transform: translateY(0) rotateY(5deg); }
          50% { transform: translateY(-20px) rotateY(-5deg); }
        }

        .web-browser-bar {
          background: linear-gradient(180deg, #f8f8f8 0%, #ececec 100%);
          padding: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid #ddd;
        }

        .browser-dots {
          display: flex;
          gap: 0.45rem;
        }

        .browser-dots span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .browser-dots span:nth-child(1) { background: #ff5f56; }
        .browser-dots span:nth-child(2) { background: #ffbd2e; }
        .browser-dots span:nth-child(3) { background: #27c93f; }

        .browser-url {
          flex: 1;
          background: white;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #999;
          border: 1px solid #e0e0e0;
        }

        .web-content {
          padding: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100% - 50px);
          background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
        }

        .web-icon-wrapper {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(45, 122, 62, 0.3);
        }

        .web-icon {
          font-size: 2.5rem;
          color: white;
        }

        /* === Architecture Cards === */
        .architecture-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 0;
          height: 100%;
          overflow: hidden;
          border: 1px solid rgba(45, 122, 62, 0.1);
          transition: all 0.5s var(--transition-smooth);
        }

        .architecture-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s var(--transition-smooth);
        }

        .architecture-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 70px rgba(45, 122, 62, 0.25);
          border-color: var(--color-secondary);
        }

        .architecture-card:hover::before {
          transform: scaleX(1);
        }

        .card-gradient-bg {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .card-ai .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(144, 238, 144, 0.1) 0%, transparent 70%); }
        .card-monetization .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(95, 158, 160, 0.1) 0%, transparent 70%); }
        .card-auth .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(143, 188, 143, 0.1) 0%, transparent 70%); }
        .card-content .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(178, 223, 219, 0.1) 0%, transparent 70%); }
        .card-gateway .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(0, 105, 148, 0.1) 0%, transparent 70%); }
        .card-infra .card-gradient-bg { background: radial-gradient(circle at 50% 0%, rgba(155, 89, 182, 0.1) 0%, transparent 70%); }

        .architecture-card:hover .card-gradient-bg {
          opacity: 1;
        }

        .card-inner {
          position: relative;
          z-index: 2;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .card-icon-wrapper {
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 22px;
          font-size: 2.8rem;
          margin: 0 auto 1.75rem;
          transition: all 0.5s var(--transition-smooth);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .architecture-card:hover .card-icon-wrapper {
          transform: scale(1.15) rotate(8deg);
        }

        .card-ai .card-icon-wrapper { background: linear-gradient(135deg, #90ee90, #4a7c59); color: white; }
        .card-monetization .card-icon-wrapper { background: linear-gradient(135deg, #5f9ea0, #8fbc8f); color: white; }
        .card-auth .card-icon-wrapper { background: linear-gradient(135deg, #8fbc8f, #2d5016); color: white; }
        .card-content .card-icon-wrapper { background: linear-gradient(135deg, #b2dfdb, #4a7c59); color: white; }
        .card-gateway .card-icon-wrapper { background: linear-gradient(135deg, #006994, #5f9ea0); color: white; }
        .card-infra .card-icon-wrapper { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; }

        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        .card-description {
          color: #666;
          line-height: 1.8;
          margin-bottom: 1.75rem;
          font-size: 0.95rem;
        }

        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: rgba(45, 122, 62, 0.08);
          border-radius: 50px;
          color: var(--color-secondary);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .architecture-card:hover .card-badge {
          background: rgba(45, 122, 62, 0.15);
          transform: scale(1.05);
        }

        /* === Security Section === */
        .security-card {
          text-align: center;
          padding: 2.5rem 2rem;
          background: linear-gradient(135deg, #ffffff 0%, #f7fcf7 100%);
          border-radius: 24px;
          border: 2px solid rgba(45, 122, 62, 0.08);
          transition: all 0.5s var(--transition-smooth);
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .security-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(144, 238, 144, 0.05) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .security-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(45, 122, 62, 0.2);
          border-color: var(--color-secondary);
        }

        .security-card:hover::before {
          opacity: 1;
        }

        .security-icon-large {
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 2rem;
          font-size: 3.5rem;
          position: relative;
          transition: all 0.6s var(--transition-smooth);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .security-card:hover .security-icon-large {
          transform: scale(1.1) rotate(360deg);
        }

        .icon-ripple {
          position: absolute;
          inset: -15px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .security-card:hover .icon-ripple {
          animation: rippleEffect 2s ease-out infinite;
        }

        @keyframes rippleEffect {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .icon-security { 
          background: linear-gradient(135deg, #90ee90, #4a7c59); 
          color: white; 
        }

        .icon-security .icon-ripple { 
          background: linear-gradient(135deg, #90ee90, #4a7c59); 
        }

        .icon-performance { 
          background: linear-gradient(135deg, #5f9ea0, #8fbc8f); 
          color: white; 
        }

        .icon-performance .icon-ripple { 
          background: linear-gradient(135deg, #5f9ea0, #8fbc8f); 
        }

        .icon-offline { 
          background: linear-gradient(135deg, #8fbc8f, #2d5016); 
          color: white; 
        }

        .icon-offline .icon-ripple { 
          background: linear-gradient(135deg, #8fbc8f, #2d5016); 
        }

        .security-stats {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.25rem;
          background: white;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #333;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .security-card:hover .security-stats {
          transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        /* === CTA Final Section === */
        .cta-final-section {
          position: relative;
          padding: 8rem 0;
          background: #0a1f0f;
        }

        .cta-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a1f0f 0%, #1e4d2b 30%, #2d7a3e 70%, #3d9651 100%);
          z-index: 1;
        }

        .cta-mesh-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(144, 238, 144, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(61, 150, 81, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(95, 158, 160, 0.1) 0%, transparent 50%);
          z-index: 2;
        }

        .cta-icon-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
        }

        .cta-icon-orbit {
          position: absolute;
          border: 2px dashed rgba(144, 238, 144, 0.3);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }

        .orbit-1 { inset: -10px; animation-duration: 15s; }
        .orbit-2 { inset: -25px; animation-duration: 20s; animation-direction: reverse; }
        .orbit-3 { inset: -40px; animation-duration: 25s; }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cta-icon-large {
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(144, 238, 144, 0.2), rgba(61, 150, 81, 0.2));
          backdrop-filter: blur(10px);
          border: 3px solid rgba(144, 238, 144, 0.3);
          border-radius: 50%;
          animation: ctaPulse 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        .cta-icon-large i {
          font-size: 4.5rem;
          color: var(--color-light-green);
          filter: drop-shadow(0 0 20px var(--color-light-green));
        }

        @keyframes ctaPulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(144, 238, 144, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 60px rgba(144, 238, 144, 0.7);
            transform: scale(1.08);
          }
        }

        .btn-cta-primary,
        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 1.15rem 2.75rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.15rem;
          text-decoration: none;
          transition: all 0.4s var(--transition-smooth);
          position: relative;
          overflow: hidden;
        }

        .btn-cta-primary {
          background: white;
          color: var(--color-primary);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .btn-cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-light-green), var(--color-accent));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .btn-cta-primary:hover::before {
          opacity: 1;
        }

        .btn-cta-primary:hover {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.5);
          color: white;
        }

        .btn-cta-primary i,
        .btn-cta-primary span {
          position: relative;
          z-index: 2;
        }

        .btn-cta-secondary {
          background: transparent;
          color: white;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cta-secondary:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.15);
          border-color: white;
          color: white;
          box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2);
        }

        .floating-icons {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          font-size: 3.5rem;
          color: rgba(144, 238, 144, 0.2);
          animation: iconFloat 10s ease-in-out infinite;
        }

        .icon-1 { top: 10%; left: 8%; animation-delay: 0s; }
        .icon-2 { top: 65%; right: 12%; animation-delay: 2.5s; }
        .icon-3 { bottom: 15%; left: 15%; animation-delay: 5s; }
        .icon-4 { top: 35%; right: 20%; animation-delay: 7.5s; font-size: 2.5rem; }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.4;
          }
        }

        /* === Responsive Design === */
        @media (max-width: 1200px) {
          .hero-title { font-size: 5.5rem; }
          .hero-subtitle-text { font-size: 2.2rem; }
        }

        @media (max-width: 992px) {
          .hero-title { font-size: 4.5rem; letter-spacing: -2px; }
          .hero-subtitle-text { font-size: 2rem; }
          .hero-description { font-size: 1.2rem; }
          .display-4 { font-size: 2.5rem !important; }

          .visual-container { gap: 2rem; }
          .phone-mockup { width: 220px; height: 440px; }
          .web-mockup { width: 260px; height: 190px; }
          .connection-line { flex-direction: column; gap: 0.75rem; }
          .connection-segment { width: 3px; height: 30px; }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3.5rem; }
          .hero-subtitle-text { font-size: 1.6rem; }
          .hero-description { font-size: 1.05rem; padding: 0 1rem !important; }
          
          .platform-badge { padding: 0.4rem; }
          .platform-badge-inner { padding: 0.9rem 1.25rem; gap: 1rem; }
          .platform-badge i { font-size: 2.5rem; }
          .badge-title { font-size: 1.05rem; }
          .badge-subtitle { font-size: 0.85rem; }

          .phone-mockup { width: 190px; height: 380px; }
          .app-icon { font-size: 3rem !important; }
          .web-mockup { width: 220px; height: 170px; }
          .web-icon { font-size: 2rem !important; }

          .card-inner { padding: 2rem 1.5rem; }
          .card-icon-wrapper { width: 70px; height: 70px; font-size: 2.2rem; }
          .card-title { font-size: 1.2rem; }
          .card-description { font-size: 0.9rem; }

          .security-icon-large { width: 90px; height: 90px; font-size: 3rem; }
          
          .cta-icon-large { width: 110px; height: 110px; }
          .cta-icon-large i { font-size: 3.5rem; }
          .btn-cta-primary, .btn-cta-secondary { 
            padding: 1rem 2rem; 
            font-size: 1rem; 
            width: 100%; 
            justify-content: center; 
          }

          .floating-icon { font-size: 2.5rem; }
        }

        @media (max-width: 576px) {
          .hero-title { font-size: 2.8rem; }
          .hero-subtitle-text { font-size: 1.3rem; }
          .lead { font-size: 1rem !important; }

          .section-label { font-size: 0.75rem; padding: 0.65rem 1.25rem; letter-spacing: 1.5px; }
          .display-1 { font-size: 2.5rem !important; }
          .display-3 { font-size: 2rem !important; }
          .display-4 { font-size: 1.85rem !important; }

          .phone-mockup { width: 170px; height: 340px; padding: 10px; }
          .phone-screen { border-radius: 28px; }
          .app-icon-wrapper { width: 70px; height: 70px; }
          .app-icon { font-size: 2.5rem !important; }

          .web-mockup { width: 190px; height: 140px; }
          .web-icon-wrapper { width: 50px; height: 50px; }
          .web-icon { font-size: 1.5rem !important; }

          .feature-highlight-box { padding: 1.5rem !important; }
          .platform-item { padding: 1rem; gap: 1rem; }
          .platform-icon { width: 48px; height: 48px; font-size: 1.4rem; }
        }
      `}</style>
    </>
  );
};

export default Explorar;
