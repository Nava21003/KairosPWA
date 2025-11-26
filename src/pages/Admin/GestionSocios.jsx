import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  createContext,
} from "react";
import axios from "axios";
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
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Hash,
  Save,
  Search,
  Filter,
  RefreshCw,
  Power,
  Briefcase,
  DollarSign,
  Users,
} from "lucide-react";

const SociosAfiliadosContext = createContext();

const GET_SOCIOS = "GET_SOCIOS";
const CREATE_SOCIO = "CREATE_SOCIO";
const UPDATE_SOCIO = "UPDATE_SOCIO";
const DELETE_SOCIO = "DELETE_SOCIO";

const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const SociosAfiliadosReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_SOCIOS: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        socios: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    case CREATE_SOCIO: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        socios: [...state.socios, dataToUse],
      };
    }
    case UPDATE_SOCIO: {
      const dataToUse = extractData(payload);
      if (!dataToUse) return state;

      return {
        ...state,
        socios: state.socios.map((socio) =>
          socio.idSocio === dataToUse.idSocio ? dataToUse : socio
        ),
      };
    }
    case DELETE_SOCIO: {
      const idToDelete = payload;
      return {
        ...state,
        socios: state.socios.filter((socio) => socio.idSocio !== idToDelete),
      };
    }
    default:
      return state;
  }
};

const API_SOCIOS_URL = "http://localhost:5219/api/SociosAfiliados";

