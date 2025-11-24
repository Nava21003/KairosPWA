import React, { useState, useContext, useEffect, useCallback } from "react";
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
  Pencil,
  Trash2,
  X,
  Hash,
  Save,
  Zap,
  Search,
} from "lucide-react";
import RoleContext from "../../Context/Roles/RoleContext";
import RoleState from "../../Context/Roles/RoleState";

const kairosTheme = {
  primary: "#4ecca3",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#e74c3c",
  info: "#3498db",
  light: "#f8f9fa",
  dark: "#2c3e50",
  white: "#ffffff",
  bodyBg: "#f4f6f9",
};

const MessageBox = ({ message }) => {
  if (!message) return null;

  const iconMap = {
    success: <Zap size={20} />,
    danger: <X size={20} />,
    info: <Zap size={20} />,
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

const RoleModal = ({ show, handleClose, saveRole, role, loading }) => {
  const isEditing = role && role.idRol;

  const initialFormData = {
    nombreRol: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (role && show) {
      setFormData({
        idRol: role.idRol,
        nombreRol: role.nombreRol || "",
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [role, show]);

  const validateForm = () => {
    const errors = {};

    if (!formData.nombreRol.trim()) {
      errors.nombreRol = "El nombre del rol es requerido";
    } else if (formData.nombreRol.length < 2) {
      errors.nombreRol = "Debe tener al menos 2 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const dataToSend = { nombreRol: formData.nombreRol };

    if (isEditing) {
      dataToSend.idRol = formData.idRol;
    }

    saveRole(dataToSend, isEditing);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
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
              Editar Rol: {role?.nombreRol}
            </>
          ) : (
            <>
              <Zap className="me-2" style={{ color: kairosTheme.primary }} />
              Crear Nuevo Rol
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Zap size={16} className="me-1" /> Nombre del Rol *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Administrador, Lector, Editor"
              name="nombreRol"
              value={formData.nombreRol}
              onChange={handleChange}
              isInvalid={!!formErrors.nombreRol}
              required
              style={{ borderRadius: "8px", padding: "0.625rem" }}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.nombreRol}
            </Form.Control.Feedback>
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
          {isEditing ? "Guardar Cambios" : "Crear Rol"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const RolesContent = () => {
  const {
    roles = [],
    getRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useContext(RoleContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [loading, setLoading] = useState({
    roles: false,
    action: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const memoizedGetRoles = useCallback(async () => {
    if (loading.roles) return;

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
    memoizedGetRoles();
  }, []);

  const handleCreate = () => {
    setRoleToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const role = currentRoles.find((r) => r.idRol === id);
    if (role) {
      setRoleToEdit(role);
      setShowModal(true);
    } else {
      showMessage("Rol no encontrado para editar", "danger");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRoleToEdit(null);
  };

  const saveRole = async (roleData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateRole(roleData.idRol, { nombreRol: roleData.nombreRol });
        showMessage(
          `Rol "${roleData.nombreRol}" actualizado exitosamente`,
          "success"
        );
      } else {
        await createRole({ nombreRol: roleData.nombreRol });
        showMessage(
          `Rol "${roleData.nombreRol}" creado exitosamente`,
          "success"
        );
      }
      handleCloseModal();
      await memoizedGetRoles();
    } catch (error) {
      showMessage(
        `Error al ${isEditing ? "actualizar" : "crear"} rol: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la operación de rol:", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    const roleToDelete = currentRoles.find((r) => r.idRol === idToDelete);

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteRole(idToDelete);
      showMessage(
        `Rol "${roleToDelete?.nombreRol}" eliminado exitosamente`,
        "success"
      );
      await memoizedGetRoles();
    } catch (error) {
      // Manejar específicamente el error de constraint
      if (
        error.message?.includes("REFERENCE constraint") ||
        error.message?.includes("FK__Usuarios__idRol") ||
        error.response?.data?.includes("REFERENCE")
      ) {
        showMessage(
          `No se puede eliminar el rol "${roleToDelete?.nombreRol}" porque está asignado a uno o más usuarios. Primero cambie el rol de esos usuarios.`,
          "danger"
        );
      } else {
        showMessage(
          `Error al eliminar rol: ${error.message || "Error desconocido"}`,
          "danger"
        );
      }
      console.error("Error en la eliminación:", error);
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentRoles = Array.isArray(roles) ? roles : [];

  const filteredRoles = currentRoles.filter((role) => {
    const name = (role.nombreRol || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });

  const isLoading = loading.roles || loading.action;

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
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
        .table-row-hover { transition: all 0.2s ease; }
        .table-row-hover:hover { background-color: rgba(78, 204, 163, 0.08) !important; }
        .btn-action { transition: all 0.2s ease; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .search-input:focus { border-color: ${kairosTheme.primary}; box-shadow: 0 0 0 0.25rem rgba(78, 204, 163, 0.25); }
        .stat-card { border-left: 4px solid ${kairosTheme.primary}; transition: all 0.3s ease; }
        .stat-card:hover { border-left-width: 6px; }
      `}</style>

      <RoleModal
        show={showModal}
        handleClose={handleCloseModal}
        saveRole={saveRole}
        role={roleToEdit}
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
                    Gestión de Roles
                  </h1>
                  <p className="mb-0 opacity-90">
                    Define los roles de acceso para los usuarios del sistema.
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
                <Zap className="me-2" size={20} />
                Nuevo Rol
              </Button>
            </Col>
          </Row>
        </div>

        {isLoading && (
          <Alert variant="info" className="mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando datos...
          </Alert>
        )}

        <Row className="mb-4 g-3">
          <Col md={12}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                animation: "fadeIn 0.6s ease-out",
                borderLeftColor: kairosTheme.info,
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Total Roles</p>
                  <h3 className="mb-0 fw-bold">
                    {loading.roles ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentRoles.length
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
        </Row>

        <Card
          className="border-0 shadow-sm mb-4 card-hover"
          style={{ borderRadius: "12px", animation: "fadeIn 0.9s ease-out" }}
        >
          <Card.Body>
            <Row className="g-3">
              <Col md={12}>
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
                    placeholder="Buscar por nombre de rol..."
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
                <X
                  size={32}
                  style={{ color: kairosTheme.danger }}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1 fw-bold">Confirmar Eliminación de Rol</h5>
                  <p className="mb-0 text-muted">
                    ¿Estás seguro de eliminar este rol? Esta acción no se puede
                    deshacer.
                  </p>
                  <p className="mb-0 text-warning small mt-2">
                    <strong>Nota:</strong> No se puede eliminar un rol que esté
                    asignado a usuarios.
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
            {loading.roles ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: kairosTheme.primary }}
                  className="mb-3"
                />
                <p className="text-muted">Cargando roles...</p>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-5">
                <Users
                  size={64}
                  style={{ color: kairosTheme.secondary, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-muted">No se encontraron roles</h5>
                <p className="text-muted">
                  {searchTerm
                    ? "Intenta borrar el filtro de búsqueda"
                    : "Comienza agregando un nuevo rol"}
                </p>
              </div>
            ) : (
              <Table
                className="align-middle mb-0"
                hover
                style={{ minWidth: "600px" }}
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
                      <Zap size={16} className="me-1" /> Nombre del Rol
                    </th>
                    <th
                      className="text-center"
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((r) => (
                    <tr key={`role-${r.idRol}`} className="table-row-hover">
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
                          #{r.idRol}
                        </Badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="fw-bold">
                          {r.nombreRol || "Sin nombre"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(r.idRol)}
                            disabled={!!confirmingId || isLoading}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.info,
                              color: kairosTheme.white,
                            }}
                            title="Editar rol"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setConfirmingId(r.idRol)}
                            disabled={!!confirmingId || isLoading}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.danger,
                              color: kairosTheme.white,
                            }}
                            title="Eliminar rol"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
          {filteredRoles.length > 0 && (
            <Card.Footer
              className="d-flex justify-content-end align-items-center"
              style={{
                backgroundColor: kairosTheme.light,
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <small className="text-muted fw-semibold">
                Mostrando {filteredRoles.length} de {currentRoles.length} roles
              </small>
            </Card.Footer>
          )}
        </Card>
      </Container>
    </Container>
  );
};

const Roles = () => {
  return (
    <RoleState>
      <RolesContent />
    </RoleState>
  );
};

export default Roles;
