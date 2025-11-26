import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  Badge,
  InputGroup,
  Alert,
} from "react-bootstrap";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Mail,
  Key,
  X,
  CheckCircle,
  XCircle,
  Hash,
  Save,
  User,
  Zap,
  Search,
  Filter,
  Calendar,
  Camera, // Agregado para el botón de subir foto
} from "lucide-react";

import UserContext from "../../Context/User/UserContext";
import UserState from "../../Context/User/UserState";
import RoleContext from "../../Context/Roles/RoleContext";
import RoleState from "../../Context/Roles/RoleState";

const kairosTheme = {
  primary: "#4ecca3",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  light: "#f8f9fa",
  dark: "#2c3e50",
  white: "#ffffff",
  cardBg: "#ffffff",
  bodyBg: "#f4f6f9",
};

const MessageBox = ({ message }) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle size={20} />,
    danger: <XCircle size={20} />,
    info: <Mail size={20} />,
  };

  const colorMap = {
    success: kairosTheme.success,
    danger: kairosTheme.danger,
    info: kairosTheme.info,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050,
        backgroundColor: colorMap[message.type] || kairosTheme.info,
        color: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: 600,
        animation: "slideInRight 0.3s ease-out",
        minWidth: "300px",
      }}
    >
      {iconMap[message.type]}
      <span>{message.text}</span>
    </div>
  );
};

