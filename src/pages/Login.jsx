import React, { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const mockCredentials = {
    email: "admin",
    password: "admin",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      email === mockCredentials.email &&
      password === mockCredentials.password
    ) {
      localStorage.setItem("isAuthenticated", "true");

      navigate("/admin");
    } else {
      setError(
        "Credenciales inválidas. Por favor, verifica tu correo y contraseña."
      );
    }
  };

  return (
    <>
      <style>{`
                /* ... TODOS TUS ESTILOS CSS ... */
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body, html {
                  height: 100%;
                  overflow: hidden;
                  font-family: 'Open Sans', sans-serif;
                }
                
                .login-page-container {
                  min-height: 100vh;
                  display: flex;
                  background: #ffffff;
                  width: 100%;
                }
                
                /* ... EL RESTO DE TUS ESTILOS ... */
                .full-height-row {
                  width: 100%;
                  height: 100vh;
                  margin: 0;
                }
                
                .full-height-row > .col {
                  padding: 0;
                }
            
                /* 3. Sección Visual (Columna Izquierda - Marca Kairos) */
                .login-visual-section {
                  background-color: #1a3c27;
                  background-image: 
                    linear-gradient(135deg, #2d5a3d 0%, #1a3c27 100%),
                    radial-gradient(circle at 20% 80%, rgba(45, 90, 61, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(26, 60, 39, 0.3) 0%, transparent 50%);
                  color: white;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 4rem;
                  height: 100%;
                  /* ELIMINAMOS EL BORDE REDONDEADO - AHORA ES CUADRADO */
                  border-radius: 0;
                  box-shadow: 15px 0 40px rgba(0, 0, 0, 0.25);
                  position: relative;
                  overflow: hidden;
                }
            
                .login-visual-section::before {
                  content: "";
                  position: absolute;
                  top: -50%;
                  right: -20%;
                  width: 300px;
                  height: 300px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.08);
                  z-index: 0;
                }
            
                .brand-content {
                  position: relative;
                  z-index: 1;
                  text-align: center;
                  max-width: 80%;
                }
            
                .brand-title {
                  font-family: 'Montserrat', sans-serif;
                  font-size: 3.5rem;
                  font-weight: 800;
                  letter-spacing: 2px;
                  margin-bottom: 1rem;
                  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
                  color: #ffffff;
                }
            
                .brand-tagline {
                  font-size: 1.2rem;
                  font-weight: 300;
                  line-height: 1.6;
                  opacity: 0.9;
                  margin-bottom: 3rem;
                  color: #e8f5e9;
                }
                
                .brand-subtitle {
                  font-size: 0.9rem;
                  opacity: 0.7;
                  margin-top: 2rem;
                  font-style: italic;
                  color: #c8e6c9;
                }
            
                .brand-image-container {
                  margin-top: 2rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  padding: 1.5rem;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                /* 4. Sección del Formulario (Columna Derecha) */
                .login-form-wrapper {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 2rem;
                  width: 100%;
                  height: 100%;
                  background: transparent;
                }
            
                .login-card-advanced {
                  width: 100%;
                  max-width: 450px;
                  border: 1px solid #e0e0e0;
                  /* ELIMINAMOS BORDES REDONDEADOS - AHORA ES CUADRADO */
                  border-radius: 0;
                  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                  background: white;
                  padding: 3rem 2.5rem;
                  animation: fadeIn 0.8s ease-out;
                  position: relative;
                }
            
                /* Línea superior también cuadrada */
                .login-card-advanced::before {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 6px;
                  background: linear-gradient(90deg, #1a3c27, #2d5a3d);
                  /* ELIMINAMOS BORDES REDONDEADOS */
                  border-radius: 0;
                }
            
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
            
                .form-title-main {
                  font-family: 'Montserrat', sans-serif;
                  font-size: 1.8rem;
                  font-weight: 700;
                  color: #1a3c27;
                  margin-bottom: 0.5rem;
                }
                
                .form-subtitle {
                  font-size: 1rem;
                  color: #555;
                  margin-bottom: 2rem;
                  font-weight: 400;
                }
                
                .form-label-custom {
                  font-weight: 600;
                  color: #1a3c27;
                  margin-bottom: 0.5rem;
                  display: block;
                  font-size: 0.9rem;
                }
            
                .form-control-custom {
                  border: 2px solid #e0e0e0;
                  /* Inputs también cuadrados */
                  border-radius: 0;
                  padding: 0.75rem 1rem;
                  font-size: 1rem;
                  box-shadow: none;
                  transition: all 0.3s ease;
                  background: #fafafa;
                }
            
                .form-control-custom:focus {
                  border-color: #1a3c27;
                  box-shadow: 0 0 0 0.2rem rgba(26, 60, 39, 0.15);
                  background: white;
                }
            
                .forgot-password-link {
                  font-size: 0.85rem;
                  color: #2d5a3d;
                  text-decoration: none;
                  transition: color 0.3s ease;
                  font-weight: 500;
                }
            
                .forgot-password-link:hover {
                  color: #1a3c27;
                  text-decoration: underline;
                }
            
                .login-btn-submit {
                  background-color: #1a3c27;
                  border: none;
                  /* Botón también cuadrado */
                  border-radius: 0;
                  padding: 0.9rem 0;
                  font-size: 1.05rem;
                  font-weight: 600;
                  box-shadow: 0 5px 15px rgba(26, 60, 39, 0.3);
                  transition: all 0.3s ease;
                  margin-top: 0.5rem;
                  color: white;
                }
            
                .login-btn-submit:hover {
                  background-color: #2d5a3d;
                  transform: translateY(-2px);
                  box-shadow: 0 8px 20px rgba(26, 60, 39, 0.4);
                  color: white;
                }
                
                .signup-prompt {
                    font-size: 0.9rem;
                    margin-top: 1.5rem;
                    color: #666;
                }
            
                .signup-link {
                  color: #1a3c27;
                  font-weight: 600;
                  text-decoration: none;
                  transition: color 0.3s ease;
                }
            
                .signup-link:hover {
                  color: #2d5a3d;
                  text-decoration: underline;
                }
            
                /* 5. Responsive (Media Query) */
                @media (max-width: 991.98px) {
                  .login-visual-section {
                    display: none !important; 
                  }
                  .login-form-wrapper {
                    width: 100%;
                    height: 100vh;
                    padding: 1.5rem;
                  }
                  .login-card-advanced {
                    max-width: 100%;
                    margin: auto;
                    padding: 2.5rem 2rem;
                    border: 1px solid #e0e0e0;
                  }
                }
                
                @media (max-width: 575.98px) {
                  .login-card-advanced {
                    padding: 2rem 1.5rem;
                    border: 1px solid #e0e0e0;
                  }
                  .form-title-main {
                    font-size: 1.6rem;
                  }
                  .brand-title {
                    font-size: 2.8rem;
                  }
                  .brand-tagline {
                    font-size: 1.1rem;
                  }
                }
            
            `}</style>

      <div className="login-page-container">
        <Row className="full-height-row">
          <Col lg={6} className="d-none d-lg-block p-0">
            <div className="login-visual-section">
              <div className="brand-content">
                <h1 className="brand-title">KAIROS</h1>
                <p className="brand-tagline">
                  Transforma el Scroll Infinito en Exploración Real
                </p>

                <div className="brand-image-container">
                  <img
                    src="/kairos.png"
                    alt="Logo Kairos"
                    width="400"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>

          <Col lg={6} className="p-0">
            <div className="login-form-wrapper">
              <Card className="login-card-advanced">
                <div className="text-center mb-4">
                  <h2 className="form-title-main">Bienvenido de nuevo</h2>
                  <p className="form-subtitle">
                    Inicia sesión para continuar tu aventura.
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="form-label-custom">
                      Correo electrónico
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="tu.correo@ejemplo.com"
                      className="form-control-custom"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label className="form-label-custom">
                        Contraseña
                      </Form.Label>
                      <a href="#olvido" className="forgot-password-link">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      className="form-control-custom"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  {error && (
                    <p
                      className="text-danger text-center mb-3"
                      style={{ fontSize: "0.9rem", fontWeight: 600 }}
                    >
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-100 login-btn-submit">
                    Iniciar Sesión
                  </Button>

                  <div className="text-center mt-4">
                    <p className="signup-prompt">
                      ¿No tienes una cuenta?{" "}
                      <a href="#registro" className="signup-link">
                        Regístrate aquí
                      </a>
                    </p>
                  </div>
                </Form>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
