import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import ReseniasContext from "../../Context/Resenias/ReseniasContext";
import Swal from "sweetalert2";

const SeccionReseñas = () => {
  const { resenas, getResenas, createResena } = useContext(ReseniasContext);

  useEffect(() => {
    getResenas();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [nuevoComentario, setNuevoComentario] = useState({
    nombre: "",
    rol: "Explorador",
    comentario: "",
    estrellas: 5,
  });

  const handleClose = () => {
    setShowModal(false);
    setNuevoComentario({
      nombre: "",
      rol: "Explorador",
      comentario: "",
      estrellas: 5,
    });
  };
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setNuevoComentario({ ...nuevoComentario, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating) => {
    setNuevoComentario({ ...nuevoComentario, estrellas: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevoComentario.nombre.trim() || !nuevoComentario.comentario.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor escribe tu nombre y un comentario.",
        confirmButtonColor: "#1e4d2b",
      });
      return;
    }

    const dataToSend = {
      usuarioNombre: nuevoComentario.nombre,
      rol: nuevoComentario.rol,
      comentario: nuevoComentario.comentario,
      estrellas: nuevoComentario.estrellas,
    };

    try {
      await createResena(dataToSend);

      handleClose();

      Swal.fire({
        icon: "success",
        title: "¡Reseña Publicada!",
        text: "Gracias por compartir tu experiencia con la comunidad Kairos.",
        confirmButtonColor: "#1e4d2b",
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error al enviar reseña", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No pudimos publicar tu reseña. Inténtalo más tarde.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const renderEstrellas = (cantidad) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi bi-star-fill ${i < cantidad ? "text-warning" : "text-muted"}`}
        style={{
          marginRight: "4px",
          fontSize: "1rem",
          opacity: i < cantidad ? 1 : 0.3,
        }}
      ></i>
    ));
  };

  return (
    <>
      <section className="reviews-section position-relative overflow-hidden d-flex flex-column justify-content-center">
        <div className="reviews-bg-gradient"></div>
        <div className="reviews-particles"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>

        <Container className="position-relative py-5" style={{ zIndex: 10 }}>
          <div className="text-center mb-5">
            <div className="badge-review mb-3">
              <i className="bi bi-heart-fill me-2"></i> Testimonios
            </div>
            <h2 className="display-5 fw-bold text-white mb-3">
              Lo que dice nuestra{" "}
              <span className="text-highlight">Comunidad</span>
            </h2>
            <p
              className="lead text-white-50 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Descubre cómo <span className="text-white fw-bold">Kairos</span>{" "}
              está impactando positivamente en el bienestar digital de miles de
              usuarios.
            </p>
          </div>

          <Row className="g-4 mb-5 justify-content-center">
            {resenas && resenas.length > 0 ? (
              resenas.map((item) => (
                <Col key={item.idResena || item.id} lg={4} md={6}>
                  <div className="review-card h-100 animate-fade-in">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="stars-wrapper">
                        {renderEstrellas(item.estrellas)}
                      </div>
                      <div className="quote-icon">
                        <i className="bi bi-quote"></i>
                      </div>
                    </div>

                    <p className="review-text flex-grow-1">
                      "{item.comentario}"
                    </p>

                    <div className="d-flex align-items-center mt-4 pt-3 border-top border-secondary border-opacity-10">
                      <div className="avatar-circle me-3">
                        {item.usuarioNombre
                          ? item.usuarioNombre.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">
                          {item.usuarioNombre}
                        </h6>
                        <small
                          className="text-success fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {item.rol ? item.rol.toUpperCase() : "USUARIO"}
                        </small>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <div className="text-center text-white-50">
                <p>Aún no hay reseñas. ¡Sé el primero en comentar!</p>
              </div>
            )}
          </Row>

          <div className="text-center pb-4">
            <Button
              className="btn-review-custom px-5 py-3"
              onClick={handleShow}
            >
              Dejar una opinión <i className="bi bi-pencil-square ms-2"></i>
            </Button>
          </div>
        </Container>
      </section>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="modal-reviews"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">
            Comparte tu experiencia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2 pb-4">
          <Form onSubmit={handleSubmit}>
            <p className="text-muted small mb-4">
              Tu opinión nos ayuda a mejorar Kairos para todos.
            </p>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-secondary">
                Calificación
              </Form.Label>
              <div className="d-flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${star <= nuevoComentario.estrellas ? "bi-star-fill text-warning" : "bi-star text-muted"} fs-3`}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  ></i>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-secondary">
                Nombre
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre completo"
                name="nombre"
                value={nuevoComentario.nombre}
                onChange={handleChange}
                required
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-secondary">
                ¿Qué tipo de usuario eres?
              </Form.Label>
              <Form.Select
                name="rol"
                value={nuevoComentario.rol}
                onChange={handleChange}
                className="form-control-custom"
              >
                <option value="Explorador">Explorador</option>
                <option value="Usuario Nuevo">Usuario Nuevo</option>
                <option value="Usuario Premium">Usuario Premium</option>
                <option value="Viajero Local">Viajero Local</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small text-secondary">
                Tu comentario
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Cuéntanos qué te pareció..."
                name="comentario"
                value={nuevoComentario.comentario}
                onChange={handleChange}
                required
                className="form-control-custom"
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" className="btn-review-custom py-2">
                Publicar Reseña
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        /* === VARIABLES === */
        :root {
          --color-primary: #1e4d2b;
          --color-secondary: #2d7a3e;
          --color-accent: #3d9651;
          --color-light-green: #90ee90;
        }

        /* === SECCIÓN FULL HEIGHT === */
        .reviews-section {
          background: #0a1f0f;
          position: relative;
          min-height: 100vh; /* Ocupa al menos toda la altura de la vista */
          height: auto;      /* Crece si el contenido es mayor */
          width: 100%;
          /* Cambié align-items a stretch o normal para evitar cortes en listas largas */
        }

        /* === FONDO ANIMADO === */
        .reviews-bg-gradient {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 10% 20%, #1e4d2b 0%, #0a1f0f 40%),
                      radial-gradient(circle at 90% 80%, #2d5016 0%, #0a1f0f 40%);
          z-index: 1;
        }

        .reviews-particles {
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
          top: 10%; left: 5%;
          border-radius: 50%;
        }
        .shape-2 {
          width: 400px; height: 400px;
          background: rgba(95, 158, 160, 0.1);
          bottom: 10%; right: 5%;
          border-radius: 50%;
          animation-delay: 2s;
        }
        @keyframes floatShape {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        /* === ESTILOS TEXTOS === */
        .badge-review {
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

        /* === TARJETAS === */
        .review-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .review-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: var(--color-light-green); 
        }
        
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .review-text {
          color: #4b5563;
          font-style: italic;
          line-height: 1.6;
          font-size: 1rem;
        }

        .quote-icon {
          font-size: 2rem;
          color: var(--color-light-green);
          opacity: 0.5;
          line-height: 1;
        }

        .avatar-circle {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, var(--color-light-green) 0%, var(--color-accent) 100%);
          color: #0a1f0f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        /* === BOTÓN Y MODAL === */
        .btn-review-custom {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          border: 1px solid rgba(144, 238, 144, 0.3);
          color: white;
          font-weight: 700;
          border-radius: 12px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .btn-review-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(144, 238, 144, 0.2);
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
          color: white;
        }

        .form-control-custom {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 0.7rem;
        }
        .form-control-custom:focus {
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px rgba(61, 150, 81, 0.1);
        }

        @media (max-width: 768px) {
          .review-card {
            padding: 1.5rem;
          }
          .display-5 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default SeccionReseñas;