const UsuarioModal = ({
  show,
  handleClose,
  saveUser,
  usuario,
  roles,
  loading,
}) => {
  const isEditing = usuario !== null;
  const fileInputRef = useRef(null); // Referencia para el input de archivo

  const initialFormData = {
    idRol: 2,
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    estatus: true,
    fotoPerfil: "", // Nuevo campo agregado
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (usuario && show) {
      setFormData({
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        idRol: usuario.idRol ? parseInt(usuario.idRol) : 2,
        contrasena: "",
        estatus: usuario.estatus ?? true,
        fotoPerfil: usuario.fotoPerfil || "", // Cargar foto existente si la hay
      });
    } else if (!show) {
      // Resetear form cuando el modal se cierra
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [usuario, show]);

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    if (!formData.correo.trim()) {
      errors.correo = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = "El correo no es válido";
    }

    if (!isEditing && !formData.contrasena) {
      errors.contrasena = "La contraseña es requerida";
    } else if (formData.contrasena && formData.contrasena.length < 6) {
      errors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejador para la carga de imagen (Convierte a Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (ej. max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fotoPerfil: reader.result, // Esto guarda el string Base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      ...formData,
      idRol: parseInt(formData.idRol),
    };

    if (isEditing && !dataToSend.contrasena) {
      delete dataToSend.contrasena;
    }

    saveUser(dataToSend, isEditing);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header
        closeButton
        style={{
          borderBottom: `3px solid ${kairosTheme.primary}`,
          backgroundColor: kairosTheme.light,
        }}
      >
        <Modal.Title className="d-flex align-items-center fw-bold">
          {isEditing ? (
            <>
              <Pencil className="me-2" style={{ color: kairosTheme.info }} />
              Editar Usuario
            </>
          ) : (
            <>
              <UserPlus
                className="me-2"
                style={{ color: kairosTheme.primary }}
              />
              Nuevo Usuario
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          {/* SECCIÓN DE FOTO DE PERFIL AGREGADA */}
          <div className="d-flex justify-content-center mb-4">
            <div className="position-relative">
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `4px solid ${kairosTheme.light}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.fotoPerfil ? (
                  <img
                    src={formData.fotoPerfil}
                    alt="Perfil"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={60} color="#adb5bd" />
                )}
              </div>
              <Button
                size="sm"
                onClick={triggerFileInput}
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: kairosTheme.primary,
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                <Camera size={18} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <User size={16} className="me-1" /> Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                isInvalid={!!formErrors.nombre}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <User size={16} className="me-1" /> Apellido
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={7}>
              <Form.Label className="fw-semibold">
                <Mail
                  size={16}
                  className="me-1"
                  style={{ color: kairosTheme.info }}
                />
                Correo Electrónico *
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="nombre@dominio.com"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                isInvalid={!!formErrors.correo}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.correo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={5}>
              <Form.Label className="fw-semibold">
                <Zap size={16} className="me-1" /> Rol *
              </Form.Label>
              <Form.Select
                name="idRol"
                value={formData.idRol}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              >
                {roles.map((rol) => (
                  <option key={`modal-role-${rol.idRol}`} value={rol.idRol}>
                    {rol.nombreRol}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Key
                size={16}
                className="me-1"
                style={{ color: kairosTheme.danger }}
              />
              Contraseña
              {isEditing && (
                <small className="ms-2 text-muted">
                  (Dejar vacío para no cambiar)
                </small>
              )}
              {!isEditing && " *"}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder={isEditing ? "********" : "Ingresa contraseña"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              isInvalid={!!formErrors.contrasena}
              required={!isEditing}
              style={{ borderRadius: "8px", padding: "0.625rem" }}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.contrasena}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="estatus"
              id="estatus-switch"
              label={
                <span className="d-flex align-items-center fw-semibold">
                  <Zap
                    size={18}
                    className="me-2"
                    style={{
                      color: formData.estatus
                        ? kairosTheme.success
                        : kairosTheme.danger,
                    }}
                  />
                  {formData.estatus ? "Usuario Activo" : "Usuario Inactivo"}
                </span>
              }
              checked={formData.estatus}
              onChange={handleChange}
              style={{ fontSize: "1.05rem" }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: kairosTheme.light }}>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={loading}
          style={{ borderRadius: "8px", padding: "0.5rem 1.25rem" }}
        >
          <X className="me-1" size={16} /> Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: kairosTheme.primary,
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.5rem",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <Save className="me-2" size={16} />
          )}
          {isEditing ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const UsuariosContent = () => {
  const {
    users = [],
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useContext(UserContext);

  const { roles = [], getRoles } = useContext(RoleContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    roles: false,
    action: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const memoizedGetUsers = useCallback(async () => {
    if (loading.users) return; // Evitar llamadas simultáneas

    setLoading((prev) => ({ ...prev, users: true }));
    try {
      await getUsers();
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      showMessage("Error al cargar los usuarios", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, [getUsers]);

  const memoizedGetRoles = useCallback(async () => {
    if (loading.roles) return; // Evitar llamadas simultáneas

    setLoading((prev) => ({ ...prev, roles: true }));
    try {
      await getRoles();
    } catch (error) {
      console.error("Error cargando roles:", error);
      showMessage("Error al cargar los roles", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, roles: false }));
    }
  }, [getRoles]);

  useEffect(() => {
    const loadData = async () => {
      await memoizedGetUsers();
      await memoizedGetRoles();
    };

    loadData();
  }, []); // Solo se ejecuta una vez al montar el componente

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreate = () => {
    setUsuarioToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const user = users.find((u) => u.idUsuario === id);
    if (user) {
      setUsuarioToEdit(user);
      setShowModal(true);
    } else {
      showMessage("Usuario no encontrado para editar", "danger");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioToEdit(null);
  };

  const saveUser = async (userData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateUser(userData.idUsuario, userData);
        showMessage(`Usuario actualizado exitosamente`, "success");
      } else {
        await createUser(userData);
        showMessage(`Usuario creado exitosamente`, "success");
      }
      handleCloseModal();
      // Recargar usuarios después de una operación exitosa
      await memoizedGetUsers();
    } catch (error) {
      showMessage(
        `Error al ${isEditing ? "actualizar" : "crear"} usuario: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la operación de usuario:", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteUser(idToDelete);
      showMessage(`Usuario eliminado exitosamente`, "success");
      // Recargar usuarios después de eliminar
      await memoizedGetUsers();
    } catch (error) {
      showMessage(
        `Error al eliminar usuario: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la eliminación:", error);
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleToggleEstatus = async (id) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const user = users.find((u) => u.idUsuario === id);
      const newStatus = !user.estatus;

      await toggleUserStatus(id);
      showMessage(
        `Estatus cambiado a ${newStatus ? "Activo" : "Inactivo"}`,
        "success"
      );
      // Recargar usuarios después de cambiar estatus
      await memoizedGetUsers();
    } catch (error) {
      showMessage(
        `Error al cambiar el estatus: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error al cambiar estatus:", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";

    try {
      const date = new Date(dateTimeString);

      if (isNaN(date.getTime())) {
        // Intentar con formato alternativo si el primero falla
        const altDate = new Date(dateTimeString.replace(" ", "T"));
        if (isNaN(altDate.getTime())) return "Fecha Inválida";

        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        return altDate.toLocaleDateString("es-ES", options);
      }

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("es-ES", options);
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha Inválida";
    }
  };

  const currentUsers = Array.isArray(users) ? users : [];
  const currentRoles = Array.isArray(roles) ? roles : [];

  const filteredUsers = currentUsers.filter((user) => {
    const firstName = user.nombre || "";
    const lastName = user.apellido || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const email = (user.correo || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(search) || email.includes(search);
    const matchesRole =
      filterRole === "all" || user.idRol === parseInt(filterRole);

    return matchesSearch && matchesRole;
  });

  const isLoading = loading.users || loading.roles || loading.action;

  return (
    <Container
      fluid
      style={{
        backgroundColor: kairosTheme.bodyBg,
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
        }

        .table-row-hover {
          transition: all 0.2s ease;
        }

        .table-row-hover:hover {
          background-color: rgba(78, 204, 163, 0.08) !important;
        }

        .btn-action {
          transition: all 0.2s ease;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-weight: 600;
        }

        .btn-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-input:focus {
          border-color: ${kairosTheme.primary};
          box-shadow: 0 0 0 0.25rem rgba(78, 204, 163, 0.25);
        }

        .stat-card {
          border-left: 4px solid ${kairosTheme.primary};
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-left-width: 6px;
        }
      `}</style>

      <UsuarioModal
        show={showModal}
        handleClose={handleCloseModal}
        saveUser={saveUser}
        usuario={usuarioToEdit}
        roles={currentRoles}
        loading={loading.action}
      />

      <MessageBox message={message} />

      <Container fluid className="p-4">
        <div
          style={{
            background: `linear-gradient(135deg, ${kairosTheme.primary} 0%, #3cae8a 100%)`,
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 24px rgba(78, 204, 163, 0.3)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center text-white">
                <Users size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Usuarios
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra los usuarios del sistema de forma eficiente
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button
                onClick={handleCreate}
                disabled={isLoading}
                style={{
                  backgroundColor: kairosTheme.white,
                  color: kairosTheme.primary,
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                }}
                className="btn-action"
              >
                <UserPlus className="me-2" size={20} />
                Nuevo Usuario
              </Button>
            </Col>
          </Row>
        </div>

        {/* Mostrar estado de carga */}
        {isLoading && (
          <Alert variant="info" className="mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando datos...
          </Alert>
        )}

        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Total Usuarios</p>
                  <h3 className="mb-0 fw-bold">
                    {loading.users ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentUsers.length
                    )}
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.primary}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Users size={32} style={{ color: kairosTheme.primary }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.success,
                animation: "fadeIn 0.7s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">
                    Usuarios Activos
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.users ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentUsers.filter((u) => u.estatus).length
                    )}
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.success}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <CheckCircle
                    size={32}
                    style={{ color: kairosTheme.success }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.danger,
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">
                    Usuarios Inactivos
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.users ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentUsers.filter((u) => !u.estatus).length
                    )}
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.danger}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <XCircle size={32} style={{ color: kairosTheme.danger }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card
          className="border-0 shadow-sm mb-4 card-hover"
          style={{ borderRadius: "12px", animation: "fadeIn 0.9s ease-out" }}
        >
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      backgroundColor: kairosTheme.white,
                      border: "2px solid #e0e0e0",
                      borderRight: "none",
                      borderRadius: "10px 0 0 10px",
                    }}
                  >
                    <Search size={20} style={{ color: kairosTheme.primary }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{
                      border: "2px solid #e0e0e0",
                      borderLeft: "none",
                      borderRadius: "0 10px 10px 0",
                      padding: "0.625rem 1rem",
                    }}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      backgroundColor: kairosTheme.white,
                      border: "2px solid #e0e0e0",
                      borderRight: "none",
                      borderRadius: "10px 0 0 10px",
                    }}
                  >
                    <Filter size={20} style={{ color: kairosTheme.info }} />
                  </InputGroup.Text>
                  <Form.Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    style={{
                      border: "2px solid #e0e0e0",
                      borderLeft: "none",
                      borderRadius: "0 10px 10px 0",
                      padding: "0.625rem 1rem",
                    }}
                  >
                    <option value="all">Todos los roles</option>
                    {currentRoles.map((rol) => (
                      <option
                        key={`filter-role-${rol.idRol}`}
                        value={rol.idRol}
                      >
                        {rol.nombreRol}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {confirmingId && (
          <Card
            className="shadow-lg mb-4 border-0"
            style={{
              borderRadius: "12px",
              borderLeft: `5px solid ${kairosTheme.danger}`,
              backgroundColor: `${kairosTheme.danger}10`,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <XCircle
                  size={32}
                  style={{ color: kairosTheme.danger }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1 fw-bold">Confirmar Eliminación</h5>
                  <p className="mb-0 text-muted">
                    ¿Estás seguro de eliminar al usuario ID:{" "}
                    <b>{confirmingId}</b>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="danger"
                  onClick={executeDelete}
                  disabled={loading.action}
                  className="btn-action"
                  style={{ borderRadius: "8px" }}
                >
                  <Trash2 className="me-1" size={16} /> Eliminar
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setConfirmingId(null)}
                  disabled={loading.action}
                  className="btn-action"
                  style={{ borderRadius: "8px" }}
                >
                  <X className="me-1" size={16} /> Cancelar
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        <Card
          className="border-0 shadow-sm"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            animation: "fadeIn 1s ease-out",
          }}
        >
          <div className="table-responsive">
            {loading.users ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: kairosTheme.primary }}
                  className="mb-3"
                />
                <p className="text-muted">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <Users
                  size={64}
                  style={{ color: kairosTheme.secondary, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-muted">No se encontraron usuarios</h5>
                <p className="text-muted">
                  {searchTerm || filterRole !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando un nuevo usuario"}
                </p>
              </div>
            ) : (
              <Table
                className="align-middle mb-0"
                style={{ minWidth: "1000px" }}
              >
                <thead style={{ backgroundColor: kairosTheme.light }}>
                  <tr>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Hash size={16} className="me-1" /> ID
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <User size={16} className="me-1" /> Usuario
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Mail size={16} className="me-1" /> Correo
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Zap size={16} className="me-1" /> Rol
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Calendar size={16} className="me-1" /> Registro
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                      className="text-center"
                    >
                      Estatus
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                      className="text-center"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const firstName = u.nombre || "";
                    const lastName = u.apellido || "";
                    const fullName = `${firstName} ${lastName}`.trim();
                    const roleName =
                      currentRoles.find((r) => r.idRol === u.idRol)
                        ?.nombreRol ||
                      u.idRolNavigation?.nombreRol ||
                      "Rol Desconocido";

                    return (
                      <tr
                        key={`user-${u.idUsuario}`}
                        className="table-row-hover"
                      >
                        <td style={{ padding: "1rem" }}>
                          <Badge
                            bg="light"
                            text="dark"
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            #{u.idUsuario}
                          </Badge>
                        </td>
                        {/* CELDA DE USUARIO MODIFICADA PARA INCLUIR FOTO */}
                        <td style={{ padding: "1rem" }}>
                          <div className="d-flex align-items-center">
                            {u.fotoPerfil ? (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  marginRight: "0.75rem",
                                  border: `2px solid ${kairosTheme.light}`,
                                }}
                              >
                                <img
                                  src={u.fotoPerfil}
                                  alt={firstName}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: kairosTheme.primary,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "0.75rem",
                                  fontWeight: 700,
                                  color: kairosTheme.white,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {firstName.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            <div>
                              <div className="fw-bold">
                                {fullName || "Sin nombre"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div className="d-flex align-items-center text-muted">
                            <Mail
                              size={16}
                              className="me-2"
                              style={{ color: kairosTheme.info }}
                            />
                            {u.correo}
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <Badge key={`badge-${u.idUsuario}-${u.idRol}`}>
                            {roleName}
                          </Badge>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <small className="text-muted">
                            {formatDateTime(u.fechaRegistro)}
                          </small>
                        </td>
                        <td style={{ padding: "1rem" }} className="text-center">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: u.estatus
                                ? `${kairosTheme.success}15`
                                : `${kairosTheme.danger}15`,
                              color: u.estatus
                                ? kairosTheme.success
                                : kairosTheme.danger,
                            }}
                          >
                            {u.estatus ? (
                              <>
                                <CheckCircle size={16} /> Activo
                              </>
                            ) : (
                              <>
                                <XCircle size={16} /> Inactivo
                              </>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: "1rem" }} className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(u.idUsuario)}
                              disabled={!!confirmingId || isLoading}
                              className="btn-action"
                              style={{
                                backgroundColor: kairosTheme.info,
                                color: kairosTheme.white,
                              }}
                              title="Editar usuario"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleToggleEstatus(u.idUsuario)}
                              disabled={!!confirmingId || isLoading}
                              className="btn-action"
                              style={{
                                backgroundColor: u.estatus
                                  ? kairosTheme.warning
                                  : kairosTheme.success,
                                color: kairosTheme.white,
                              }}
                              title={u.estatus ? "Desactivar" : "Activar"}
                            >
                              {u.estatus ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setConfirmingId(u.idUsuario)}
                              disabled={!!confirmingId || isLoading}
                              className="btn-action"
                              style={{
                                backgroundColor: kairosTheme.danger,
                                color: kairosTheme.white,
                              }}
                              title="Eliminar usuario"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
          {filteredUsers.length > 0 && (
            <Card.Footer
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: kairosTheme.light,
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <small className="text-muted fw-semibold">
                Mostrando {filteredUsers.length} de {currentUsers.length}{" "}
                usuarios
              </small>
              <small className="text-muted">
                {searchTerm && (
                  <span className="me-3">
                    <Search size={14} className="me-1" />
                    Búsqueda activa
                  </span>
                )}
                {filterRole !== "all" && (
                  <span>
                    <Filter size={14} className="me-1" />
                    Filtro aplicado
                  </span>
                )}
              </small>
            </Card.Footer>
          )}
        </Card>
      </Container>
    </Container>
  );
};

const Usuarios = () => {
  return (
    <UserState>
      <RoleState>
        <UsuariosContent />
      </RoleState>
    </UserState>
  );
};

export default Usuarios;
