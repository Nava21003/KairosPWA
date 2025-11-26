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
  Save,
  Search,
  RefreshCw,
  Heart,
  AlignLeft,
  FileText,
  Hash,
} from "lucide-react";

const InteresesContext = createContext();
const GET_INTERESES = "GET_INTERESES";
const CREATE_INTERES = "CREATE_INTERES";
const UPDATE_INTERES = "UPDATE_INTERES";
const DELETE_INTERES = "DELETE_INTERES";
const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const InteresesReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_INTERESES: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        intereses: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    case CREATE_INTERES: {
      return state;
    }
    case UPDATE_INTERES: {
      return state;
    }
    case DELETE_INTERES: {
      const idToDelete = payload;
      return {
        ...state,
        intereses: state.intereses.filter((i) => i.idInteres !== idToDelete),
      };
    }
    default:
      return state;
  }
};

const API_INTERESES_URL = "http://localhost:5219/api/Intereses";

const InteresesState = ({ children }) => {
  const initialState = {
    intereses: [],
  };

  const [state, dispatch] = useReducer(InteresesReducer, initialState);

  const getIntereses = async () => {
    try {
      const res = await axios.get(API_INTERESES_URL);
      dispatch({ type: GET_INTERESES, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error al obtener intereses:", error);
      throw error;
    }
  };

  const createInteres = async (interesData) => {
    try {
      const response = await axios.post(API_INTERESES_URL, interesData);
      dispatch({ type: CREATE_INTERES, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error al crear interés:", error);
      throw error;
    }
  };

  const updateInteres = async (id, interesData) => {
    try {
      const dataToSend = { ...interesData, idInteres: id };
      await axios.put(`${API_INTERESES_URL}/${id}`, dataToSend);
      dispatch({ type: UPDATE_INTERES, payload: dataToSend });
      return true;
    } catch (error) {
      console.error("Error al actualizar interés:", error);
      throw error;
    }
  };

  const deleteInteres = async (id) => {
    try {
      await axios.delete(`${API_INTERESES_URL}/${id}`);
      dispatch({ type: DELETE_INTERES, payload: id });
    } catch (error) {
      console.error("Error al eliminar interés:", error);
      throw error;
    }
  };

  return (
    <InteresesContext.Provider
      value={{
        intereses: state.intereses,
        getIntereses,
        createInteres,
        updateInteres,
        deleteInteres,
      }}
    >
      {children}
    </InteresesContext.Provider>
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

const MessageBox = ({ message }) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle size={20} />,
    danger: <XCircle size={20} />,
    info: <Heart size={20} />,
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

const InteresModal = ({ show, handleClose, saveInteres, interes, loading }) => {
  const isEditing = interes !== null;

  const initialFormData = {
    nombre: "",
    descripcion: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (interes && show) {
      setFormData({
        idInteres: interes.idInteres,
        nombre: interes.nombre || "",
        descripcion: interes.descripcion || "",
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [interes, show]);

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    saveInteres(formData, isEditing);
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
              <Pencil className="me-2" style={{ color: kairosTheme.info }} />{" "}
              Editar Interés
            </>
          ) : (
            <>
              <Plus className="me-2" style={{ color: kairosTheme.primary }} />{" "}
              Nuevo Interés
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label className="fw-semibold">
                <Heart size={16} className="me-1" /> Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Senderismo, Música, Tecnología"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                isInvalid={!!formErrors.nombre}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <AlignLeft size={16} className="me-1" /> Descripción
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Descripción detallada del interés..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: kairosTheme.light }}>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={loading}
          style={{ borderRadius: "8px" }}
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
            fontWeight: 600,
          }}
        >
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <Save className="me-2" size={16} />
          )}
          {isEditing ? "Guardar Cambios" : "Crear Interés"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionInteresesContent = () => {
  const {
    intereses = [],
    getIntereses,
    createInteres,
    updateInteres,
    deleteInteres,
  } = useContext(InteresesContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interesToEdit, setInteresToEdit] = useState(null);
  const [loading, setLoading] = useState({ data: false, action: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.data) return;
    setLoading((prev) => ({ ...prev, data: true }));
    setError(null);
    try {
      await getIntereses();
      setDataLoaded(true);
    } catch (error) {
      setError("Verifica que la API esté activa.");
      showMessage("Error al cargar los intereses", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRefresh = () => loadAllData();
  const handleCreate = () => {
    setInteresToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const item = intereses.find((i) => i.idInteres === id);
    if (item) {
      setInteresToEdit(item);
      setShowModal(true);
    } else {
      showMessage("Interés no encontrado", "danger");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInteresToEdit(null);
  };

  const saveInteres = async (interesData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateInteres(interesData.idInteres, interesData);
        showMessage("Interés actualizado exitosamente", "success");
      } else {
        await createInteres(interesData);
        showMessage("Interés creado exitosamente", "success");
      }
      handleCloseModal();
      await getIntereses();
    } catch (error) {
      showMessage(`Error: ${error.message}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteInteres(idToDelete);
      showMessage("Interés eliminado exitosamente", "success");
      await getIntereses();
    } catch (error) {
      showMessage("Error al eliminar interés", "danger");
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentIntereses = Array.isArray(intereses) ? intereses : [];
  const filteredIntereses = currentIntereses.filter((i) => {
    const nombre = (i.nombre || "").toLowerCase();
    const descripcion = (i.descripcion || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return nombre.includes(search) || descripcion.includes(search);
  });

  const isLoading = loading.data && !dataLoaded;
  const total = currentIntereses.length;
  const conDescripcion = currentIntereses.filter(
    (i) => i.descripcion && i.descripcion.length > 0
  ).length;
  const sinDescripcion = total - conDescripcion;

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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
        .table-row-hover { transition: all 0.2s ease; }
        .table-row-hover:hover { background-color: rgba(78, 204, 163, 0.08) !important; }
        .btn-action { transition: all 0.2s ease; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>

      <InteresModal
        show={showModal}
        handleClose={handleCloseModal}
        saveInteres={saveInteres}
        interes={interesToEdit}
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
                <Heart size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Intereses
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra las categorías de intereses y sus descripciones.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.data}
                  style={{
                    backgroundColor: kairosTheme.info,
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                  }}
                  className="btn-action"
                >
                  <RefreshCw className="me-2" size={20} /> Recargar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading.data}
                  style={{
                    backgroundColor: kairosTheme.white,
                    color: kairosTheme.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 700,
                  }}
                  className="btn-action"
                >
                  <Plus className="me-2" size={20} /> Nuevo Interés
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>Error de Conexión</Alert.Heading>
            {error}
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={handleRefresh}
            >
              Reintentar
            </Button>
          </Alert>
        )}

        {isLoading && (
          <Alert variant="info" className="mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Cargando intereses...
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
                  <p className="text-muted mb-1 fw-semibold">Total Intereses</p>
                  <h3 className="mb-0 fw-bold">{total}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.primary}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Hash size={32} style={{ color: kairosTheme.primary }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.info,
                animation: "fadeIn 0.7s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Con Descripción</p>
                  <h3 className="mb-0 fw-bold">{conDescripcion}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.info}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <FileText size={32} style={{ color: kairosTheme.info }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.warning,
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Sin Descripción</p>
                  <h3 className="mb-0 fw-bold">{sinDescripcion}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.warning}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <AlignLeft size={32} style={{ color: kairosTheme.warning }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card
          className="border-0 shadow-sm mb-4 card-hover"
          style={{ borderRadius: "12px" }}
        >
          <Card.Body>
            <Row className="g-3">
              <Col md={12}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <Search size={20} color={kairosTheme.primary} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <XCircle
                  size={32}
                  color={kairosTheme.danger}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1 fw-bold">Confirmar Eliminación</h5>
                  <p className="mb-0">
                    ¿Estás seguro de eliminar el interés ID:{" "}
                    <b>{confirmingId}</b>?
                  </p>
                </div>
              </div>
              <div>
                <Button
                  variant="danger"
                  onClick={executeDelete}
                  className="me-2"
                >
                  <Trash2 size={16} /> Eliminar
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setConfirmingId(null)}
                >
                  <X size={16} /> Cancelar
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        <Card
          className="border-0 shadow-sm"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <div className="table-responsive">
            <Table className="align-middle mb-0" style={{ minWidth: "800px" }}>
              <thead style={{ backgroundColor: kairosTheme.light }}>
                <tr>
                  <th className="p-3" style={{ width: "80px" }}>
                    ID
                  </th>
                  <th className="p-3" style={{ width: "250px" }}>
                    <div className="d-flex align-items-center">
                      <Heart size={16} className="me-2" /> Nombre
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="d-flex align-items-center">
                      <AlignLeft size={16} className="me-2" /> Descripción
                    </div>
                  </th>
                  <th className="p-3 text-center" style={{ width: "150px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredIntereses.map((item) => (
                  <tr key={item.idInteres} className="table-row-hover">
                    <td className="p-3">
                      <Badge bg="light" text="dark">
                        #{item.idInteres}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="fw-bold text-primary">{item.nombre}</div>
                    </td>
                    <td className="p-3">
                      <div style={{ color: "#666", whiteSpace: "pre-wrap" }}>
                        {item.descripcion || (
                          <span className="fst-italic text-muted">
                            - Sin descripción -
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(item.idInteres)}
                          className="btn-action"
                          style={{
                            backgroundColor: kairosTheme.info,
                            color: "white",
                          }}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setConfirmingId(item.idInteres)}
                          className="btn-action"
                          style={{
                            backgroundColor: kairosTheme.danger,
                            color: "white",
                          }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIntereses.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="4" className="text-center p-5 text-muted">
                      No se encontraron intereses registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
    </Container>
  );
};

const GestionIntereses = () => (
  <InteresesState>
    <GestionInteresesContent />
  </InteresesState>
);

export default GestionIntereses;
