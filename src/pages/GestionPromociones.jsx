import React, { useState, useContext, useEffect } from "react";
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
  Tag,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  X,
  CheckCircle,
  XCircle,
  Hash,
  Save,
  Search,
  Filter,
  MapPin,
  Building,
  RefreshCw,
} from "lucide-react";

// Importar Contextos de Promociones
import PromocionesContext from "../Context/Promociones/PromocionesContext";
import PromocionesState from "../Context/Promociones/PromocionesState";

// IMPORTANTE: Importar Contextos de Lugares y Socios
import LugaresContext from "../Context/Lugares/LugaresContext";
import LugaresState from "../Context/Lugares/LugaresState";
import SociosAfiliadosContext from "../Context/SociosAfiliados/SociosAfiliadosContext";
import SociosAfiliadosState from "../Context/SociosAfiliados/SociosAfiliadosState";

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
    info: <Tag size={20} />,
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

const PromocionModal = ({
  show,
  handleClose,
  savePromocion,
  promocion,
  loading,
  lugares, // Recibimos la lista de lugares
  socios, // Recibimos la lista de socios
}) => {
  const isEditing = promocion !== null;

  const initialFormData = {
    titulo: "",
    descripcion: "",
    idLugar: "",
    idSocio: "",
    fechaInicio: "",
    fechaFin: "",
    estatus: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (promocion && show) {
      setFormData({
        idPromocion: promocion.idPromocion,
        titulo: promocion.titulo || "",
        descripcion: promocion.descripcion || "",
        idLugar: promocion.idLugar || "",
        idSocio: promocion.idSocio || "",
        fechaInicio: promocion.fechaInicio
          ? promocion.fechaInicio.split("T")[0]
          : "",
        fechaFin: promocion.fechaFin ? promocion.fechaFin.split("T")[0] : "",
        estatus: promocion.estatus ?? true,
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [promocion, show]);

  const validateForm = () => {
    const errors = {};

    if (!formData.titulo.trim()) {
      errors.titulo = "El título es requerido";
    }

    if (!formData.idLugar) {
      errors.idLugar = "Debe seleccionar un lugar";
    }

    if (!formData.fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es requerida";
    }

    if (!formData.fechaFin) {
      errors.fechaFin = "La fecha de fin es requerida";
    } else if (formData.fechaInicio && formData.fechaFin) {
      const startDate = new Date(formData.fechaInicio);
      const endDate = new Date(formData.fechaFin);
      if (endDate <= startDate) {
        errors.fechaFin =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      ...formData,
      idLugar: parseInt(formData.idLugar),
      // Si el idSocio es cadena vacía, enviamos null, si no, el entero
      idSocio: formData.idSocio ? parseInt(formData.idSocio) : null,
    };

    savePromocion(dataToSend, isEditing);
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
              Editar Promoción
            </>
          ) : (
            <>
              <Plus className="me-2" style={{ color: kairosTheme.primary }} />
              Nueva Promoción
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label className="fw-semibold">
                <Tag size={16} className="me-1" /> Título *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el título de la promoción"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                isInvalid={!!formErrors.titulo}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.titulo}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Building size={16} className="me-1" /> Descripción
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe la promoción..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={{ borderRadius: "8px", padding: "0.625rem" }}
            />
          </Form.Group>

          <Row className="mb-3">
            {/* SELECT PARA LUGARES */}
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <MapPin size={16} className="me-1" /> Lugar *
              </Form.Label>
              <Form.Select
                name="idLugar"
                value={formData.idLugar}
                onChange={handleChange}
                isInvalid={!!formErrors.idLugar}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              >
                <option value="">Seleccione un lugar...</option>
                {lugares.map((lugar) => (
                  <option key={`lugar-${lugar.idLugar}`} value={lugar.idLugar}>
                    {lugar.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.idLugar}
              </Form.Control.Feedback>
            </Form.Group>

            {/* SELECT PARA SOCIOS */}
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Building size={16} className="me-1" /> Socio Afiliado
              </Form.Label>
              <Form.Select
                name="idSocio"
                value={formData.idSocio}
                onChange={handleChange}
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              >
                <option value="">Ninguno (Opcional)</option>
                {socios.map((socio) => (
                  <option key={`socio-${socio.idSocio}`} value={socio.idSocio}>
                    {socio.nombreSocio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Calendar size={16} className="me-1" /> Fecha Inicio *
              </Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                isInvalid={!!formErrors.fechaInicio}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fechaInicio}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Calendar size={16} className="me-1" /> Fecha Fin *
              </Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                isInvalid={!!formErrors.fechaFin}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fechaFin}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="estatus"
              id="estatus-switch"
              label={
                <span className="d-flex align-items-center fw-semibold">
                  <Tag
                    size={18}
                    className="me-2"
                    style={{
                      color: formData.estatus
                        ? kairosTheme.success
                        : kairosTheme.danger,
                    }}
                  />
                  {formData.estatus ? "Promoción Activa" : "Promoción Inactiva"}
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
          {isEditing ? "Guardar Cambios" : "Crear Promoción"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionPromocionesContent = () => {
  const {
    promociones = [],
    getPromociones,
    createPromocion,
    updatePromocion,
    deletePromocion,
  } = useContext(PromocionesContext);

  // Consumimos los contextos de Lugares y Socios
  const { lugares = [], getLugares } = useContext(LugaresContext);
  const { socios = [], getSocios } = useContext(SociosAfiliadosContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [promocionToEdit, setPromocionToEdit] = useState(null);
  const [loading, setLoading] = useState({
    promociones: false,
    action: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.promociones) return;

    setLoading((prev) => ({ ...prev, promociones: true }));
    setError(null);

    try {
      console.log("Iniciando carga de datos...");
      // Ejecutamos las 3 peticiones en paralelo para que sea más rápido
      await Promise.all([getPromociones(), getLugares(), getSocios()]);

      console.log("Carga de datos completada");
      setDataLoaded(true);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError(
        "Hubo un problema al conectar con el servidor. Verifica que la API esté activa."
      );
      showMessage("Error al cargar los datos", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, promociones: false }));
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRefresh = () => {
    console.log("🔄 Recargando datos manualmente...");
    loadAllData();
  };

  const handleCreate = () => {
    setPromocionToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const promocion = promociones.find((p) => p.idPromocion === id);
    if (promocion) {
      setPromocionToEdit(promocion);
      setShowModal(true);
    } else {
      showMessage("Promoción no encontrada para editar", "danger");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPromocionToEdit(null);
  };

  const savePromocion = async (promocionData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updatePromocion(promocionData.idPromocion, promocionData);
        showMessage(`Promoción actualizada exitosamente`, "success");
      } else {
        await createPromocion(promocionData);
        showMessage(`Promoción creada exitosamente`, "success");
      }
      handleCloseModal();
      await getPromociones(); // Recargar solo la lista de promociones
    } catch (error) {
      showMessage(
        `Error al ${isEditing ? "actualizar" : "crear"} promoción: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la operación de promoción:", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deletePromocion(idToDelete);
      showMessage(`Promoción eliminada exitosamente`, "success");
      await getPromociones(); // Recargar solo la lista de promociones
    } catch (error) {
      showMessage(
        `Error al eliminar promoción: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la eliminación:", error);
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "Fecha Inválida";

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha Inválida";
    }
  };

  // Función auxiliar para obtener nombre del lugar por ID
  const getNombreLugar = (id) => {
    const lugar = lugares.find((l) => l.idLugar === id);
    return lugar ? lugar.nombre : `ID: ${id}`;
  };

  // Función auxiliar para obtener nombre del socio por ID
  const getNombreSocio = (id) => {
    if (!id) return "No asignado";
    const socio = socios.find((s) => s.idSocio === id);
    return socio ? socio.nombreSocio : `ID: ${id}`;
  };

  const currentPromociones = Array.isArray(promociones) ? promociones : [];

  const filteredPromociones = currentPromociones.filter((promocion) => {
    const titulo = (promocion.titulo || "").toLowerCase();
    const descripcion = (promocion.descripcion || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      titulo.includes(search) || descripcion.includes(search);
    const matchesEstatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && promocion.estatus) ||
      (filterEstatus === "inactive" && !promocion.estatus);

    return matchesSearch && matchesEstatus;
  });

  const isLoading = loading.promociones && !dataLoaded;

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

      <PromocionModal
        show={showModal}
        handleClose={handleCloseModal}
        savePromocion={savePromocion}
        promocion={promocionToEdit}
        loading={loading.action}
        lugares={lugares}
        socios={socios}
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
                <Tag size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Promociones
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra las promociones del sistema de forma eficiente
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.promociones}
                  style={{
                    backgroundColor: kairosTheme.info,
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                  }}
                  className="btn-action"
                >
                  <RefreshCw className="me-2" size={20} />
                  {loading.promociones ? "Cargando..." : "Recargar"}
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading.promociones}
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
                  <Plus className="me-2" size={20} />
                  Nueva Promoción
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>Error de conexión</Alert.Heading>
            {error}
            <div className="mt-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleRefresh}
              >
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

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
                  <p className="text-muted mb-1 fw-semibold">
                    Total Promociones
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.promociones ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentPromociones.length
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
                  <Tag size={32} style={{ color: kairosTheme.primary }} />
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
                    Promociones Activas
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.promociones ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentPromociones.filter((p) => p.estatus).length
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
                    Promociones Inactivas
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.promociones ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentPromociones.filter((p) => !p.estatus).length
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
                    placeholder="Buscar por título o descripción..."
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
                    value={filterEstatus}
                    onChange={(e) => setFilterEstatus(e.target.value)}
                    style={{
                      border: "2px solid #e0e0e0",
                      borderLeft: "none",
                      borderRadius: "0 10px 10px 0",
                      padding: "0.625rem 1rem",
                    }}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Solo activas</option>
                    <option value="inactive">Solo inactivas</option>
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
                    ¿Estás seguro de eliminar la promoción ID:{" "}
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
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: kairosTheme.primary }}
                  className="mb-3"
                />
                <p className="text-muted">Cargando promociones...</p>
                <small className="text-muted">
                  Si tarda mucho, verifica la conexión con el servidor
                </small>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <XCircle
                  size={64}
                  style={{ color: kairosTheme.danger, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-danger">Error al cargar promociones</h5>
                <p className="text-muted">{error}</p>
                <Button variant="primary" onClick={handleRefresh}>
                  <RefreshCw className="me-2" size={16} />
                  Reintentar
                </Button>
              </div>
            ) : filteredPromociones.length === 0 ? (
              <div className="text-center py-5">
                <Tag
                  size={64}
                  style={{ color: kairosTheme.secondary, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-muted">No se encontraron promociones</h5>
                <p className="text-muted">
                  {searchTerm || filterEstatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando una nueva promoción"}
                </p>
                <Button variant="primary" onClick={handleCreate}>
                  <Plus className="me-2" size={16} />
                  Crear Primera Promoción
                </Button>
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
                      <Tag size={16} className="me-1" /> Título
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Building size={16} className="me-1" /> Descripción
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <MapPin size={16} className="me-1" /> Lugar
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Building size={16} className="me-1" /> Socio
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Calendar size={16} className="me-1" /> Vigencia
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                      className="text-center"
                    >
                      Estado
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
                  {filteredPromociones.map((p) => (
                    <tr
                      key={`promocion-${p.idPromocion}`}
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
                          #{p.idPromocion}
                        </Badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="fw-bold">
                          {p.titulo || "Sin título"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="text-muted">
                          {p.descripcion
                            ? p.descripcion.length > 50
                              ? `${p.descripcion.substring(0, 50)}...`
                              : p.descripcion
                            : "Sin descripción"}
                        </div>
                      </td>
                      {/* COLUMNA LUGAR: Mostramos el nombre del lugar en vez del ID */}
                      <td style={{ padding: "1rem" }}>
                        <Badge bg="secondary" title={`ID: ${p.idLugar}`}>
                          {getNombreLugar(p.idLugar)}
                        </Badge>
                      </td>
                      {/* COLUMNA SOCIO: Mostramos el nombre del socio */}
                      <td style={{ padding: "1rem" }}>
                        {p.idSocio ? (
                          <Badge bg="info" title={`ID: ${p.idSocio}`}>
                            {getNombreSocio(p.idSocio)}
                          </Badge>
                        ) : (
                          <span className="text-muted">No asignado</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="d-flex align-items-center">
                          <Clock className="me-2 text-warning" size={16} />
                          <div>
                            <div className="small text-muted">Inicio:</div>
                            <div>{formatDateTime(p.fechaInicio)}</div>
                          </div>
                          <div className="mx-3 text-secondary">-</div>
                          <div>
                            <div className="small text-muted">Fin:</div>
                            <div>{formatDateTime(p.fechaFin)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: p.estatus
                              ? `${kairosTheme.success}15`
                              : `${kairosTheme.danger}15`,
                            color: p.estatus
                              ? kairosTheme.success
                              : kairosTheme.danger,
                          }}
                        >
                          {p.estatus ? (
                            <>
                              <CheckCircle size={16} /> Activa
                            </>
                          ) : (
                            <>
                              <XCircle size={16} /> Inactiva
                            </>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(p.idPromocion)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.info,
                              color: kairosTheme.white,
                            }}
                            title="Editar promoción"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setConfirmingId(p.idPromocion)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.danger,
                              color: kairosTheme.white,
                            }}
                            title="Eliminar promoción"
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
          {filteredPromociones.length > 0 && (
            <Card.Footer
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: kairosTheme.light,
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <small className="text-muted fw-semibold">
                Mostrando {filteredPromociones.length} de{" "}
                {currentPromociones.length} promociones
              </small>
              <small className="text-muted">
                {searchTerm && (
                  <span className="me-3">
                    <Search size={14} className="me-1" />
                    Búsqueda activa
                  </span>
                )}
                {filterEstatus !== "all" && (
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

// IMPORTANTE: Anidamos los 3 States para que toda la aplicación tenga acceso
const GestionPromociones = () => {
  return (
    <PromocionesState>
      <LugaresState>
        <SociosAfiliadosState>
          <GestionPromocionesContent />
        </SociosAfiliadosState>
      </LugaresState>
    </PromocionesState>
  );
};

export default GestionPromociones;
