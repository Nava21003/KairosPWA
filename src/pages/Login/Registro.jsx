import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth/AuthContext";
import RoleContext from "../../Context/Roles/RoleContext";
import Swal from "sweetalert2";

const ADMIN_PASSWORD_GATE = "admin1234";

const Registro = () => {
  const { register } = useContext(AuthContext);
  const { roles, getRoles } = useContext(RoleContext);

  const [accessGranted, setAccessGranted] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");
  const [accessError, setAccessError] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [idRol, setIdRol] = useState("2");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (accessGranted) {
      getRoles().catch(console.error);
    }
  }, [accessGranted, getRoles]);

  const handleAccessSubmit = (event) => {
    event.preventDefault();
    setAccessError("");
    if (accessPassword === ADMIN_PASSWORD_GATE) {
      setAccessGranted(true);
    } else {
      setAccessError(
        "Contraseña de administrador incorrecta. Acceso denegado."
      );
      setAccessPassword("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, revísalas.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        nombre,
        apellido,
        correo: email,
        contrasena: password,
        idRol: parseInt(idRol, 10),
        fotoPerfil: "",
      });

      if (response && response.success) {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Usuario registrado correctamente. Redirigiendo al Login...",
          icon: "success",
          confirmButtonColor: "#1e4d2b",
          confirmButtonText: "Ir a Login",
          timer: 3000,
          timerProgressBar: true,
          allowOutsideClick: false,
        }).then((result) => {
          navigate("/login");
        });
      } else {
        setError("Error en el registro. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Fallo de Registro en la API:", err);

      let errorMessage =
        "Ocurrió un error inesperado al intentar registrar el usuario.";

      if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 409) {
          errorMessage =
            "El correo ya está registrado. Por favor, inicia sesión o usa otro correo.";
        } else {
          errorMessage = `Error de servidor: ${err.response.status}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
      />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }
        .login-page-container { min-height: 100vh; display: flex; background: #f8f9fa; width: 100%; position: relative; }
        .full-height-row { width: 100%; height: 100vh; margin: 0; }
        .full-height-row > .col { padding: 0; }
        .login-visual-section { background: linear-gradient(135deg, #1e4d2b 0%, #2d7a3e 50%, #3d9651 100%); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; height: 100%; position: relative; overflow: hidden; }
        .visual-decoration { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.08); }
        .decoration-1 { width: 500px; height: 500px; top: -150px; right: -150px; animation: float1 20s ease-in-out infinite; }
        .decoration-2 { width: 350px; height: 350px; bottom: -100px; left: -100px; animation: float2 18s ease-in-out infinite; }
        .decoration-3 { width: 250px; height: 250px; top: 40%; left: 10%; animation: float3 15s ease-in-out infinite; }
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, 40px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -40px) scale(1.15); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(30px, 30px) rotate(180deg); } }
        .brand-content { position: relative; z-index: 10; text-align: center; max-width: 90%; }
        .brand-icon-wrapper { width: 130px; height: 130px; background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(20px); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem; box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25); animation: pulse-icon 4s ease-in-out infinite; }
        @keyframes pulse-icon { 0%, 100% { transform: scale(1); box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25); } 50% { transform: scale(1.08); box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35); } }
        .brand-icon-wrapper i { font-size: 4.5rem; color: white; filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3)); }
        .brand-title { font-family: 'Montserrat', 'Inter', sans-serif; font-size: 5rem; font-weight: 900; letter-spacing: 8px; margin-bottom: 1.5rem; text-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); color: #ffffff; line-height: 1.1; }
        .brand-tagline { font-size: 1.5rem; font-weight: 300; line-height: 1.8; opacity: 0.95; margin-bottom: 3.5rem; color: #ffffff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); }
        .brand-features { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-top: 3rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; }
        .feature-item { display: flex; align-items: center; gap: 1.25rem; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); padding: 1.5rem; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
        .feature-item:hover { transform: translateX(12px); background: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.3); box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2); }
        .feature-icon { width: 56px; height: 56px; background: rgba(255, 255, 255, 0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.2); }
        .feature-icon i { font-size: 1.65rem; color: white; }
        .feature-text { flex: 1; }
        .feature-text h4 { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.35rem 0; color: white; letter-spacing: 0.3px; }
        .feature-text p { font-size: 0.9rem; margin: 0; opacity: 0.85; color: white; line-height: 1.5; }
        .login-form-wrapper { display: flex; align-items: center; justify-content: center; padding: 0; width: 100%; height: 100%; background: #ffffff; position: relative; }
        .login-card-advanced { width: 100%; max-width: 520px; border: none; border-radius: 0; box-shadow: none; background: white; padding: 3rem 3.5rem; animation: slideIn 0.7s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .form-header { text-align: center; margin-bottom: 2.5rem; }
        .form-logo-mini { width: 70px; height: 70px; background: linear-gradient(135deg, #1e4d2b 0%, #2d7a3e 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.75rem; box-shadow: 0 10px 40px rgba(30, 77, 43, 0.25); }
        .form-logo-mini i { font-size: 2.2rem; color: white; }
        .form-title-main { font-family: 'Montserrat', 'Inter', sans-serif; font-size: 2.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 0.6rem; letter-spacing: -0.5px; }
        .form-subtitle { font-size: 1.05rem; color: #666; margin-bottom: 0; font-weight: 400; line-height: 1.5; }
        .form-label-custom { font-weight: 600; color: #333; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; }
        .form-control-custom { border: 2px solid #e5e5e5; border-radius: 14px; padding: 0.95rem 1.2rem; font-size: 1rem; box-shadow: none; transition: all 0.3s ease; background: #f8f9fa; }
        .form-control-custom:focus { border-color: #2d7a3e; box-shadow: 0 0 0 4px rgba(45, 122, 62, 0.1); background: white; outline: none; }
        .password-input-wrapper { position: relative; }
        .password-toggle-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #999; cursor: pointer; padding: 0.5rem; transition: color 0.3s ease; z-index: 10; }
        .password-toggle-btn:hover { color: #2d7a3e; }
        .password-toggle-btn i { font-size: 1.25rem; }
        .login-btn-submit { background: linear-gradient(135deg, #1e4d2b 0%, #2d7a3e 100%); border: none; border-radius: 14px; padding: 1.1rem 0; font-size: 1.1rem; font-weight: 700; box-shadow: 0 12px 35px rgba(30, 77, 43, 0.3); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); margin-top: 1.5rem; color: white; position: relative; overflow: hidden; }
        .login-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; box-shadow: none; transform: none; }
        .login-btn-submit:disabled::before { display: none; }
        .login-btn-submit::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent); transition: left 0.6s ease; }
        .login-btn-submit:not(:disabled):hover::before { left: 100%; }
        .login-btn-submit:not(:disabled):hover { background: linear-gradient(135deg, #2d7a3e 0%, #1e4d2b 100%); transform: translateY(-3px); box-shadow: 0 18px 50px rgba(30, 77, 43, 0.4); color: white; }
        .login-btn-submit:not(:disabled):active { transform: translateY(-1px); }
        .spinner-border-sm { width: 1rem; height: 1rem; border-width: 0.15em; margin-right: 0.5rem; }
        .divider { display: flex; align-items: center; text-align: center; margin: 2rem 0; color: #999; font-size: 0.9rem; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e5e5e5; }
        .divider span { padding: 0 1rem; font-weight: 500; }
        .social-login-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.85rem; border: 2px solid #e5e5e5; border-radius: 14px; background: white; color: #333; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; }
        .social-btn:hover { border-color: #2d7a3e; background: #f0f9f3; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45, 122, 62, 0.15); }
        .social-btn i { font-size: 1.3rem; }
        .signup-prompt { font-size: 0.95rem; margin-top: 2rem; color: #666; text-align: center; }
        .signup-link { color: #2d7a3e; font-weight: 700; text-decoration: none; transition: color 0.3s ease; }
        .signup-link:hover { color: #1e4d2b; text-decoration: underline; }
        .error-message { background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 1.1rem; border-radius: 14px; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.85rem; animation: shake 0.5s ease; box-shadow: 0 8px 24px rgba(220, 53, 69, 0.25); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .error-message i { font-size: 1.3rem; }
        .remember-me-wrapper { display: flex; align-items: center; gap: 0.6rem; margin-top: 1rem; margin-bottom: 1.5rem; }
        .remember-me-wrapper input[type="checkbox"] { width: 19px; height: 19px; cursor: pointer; accent-color: #2d7a3e; }
        .remember-me-wrapper label { font-size: 0.9rem; color: #666; cursor: pointer; margin: 0; font-weight: 500; }
        @media (max-width: 991.98px) { .login-visual-section { display: none !important; } .login-form-wrapper { width: 100%; height: 100vh; padding: 2rem 1.5rem; justify-content: center; background: #f8f9fa; } .login-card-advanced { max-width: 500px; width: 100%; height: auto; margin: auto; padding: 2.5rem 2rem; border-radius: 24px; box-shadow: 0 20px 80px rgba(0, 0, 0, 0.08); } }
        @media (max-width: 575.98px) { .login-card-advanced { padding: 2rem 1.5rem; border-radius: 20px; } .form-title-main { font-size: 1.85rem; } .form-subtitle { font-size: 0.95rem; } .brand-title { font-size: 3.5rem; letter-spacing: 4px; } .brand-tagline { font-size: 1.25rem; } .social-login-buttons { grid-template-columns: 1fr; } .form-logo-mini { width: 60px; height: 60px; } .form-logo-mini i { font-size: 1.8rem; } }
      `}</style>

      <div className="login-page-container">
        <Row className="full-height-row">
          <Col lg={7} className="d-none d-lg-block p-0">
            <div className="login-visual-section">
              <div className="visual-decoration decoration-1"></div>
              <div className="visual-decoration decoration-2"></div>
              <div className="visual-decoration decoration-3"></div>

              <div className="brand-content">
                <div className="brand-icon-wrapper">
                  <i className="bi bi-compass-fill"></i>
                </div>

                <h1 className="brand-title">KAIROS</h1>
                <p className="brand-tagline">
                  Transforma el Scroll Infinito en Exploración Real
                </p>

                <div className="brand-features">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="bi bi-robot"></i>
                    </div>
                    <div className="feature-text">
                      <h4>IA Inteligente</h4>
                      <p>Coaching personalizado con inteligencia artificial</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="bi bi-map-fill"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Rutas Optimizadas</h4>
                      <p>Descubre lugares increíbles cerca de ti</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Crecimiento Personal</h4>
                      <p>Mejora continua con métricas y análisis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={5} className="p-0">
            <div className="login-form-wrapper">
              {!accessGranted && (
                <Card className="login-card-advanced">
                  <div className="form-header">
                    <div className="form-logo-mini">
                      <i className="bi bi-shield-lock-fill"></i>
                    </div>
                    <h2 className="form-title-main">Acceso Restringido</h2>
                    <p className="form-subtitle">
                      Ingresa la contraseña de administrador para continuar con
                      el registro.
                    </p>
                  </div>
                  <Form onSubmit={handleAccessSubmit}>
                    <Form.Group className="mb-3" controlId="accessPassword">
                      <Form.Label className="form-label-custom">
                        Contraseña de Acceso
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="******"
                        className="form-control-custom"
                        required
                        value={accessPassword}
                        onChange={(e) => setAccessPassword(e.target.value)}
                      />
                    </Form.Group>

                    {accessError && (
                      <Alert variant="danger" className="mt-3">
                        {accessError}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-100 login-btn-submit mt-3"
                    >
                      Verificar Acceso
                    </Button>
                  </Form>
                </Card>
              )}

              {accessGranted && (
                <Card className="login-card-advanced">
                  <div className="form-header">
                    <div className="form-logo-mini">
                      <i className="bi bi-person-plus-fill"></i>
                    </div>
                    <h2 className="form-title-main">Registro de Usuario</h2>
                    <p className="form-subtitle">
                      Crea una nueva cuenta y asígnale un rol.
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formIdRol">
                      <Form.Label className="form-label-custom">
                        <i className="bi bi-shield-lock-fill"></i>
                        Asignar Rol
                      </Form.Label>
                      <Form.Select
                        className="form-control-custom"
                        value={idRol}
                        onChange={(e) => setIdRol(e.target.value)}
                        required
                      >
                        {roles.length === 0 && (
                          <option value="" disabled>
                            Cargando roles...
                          </option>
                        )}

                        {roles.map((role) => (
                          <option key={role.idRol} value={role.idRol}>
                            {role.nombreRol}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="formNombre">
                          <Form.Label className="form-label-custom">
                            <i className="bi bi-person-fill"></i>
                            Nombre
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Tu nombre"
                            className="form-control-custom"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formApellido">
                          <Form.Label className="form-label-custom">
                            Apellido
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Tu apellido"
                            className="form-control-custom"
                            required
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label className="form-label-custom">
                        <i className="bi bi-envelope-fill"></i>
                        Correo electrónico
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="tu.correo@ejemplo.com"
                        className="form-control-custom"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="form-label-custom mb-0">
                          <i className="bi bi-lock-fill"></i>
                          Contraseña
                        </Form.Label>
                      </div>
                      <div className="password-input-wrapper">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="form-control-custom"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ paddingRight: "50px" }}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Mostrar/Ocultar contraseña"
                        >
                          <i
                            className={`bi bi-eye${
                              showPassword ? "-slash" : ""
                            }-fill`}
                          ></i>
                        </button>
                      </div>
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="formConfirmPassword"
                    >
                      <Form.Label className="form-label-custom">
                        <i className="bi bi-lock-fill"></i>
                        Confirmar Contraseña
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Repite la contraseña"
                        className="form-control-custom"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>

                    {error && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-100 login-btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus-fill me-2"></i>
                          Crear Cuenta
                        </>
                      )}
                    </Button>

                    <div className="signup-prompt">
                      ¿Ya tienes una cuenta?{" "}
                      <a href="login" className="signup-link">
                        Inicia Sesión
                      </a>
                    </div>
                  </Form>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Registro;