const SociosAfiliadosState = ({ children }) => {
  const initialState = {
    socios: [],
    selectedSocio: null,
  };

  const [state, dispatch] = useReducer(SociosAfiliadosReducer, initialState);

  const getSocios = async () => {
    try {
      const res = await axios.get(API_SOCIOS_URL);
      dispatch({ type: GET_SOCIOS, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error al obtener socios:", error);
      throw error;
    }
  };

  const createSocio = async (socioData) => {
    try {
      const response = await axios.post(API_SOCIOS_URL, socioData);
      dispatch({ type: CREATE_SOCIO, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error al crear socio:", error);
      throw error;
    }
  };

  const updateSocio = async (id, socioData) => {
    try {
      const dataToSend = { ...socioData, idSocio: id };
      const res = await axios.put(`${API_SOCIOS_URL}/${id}`, dataToSend);
      dispatch({
        type: UPDATE_SOCIO,
        payload: res.data || dataToSend,
      });
      return res.data;
    } catch (error) {
      console.error("Error al actualizar socio:", error);
      throw error;
    }
  };

  const deleteSocio = async (id) => {
    try {
      await axios.delete(`${API_SOCIOS_URL}/${id}`);
      dispatch({ type: DELETE_SOCIO, payload: id });
    } catch (error) {
      console.error("Error al eliminar socio:", error);
      throw error;
    }
  };

  return (
    <SociosAfiliadosContext.Provider
      value={{
        socios: state.socios,
        getSocios,
        createSocio,
        updateSocio,
        deleteSocio,
      }}
    >
      {children}
    </SociosAfiliadosContext.Provider>
  );
};

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount || 0);
};

const MessageBox = ({ message }) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle size={20} />,
    danger: <XCircle size={20} />,
    info: <Briefcase size={20} />,
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

const SocioModal = ({ show, handleClose, saveSocio, socio, loading }) => {
  const isEditing = socio !== null;

  const initialFormData = {
    nombreSocio: "",
    tarifaCpc: 0,
    estatus: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (socio && show) {
      setFormData({
        idSocio: socio.idSocio,
        nombreSocio: socio.nombreSocio || "",
        tarifaCpc: socio.tarifaCpc || 0,
        estatus: socio.estatus ?? true,
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [socio, show]);

  const validateForm = () => {
    const errors = {};
    if (!formData.nombreSocio.trim()) {
      errors.nombreSocio = "El nombre del socio es requerido";
    }
    if (formData.tarifaCpc < 0) {
      errors.tarifaCpc = "La tarifa no puede ser negativa";
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
    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      tarifaCpc: parseFloat(formData.tarifaCpc),
    };
    saveSocio(dataToSend, isEditing);
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
              Editar Socio
            </>
          ) : (
            <>
              <Plus className="me-2" style={{ color: kairosTheme.primary }} />
              Nuevo Socio
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label className="fw-semibold">
                <Briefcase size={16} className="me-1" /> Nombre del Socio *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. FoodiePlus, ArtPromo..."
                name="nombreSocio"
                value={formData.nombreSocio}
                onChange={handleChange}
                isInvalid={!!formErrors.nombreSocio}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombreSocio}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <DollarSign size={16} className="me-1" /> Tarifa CPC (Costo por
              Clic)
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                name="tarifaCpc"
                value={formData.tarifaCpc}
                onChange={handleChange}
                isInvalid={!!formErrors.tarifaCpc}
                style={{ borderRadius: "0 8px 8px 0", padding: "0.625rem" }}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid" className="d-block">
              {formErrors.tarifaCpc}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="estatus"
              id="estatus-switch"
              label={
                <span className="d-flex align-items-center fw-semibold">
                  <Briefcase
                    size={18}
                    className="me-2"
                    style={{
                      color: formData.estatus
                        ? kairosTheme.success
                        : kairosTheme.danger,
                    }}
                  />
                  {formData.estatus ? "Socio Activo" : "Socio Inactivo"}
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
          {isEditing ? "Guardar Cambios" : "Crear Socio"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionSociosContent = () => {
  const {
    socios = [],
    getSocios,
    createSocio,
    updateSocio,
    deleteSocio,
  } = useContext(SociosAfiliadosContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [socioToEdit, setSocioToEdit] = useState(null);
  const [loading, setLoading] = useState({ socios: false, action: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.socios) return;
    setLoading((prev) => ({ ...prev, socios: true }));
    setError(null);
    try {
      await getSocios();
      setDataLoaded(true);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Verifica que la API esté activa.");
      showMessage("Error al cargar los datos", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, socios: false }));
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
    loadAllData();
  };

  const handleCreate = () => {
    setSocioToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const socio = socios.find((s) => s.idSocio === id);
    if (socio) {
      setSocioToEdit(socio);
      setShowModal(true);
    } else {
      showMessage("Socio no encontrado", "danger");
    }
  };

  const handleToggleStatus = async (socio) => {
    if (loading.action) return;

    const nuevoEstatus = !socio.estatus;
    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const socioLimpio = {
        idSocio: socio.idSocio,
        nombreSocio: socio.nombreSocio,
        tarifaCpc: socio.tarifaCpc,
        estatus: nuevoEstatus,
      };

      await updateSocio(socio.idSocio, socioLimpio);
      showMessage(
        `Socio ${nuevoEstatus ? "activado" : "desactivado"} correctamente`,
        "success"
      );
      await getSocios();
    } catch (error) {
      showMessage(`Error al cambiar estatus: ${error.message}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSocioToEdit(null);
  };

  const saveSocio = async (socioData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateSocio(socioData.idSocio, socioData);
        showMessage(`Socio actualizado exitosamente`, "success");
      } else {
        await createSocio(socioData);
        showMessage(`Socio creado exitosamente`, "success");
      }
      handleCloseModal();
    } catch (error) {
      showMessage(`Error en la operación: ${error.message}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteSocio(idToDelete);
      showMessage(`Socio eliminado exitosamente`, "success");
      await getSocios();
    } catch (error) {
      showMessage(`Error al eliminar socio: ${error.message}`, "danger");
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentSocios = Array.isArray(socios) ? socios : [];
  const filteredSocios = currentSocios.filter((socio) => {
    const nombre = (socio.nombreSocio || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(search);
    const matchesEstatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && socio.estatus) ||
      (filterEstatus === "inactive" && !socio.estatus);
    return matchesSearch && matchesEstatus;
  });

  const isLoading = loading.socios && !dataLoaded;

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
        .status-badge { padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.5rem; }
        .search-input:focus { border-color: ${kairosTheme.primary}; box-shadow: 0 0 0 0.25rem rgba(78, 204, 163, 0.25); }
        .stat-card { border-left: 4px solid ${kairosTheme.primary}; transition: all 0.3s ease; }
        .stat-card:hover { border-left-width: 6px; }
      `}</style>

      <SocioModal
        show={showModal}
        handleClose={handleCloseModal}
        saveSocio={saveSocio}
        socio={socioToEdit}
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
                    Gestión de Socios Afiliados
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra los socios comerciales y sus tarifas CPC
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.socios}
                  style={{
                    backgroundColor: kairosTheme.info,
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                  }}
                  className="btn-action"
                >
                  <RefreshCw className="me-2" size={20} />{" "}
                  {loading.socios ? "Cargando..." : "Recargar"}
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading.socios}
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
                  <Plus className="me-2" size={20} /> Nuevo Socio
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
                  <p className="text-muted mb-1 fw-semibold">Total Socios</p>
                  <h3 className="mb-0 fw-bold">
                    {loading.socios ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentSocios.length
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
                  <p className="text-muted mb-1 fw-semibold">Socios Activos</p>
                  <h3 className="mb-0 fw-bold">
                    {loading.socios ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentSocios.filter((s) => s.estatus).length
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
                    Socios Inactivos
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.socios ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentSocios.filter((s) => !s.estatus).length
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
                    placeholder="Buscar por nombre del socio..."
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
                    <option value="active">Solo activos</option>
                    <option value="inactive">Solo inactivos</option>
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
                    ¿Estás seguro de eliminar el socio ID: <b>{confirmingId}</b>
                    ? Esta acción no se puede deshacer.
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
                <p className="text-muted">Cargando socios...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <XCircle
                  size={64}
                  style={{ color: kairosTheme.danger, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-danger">Error al cargar socios</h5>
                <p className="text-muted">{error}</p>
                <Button variant="primary" onClick={handleRefresh}>
                  <RefreshCw className="me-2" size={16} /> Reintentar
                </Button>
              </div>
            ) : filteredSocios.length === 0 ? (
              <div className="text-center py-5">
                <Users
                  size={64}
                  style={{ color: kairosTheme.secondary, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-muted">No se encontraron socios</h5>
                <p className="text-muted">
                  {searchTerm || filterEstatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando un nuevo socio afiliado"}
                </p>
                <Button variant="primary" onClick={handleCreate}>
                  <Plus className="me-2" size={16} /> Crear Primer Socio
                </Button>
              </div>
            ) : (
              <Table
                className="align-middle mb-0"
                style={{ minWidth: "800px" }}
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
                      <Briefcase size={16} className="me-1" /> Nombre
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <DollarSign size={16} className="me-1" /> Tarifa CPC
                    </th>
                    <th
                      className="text-center"
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      Estado
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
                  {filteredSocios.map((s) => (
                    <tr key={`socio-${s.idSocio}`} className="table-row-hover">
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
                          #{s.idSocio}
                        </Badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="fw-bold">
                          {s.nombreSocio || "Sin nombre"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="fw-semibold text-dark">
                          {formatCurrency(s.tarifaCpc)}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: s.estatus
                              ? `${kairosTheme.success}15`
                              : `${kairosTheme.danger}15`,
                            color: s.estatus
                              ? kairosTheme.success
                              : kairosTheme.danger,
                          }}
                        >
                          {s.estatus ? (
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
                            onClick={() => handleToggleStatus(s)}
                            disabled={loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: s.estatus
                                ? kairosTheme.white
                                : kairosTheme.success,
                              borderColor: s.estatus
                                ? kairosTheme.secondary
                                : kairosTheme.success,
                              color: s.estatus
                                ? kairosTheme.secondary
                                : kairosTheme.white,
                            }}
                            title={
                              s.estatus ? "Desactivar socio" : "Activar socio"
                            }
                          >
                            <Power size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEdit(s.idSocio)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.info,
                              color: kairosTheme.white,
                            }}
                            title="Editar socio"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setConfirmingId(s.idSocio)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.danger,
                              color: kairosTheme.white,
                            }}
                            title="Eliminar socio"
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
          {filteredSocios.length > 0 && (
            <Card.Footer
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: kairosTheme.light,
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <small className="text-muted fw-semibold">
                Mostrando {filteredSocios.length} de {currentSocios.length}{" "}
                socios
              </small>
              <small className="text-muted">
                {searchTerm && (
                  <span className="me-3">
                    <Search size={14} className="me-1" /> Búsqueda activa
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

const GestionSocios = () => {
  return (
    <SociosAfiliadosState>
      <GestionSociosContent />
    </SociosAfiliadosState>
  );
};

export default GestionSocios;
