import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="hero-section text-dark d-flex align-items-center position-relative overflow-hidden">
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>

        <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
          <Row className="align-items-center justify-content-center min-vh-80">
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

              <div className="hero-stats d-flex gap-4 flex-wrap">
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
                        <div className="feature-pill">
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

      {/* Sección de Propósito - Diseño Mejorado */}
      <section className="purpose-section py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label">Nuestro Propósito</span>
            <h2 className="display-5 fw-bold text-dark mt-3 mb-2">
              Transformando Vidas a Través de la Exploración
            </h2>
            <p className="text-secondary lead">
              Tres pilares fundamentales que guían cada paso de nuestra misión
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="purpose-card h-100">
                <div className="purpose-icon-wrapper mission">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold mb-3 text-dark">
                    <span style={{ color: "#4a7c59" }}>01.</span> Misión
                  </Card.Title>
                  <Card.Text
                    className="text-secondary"
                    style={{ lineHeight: "1.7" }}
                  >
                    Guiar a las personas hacia la{" "}
                    <strong>exploración proactiva</strong> de su entorno,
                    transformando el tiempo digital pasivo en crecimiento
                    personal tangible en el mundo real.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="purpose-card h-100">
                <div className="purpose-icon-wrapper vision">
                  <i className="bi bi-eye-fill"></i>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold mb-3 text-dark">
                    <span style={{ color: "#5f9ea0" }}>02.</span> Visión
                  </Card.Title>
                  <Card.Text
                    className="text-secondary"
                    style={{ lineHeight: "1.7" }}
                  >
                    Ser el ecosistema líder a nivel global en la fusión de
                    <strong> Inteligencia Artificial y Bienestar</strong>,
                    haciendo que la mejora personal sea una parte orgánica de la
                    vida diaria.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="purpose-card h-100">
                <div className="purpose-icon-wrapper values">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold mb-3 text-dark">
                    <span style={{ color: "#8fbc8f" }}>03.</span> Valores
                  </Card.Title>
                  <div className="values-list">
                    <div className="value-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Conciencia Digital</span>
                    </div>
                    <div className="value-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Exploración Proactiva</span>
                    </div>
                    <div className="value-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Seguridad y Resiliencia</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección de Características - Rediseñada */}
      <section className="features-section py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <span className="section-label light">Características</span>
            <h2 className="display-5 fw-bold text-dark mt-3 mb-2">
              Tres Pilares de Transformación
            </h2>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card green">
                <div className="feature-number">01</div>
                <div className="feature-icon">
                  <i className="bi bi-signpost-2-fill"></i>
                </div>
                <h3 className="h4 fw-bold mb-3 text-dark">
                  Rutas Inteligentes
                </h3>
                <p className="text-secondary mb-4">
                  Generación automática de rutas personalizadas con IA. Descubre
                  lugares únicos adaptados a tus intereses y preferencias.
                </p>
                <div className="feature-tags">
                  <span className="tag">IA Adaptativa</span>
                  <span className="tag">POIs Únicos</span>
                  <span className="tag">Rutas Manuales</span>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="feature-card teal">
                <div className="feature-number">02</div>
                <div className="feature-icon">
                  <i className="bi bi-cpu-fill"></i>
                </div>
                <h3 className="h4 fw-bold mb-3 text-dark">Coach Proactivo</h3>
                <p className="text-secondary mb-4">
                  Monitoreo inteligente de uso digital. Tu asistente personal te
                  sugiere "Paseos de Mejora" en el momento perfecto.
                </p>
                <div className="feature-tags">
                  <span className="tag">Monitor Digital</span>
                  <span className="tag">Alertas IA</span>
                  <span className="tag">Bienestar</span>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="feature-card sage">
                <div className="feature-number">03</div>
                <div className="feature-icon">
                  <i className="bi bi-shield-fill-check"></i>
                </div>
                <h3 className="h4 fw-bold mb-3 text-dark">Seguridad Total</h3>
                <p className="text-secondary mb-4">
                  Botón de pánico, alertas de emergencia y marcación rápida al
                  911. Tu seguridad es nuestra máxima prioridad.
                </p>
                <div className="feature-tags">
                  <span className="tag">SOS Rápido</span>
                  <span className="tag">GPS Real</span>
                  <span className="tag">24/7</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="cta-section py-5 text-white text-center">
        <div className="cta-decoration-top"></div>
        <Container className="py-5">
          <div className="cta-content">
            <div className="cta-icon-wrapper mb-4">
              <i
                className="bi bi-stars"
                style={{ fontSize: "3.5rem", color: "#90ee90" }}
              ></i>
            </div>
            <h2 className="display-5 fw-bold mb-4">
              ¿Listo para Transformar tu Día a Día?
            </h2>
            <p
              className="lead mb-5 text-white-50"
              style={{ maxWidth: "700px", margin: "0 auto 2rem" }}
            >
              Únete a miles de personas que ya están viviendo una vida más
              consciente y activa
            </p>
            <Button href="#" size="lg" className="cta-final-btn px-5 py-3">
              <i className="bi bi-download me-2"></i>
              Descargar KAIROS Gratis
            </Button>
          </div>
        </Container>
        <div className="cta-decoration-bottom"></div>
      </section>

      <style>{`
        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          background: #ffffff;
          position: relative;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(74, 124, 89, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(95, 158, 160, 0.15) 0%, transparent 50%);
          z-index: 1;
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, rgba(144, 238, 144, 0.3), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(143, 188, 143, 0.3), transparent),
            radial-gradient(1px 1px at 50% 50%, rgba(95, 158, 160, 0.2), transparent),
            radial-gradient(1px 1px at 80% 10%, rgba(144, 238, 144, 0.2), transparent);
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
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% auto;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        .hero-title {
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hero-stats {
          margin-top: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #4a7c59;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(45, 80, 22, 0.6);
          margin-top: 0.25rem;
        }

        /* Phone Mockup */
        .phone-mockup {
          position: relative;
          width: 320px;
          height: 640px;
          margin: 0 auto;
          background: #1a1a1a;
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3),
                      0 0 0 3px #000000,
                      inset 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .mockup-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #5f9ea0 100%);
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }

        .screen-content {
          text-align: center;
          width: 100%;
        }

        .app-header-mockup {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .qr-section {
          padding: 2rem 0;
          position: relative;
        }

        .qr-code-box {
          width: 140px;
          height: 140px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 2;
        }

        .pulse-ring {
          position: absolute;
          width: 140px;
          height: 140px;
          border: 3px solid #90ee90;
          border-radius: 20px;
          animation: pulse 2s ease-out infinite;
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .app-features-mockup {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 1.5rem;
          padding: 0 1rem;
        }

        .feature-pill {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 1rem 1.5rem;
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .feature-pill:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.02);
        }

        .feature-pill i {
          font-size: 1.2rem;
          color: #90ee90;
        }

        .pulse-ring {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 3px solid #90ee90;
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
          opacity: 0;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .element-1 {
          top: 10%;
          right: -10%;
          animation-delay: 0s;
        }

        .element-2 {
          bottom: 20%;
          left: -5%;
          animation-delay: 2s;
        }

        .element-3 {
          top: 60%;
          right: -5%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        /* Buttons */
        .cta-primary {
          background: linear-gradient(135deg, #4a7c59 0%, #2d5016 100%);
          border: none;
          color: #ffffff;
          font-weight: 700;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(74, 124, 89, 0.5);
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
        }

        .cta-secondary {
          background: rgba(143, 188, 143, 0.1);
          border: 2px solid #8fbc8f;
          color: #4a7c59;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: rgba(143, 188, 143, 0.2);
          border-color: #4a7c59;
          color: #2d5016;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(143, 188, 143, 0.3);
        }

        /* Purpose Section */
        .purpose-section {
          background: #ffffff;
          padding: 4rem 0;
        }

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

        .purpose-card {
          background: #ffffff;
          border: 1px solid rgba(74, 124, 89, 0.15);
          border-radius: 20px;
          transition: all 0.4s ease;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .purpose-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #4a7c59, #5f9ea0);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .purpose-card:hover {
          transform: translateY(-10px);
          border-color: rgba(143, 188, 143, 0.4);
          box-shadow: 0 15px 40px rgba(74, 124, 89, 0.2);
        }

        .purpose-card:hover::before {
          transform: scaleX(1);
        }

        .purpose-icon-wrapper {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 3rem;
          position: relative;
          overflow: hidden;
        }

        .purpose-icon-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          filter: blur(20px);
          opacity: 0.5;
        }

        .purpose-icon-wrapper i {
          position: relative;
          z-index: 2;
        }

        .mission {
          background: linear-gradient(135deg, rgba(74, 124, 89, 0.25), rgba(74, 124, 89, 0.08));
          color: #4a7c59;
        }

        .vision {
          background: linear-gradient(135deg, rgba(95, 158, 160, 0.25), rgba(95, 158, 160, 0.08));
          color: #5f9ea0;
        }

        .values {
          background: linear-gradient(135deg, rgba(143, 188, 143, 0.25), rgba(143, 188, 143, 0.08));
          color: #8fbc8f;
        }

        .values-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(45, 80, 22, 0.8);
          font-size: 0.95rem;
        }

        .value-item i {
          color: #4a7c59;
          font-size: 1.1rem;
        }

        /* Features Section */
        .features-section {
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, rgba(74, 124, 89, 0.08) 0%, transparent 50%);
        }

        .feature-card {
          background: #ffffff;
          border-radius: 25px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(74, 124, 89, 0.15);
          transition: all 0.4s ease;
          height: 100%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(74, 124, 89, 0.03) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card.green:hover {
          border-color: rgba(74, 124, 89, 0.5);
          box-shadow: 0 20px 60px rgba(74, 124, 89, 0.2);
          transform: translateY(-10px);
        }

        .feature-card.teal:hover {
          border-color: rgba(95, 158, 160, 0.5);
          box-shadow: 0 20px 60px rgba(95, 158, 160, 0.2);
          transform: translateY(-10px);
        }

        .feature-card.sage:hover {
          border-color: rgba(143, 188, 143, 0.5);
          box-shadow: 0 20px 60px rgba(143, 188, 143, 0.2);
          transform: translateY(-10px);
        }

        .feature-number {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 4rem;
          font-weight: 900;
          color: rgba(74, 124, 89, 0.05);
          line-height: 1;
        }

        .feature-icon {
          width: 90px;
          height: 90px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 3rem;
          position: relative;
        }

        .green .feature-icon {
          background: linear-gradient(135deg, rgba(74, 124, 89, 0.25), rgba(45, 80, 22, 0.1));
          color: #4a7c59;
          box-shadow: 0 10px 30px rgba(74, 124, 89, 0.2);
        }

        .teal .feature-icon {
          background: linear-gradient(135deg, rgba(95, 158, 160, 0.25), rgba(95, 158, 160, 0.1));
          color: #5f9ea0;
          box-shadow: 0 10px 30px rgba(95, 158, 160, 0.2);
        }

        .sage .feature-icon {
          background: linear-gradient(135deg, rgba(143, 188, 143, 0.25), rgba(143, 188, 143, 0.1));
          color: #8fbc8f;
          box-shadow: 0 10px 30px rgba(143, 188, 143, 0.2);
        }

        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-tags .tag {
          padding: 0.4rem 0.8rem;
          background: rgba(74, 124, 89, 0.08);
          border: 1px solid rgba(74, 124, 89, 0.15);
          border-radius: 20px;
          font-size: 0.75rem;
          color: rgba(45, 80, 22, 0.8);
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #5f9ea0 100%);
          position: relative;
          overflow: hidden;
          margin-top: 4rem;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(144, 238, 144, 0.15) 0%, transparent 70%);
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
          margin: 0 auto;
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

        .cta-content {
          position: relative;
          z-index: 2;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-section {
            min-height: auto;
          }

          .phone-mockup {
            width: 280px;
            height: 560px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .floating-element {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .hero-title {
            font-size: 2rem;
          }

          .stat-item {
            flex: 1;
          }

          .feature-number {
            font-size: 3rem;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
