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
  Row,
  Col,
  Spinner,
  Badge,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import {
  Bell,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  MessageSquare,
  Calendar,
  Eye,
  EyeOff,
  User,
  Users,
} from "lucide-react";

const NotificacionesContext = createContext();

const GET_NOTIFICACIONES_BY_USER = "GET_NOTIFICACIONES_BY_USER";
const DELETE_NOTIFICACION = "DELETE_NOTIFICACION";
const GET_USERS_LIST = "GET_USERS_LIST";

const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const NotificacionesReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_NOTIFICACIONES_BY_USER: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        notificaciones: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    case DELETE_NOTIFICACION: {
      const idToDelete = payload;
      return {
        ...state,
        notificaciones: state.notificaciones.filter(
          (n) => n.idNotificacion !== idToDelete
        ),
      };
    }
    case GET_USERS_LIST: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        users: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    default:
      return state;
  }
};

const API_NOTIFICACIONES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Notificaciones";
const API_USUARIOS_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Usuarios";

const NotificacionesState = ({ children }) => {
  const initialState = {
    notificaciones: [],
    users: [],
  };

  const [state, dispatch] = useReducer(NotificacionesReducer, initialState);

  const getNotificacionesByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_NOTIFICACIONES_URL}/${idUsuario}`);
      dispatch({ type: GET_NOTIFICACIONES_BY_USER, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      throw error;
    }
  };

  const deleteNotificacion = async (id) => {
    try {
      await axios.delete(`${API_NOTIFICACIONES_URL}/${id}`);
      dispatch({ type: DELETE_NOTIFICACION, payload: id });
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      throw error;
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(API_USUARIOS_URL);
      dispatch({ type: GET_USERS_LIST, payload: res.data });
    } catch (error) {
      console.error("Error al obtener lista de usuarios:", error);
    }
  };

  return (
    <NotificacionesContext.Provider
      value={{
        notificaciones: state.notificaciones,
        users: state.users,
        getNotificacionesByUsuario,
        deleteNotificacion,
        getUsers,
      }}
    >
      {children}
    </NotificacionesContext.Provider>
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
    info: <Bell size={20} />,
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

const GestionNotificacionesContent = () => {
  const {
    notificaciones = [],
    users = [],
    getNotificacionesByUsuario,
    deleteNotificacion,
    getUsers,
  } = useContext(NotificacionesContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [loading, setLoading] = useState({ data: false, action: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const init = async () => {
      await getUsers();
    };
    init();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !currentUserId) {
      setCurrentUserId(users[0].idUsuario);
    }
  }, [users, currentUserId]);

  const loadNotificaciones = async (userId) => {
    if (!userId) return;
    if (loading.data) return;

    setLoading((prev) => ({ ...prev, data: true }));
    setError(null);
    try {
      await getNotificacionesByUsuario(userId);
      setDataLoaded(true);
    } catch (error) {
      setError("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadNotificaciones(currentUserId);
    }
  }, [currentUserId]);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRefresh = () => {
    getUsers();
    if (currentUserId) loadNotificaciones(currentUserId);
  };

  const handleUserChange = (e) => {
    const val = parseInt(e.target.value);
    setCurrentUserId(val);
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteNotificacion(idToDelete);
      showMessage("Notificación eliminada", "success");
      loadNotificaciones(currentUserId);
    } catch (error) {
      showMessage("Error al eliminar", "danger");
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentNotificaciones = Array.isArray(notificaciones)
    ? notificaciones
    : [];

  const filteredData = currentNotificaciones.filter((n) => {
    const titulo = (n.titulo || "").toLowerCase();
    const mensaje = (n.mensaje || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return titulo.includes(search) || mensaje.includes(search);
  });

  const isLoading = loading.data && !dataLoaded;

  const total = currentNotificaciones.length;
  const noLeidas = currentNotificaciones.filter((n) => !n.leido).length;
  const leidas = total - noLeidas;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        .status-badge { padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.5rem; }
      `}</style>

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
            <Col md={7}>
              <div className="d-flex align-items-center text-white">
                <Bell size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Buzón de Notificaciones
                  </h1>
                  <p className="mb-0 opacity-90">
                    Visualiza el historial de alertas y mensajes enviados.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={5} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end align-items-center">
                <div
                  className="d-flex align-items-center bg-white rounded-3 px-3 py-2 shadow-sm"
                  style={{ minWidth: "250px", flex: 1 }}
                >
                  <Users size={18} className="me-2 text-muted" />
                  <span className="fw-bold text-muted me-2 small d-none d-lg-inline">
                    Usuario:
                  </span>
                  <Form.Select
                    value={currentUserId}
                    onChange={handleUserChange}
                    size="sm"
                    disabled={users.length === 0}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontWeight: "600",
                      color: kairosTheme.dark,
                      cursor: "pointer",
                      boxShadow: "none",
                    }}
                  >
                    {users.length === 0 && (
                      <option value="">Cargando usuarios...</option>
                    )}
                    {users.map((user) => (
                      <option key={user.idUsuario} value={user.idUsuario}>
                        {user.nombre} {user.apellido ? user.apellido : ""} (ID:{" "}
                        {user.idUsuario})
                      </option>
                    ))}
                  </Form.Select>
                </div>

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
                  className="btn-action shadow-sm"
                  title="Recargar datos"
                >
                  <RefreshCw
                    className={loading.data ? "spin-anim" : ""}
                    size={20}
                  />
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
            Cargando notificaciones...
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
                  <p className="text-muted mb-1 fw-semibold">Total Recibidas</p>
                  <h3 className="mb-0 fw-bold">{total}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.primary}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Bell size={32} style={{ color: kairosTheme.primary }} />
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
                animation: "fadeIn 0.7s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">No Leídas</p>
                  <h3 className="mb-0 fw-bold">{noLeidas}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.warning}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <EyeOff size={32} style={{ color: kairosTheme.warning }} />
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
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Leídas</p>
                  <h3 className="mb-0 fw-bold">{leidas}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.info}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Eye size={32} style={{ color: kairosTheme.info }} />
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
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: "white" }}>
                <Search size={20} color={kairosTheme.primary} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por título o contenido del mensaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
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
                    ¿Estás seguro de eliminar la notificación ID:{" "}
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
            <Table className="align-middle mb-0" style={{ minWidth: "900px" }}>
              <thead style={{ backgroundColor: kairosTheme.light }}>
                <tr>
                  <th className="p-3" style={{ width: "80px" }}>
                    ID
                  </th>
                  <th className="p-3" style={{ width: "200px" }}>
                    <div className="d-flex align-items-center">
                      <MessageSquare size={16} className="me-2" /> Título
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="d-flex align-items-center">
                      <Bell size={16} className="me-2" /> Mensaje
                    </div>
                  </th>
                  <th className="p-3" style={{ width: "180px" }}>
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="me-2" /> Fecha Envío
                    </div>
                  </th>
                  <th className="p-3 text-center" style={{ width: "120px" }}>
                    Estado
                  </th>
                  <th className="p-3 text-center" style={{ width: "100px" }}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.idNotificacion} className="table-row-hover">
                    <td className="p-3">
                      <Badge bg="light" text="dark">
                        #{item.idNotificacion}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="fw-bold text-dark">
                        {item.titulo || "Sin título"}
                      </div>
                    </td>
                    <td className="p-3">
                      <div
                        className="text-secondary"
                        style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem" }}
                      >
                        {item.mensaje}
                      </div>
                    </td>
                    <td className="p-3">
                      <small className="text-muted font-monospace">
                        {formatDate(item.fechaEnvio)}
                      </small>
                    </td>
                    <td className="p-3 text-center">
                      {item.leido ? (
                        <Badge bg="success" pill className="px-3">
                          Leído
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" pill className="px-3">
                          No Leído
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        onClick={() => setConfirmingId(item.idNotificacion)}
                        className="btn-action"
                        style={{
                          backgroundColor: kairosTheme.danger,
                          color: "white",
                        }}
                        title="Eliminar Notificación"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="6" className="text-center p-5 text-muted">
                      <div className="d-flex flex-column align-items-center py-4">
                        <Bell
                          size={48}
                          className="mb-3 text-secondary opacity-50"
                        />
                        {users.length === 0 ? (
                          <span>Cargando usuarios...</span>
                        ) : (
                          <span>No hay notificaciones para este usuario.</span>
                        )}
                      </div>
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

const GestionNotificaciones = () => (
  <NotificacionesState>
    <GestionNotificacionesContent />
  </NotificacionesState>
);

export default GestionNotificaciones;
