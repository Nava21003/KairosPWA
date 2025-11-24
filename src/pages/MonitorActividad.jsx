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
  Activity,
  MapPin,
  Calendar,
  Star,
  Search,
  RefreshCw,
  Users,
  Footprints, // Icono Pasos
  Ruler, // Icono Distancia
  Clock, // Icono Duración
  MessageCircle, // Icono Comentarios
} from "lucide-react";

// --- 1. CONTEXTO Y REDUCER ---

const ActividadesContext = createContext();

// Tipos de Acciones
const GET_ACTIVIDADES_BY_USER = "GET_ACTIVIDADES_BY_USER";
const GET_USERS_LIST = "GET_USERS_LIST";

// Helper para extraer datos
const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const ActividadesReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_ACTIVIDADES_BY_USER: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        actividades: Array.isArray(dataToUse) ? dataToUse : [],
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

// --- 2. STATE (Lógica de Negocio) ---

const API_ACTIVIDADES_URL = "http://localhost:5219/api/Actividades";
const API_USUARIOS_URL = "http://localhost:5219/api/Usuarios";

const ActividadesState = ({ children }) => {
  const initialState = {
    actividades: [],
    users: [],
  };

  const [state, dispatch] = useReducer(ActividadesReducer, initialState);

  // GET /api/Actividades/{idUsuario}
  const getActividadesByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_ACTIVIDADES_URL}/${idUsuario}`);
      dispatch({ type: GET_ACTIVIDADES_BY_USER, payload: res.data });
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      throw error;
    }
  };

  // GET /api/Usuarios (Para el selector)
  const getUsers = async () => {
    try {
      const res = await axios.get(API_USUARIOS_URL);
      dispatch({ type: GET_USERS_LIST, payload: res.data });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  return (
    <ActividadesContext.Provider
      value={{
        actividades: state.actividades,
        users: state.users,
        getActividadesByUsuario,
        getUsers,
      }}
    >
      {children}
    </ActividadesContext.Provider>
  );
};

// --- 3. COMPONENTES UI ---

const kairosTheme = {
  primary: "#4ecca3", // Verde Ment
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  light: "#f8f9fa",
  dark: "#2c3e50",
  white: "#ffffff",
  purple: "#6f42c1", // Color extra para actividad
  bodyBg: "#f4f6f9",
};

const MonitorActividadContent = () => {
  const {
    actividades = [],
    users = [],
    getActividadesByUsuario,
    getUsers,
  } = useContext(ActividadesContext);

  const [loading, setLoading] = useState({ data: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Carga inicial de usuarios
  useEffect(() => {
    getUsers();
  }, []);

  // Seleccionar primer usuario por defecto
  useEffect(() => {
    if (users.length > 0 && !currentUserId) {
      setCurrentUserId(users[0].idUsuario);
    }
  }, [users, currentUserId]);

  // Cargar actividades al cambiar usuario
  useEffect(() => {
    if (currentUserId) {
      loadActividades(currentUserId);
    }
  }, [currentUserId]);

  const loadActividades = async (userId) => {
    setLoading({ data: true });
    setError(null);
    try {
      await getActividadesByUsuario(userId);
      setDataLoaded(true);
    } catch (err) {
      setError("No se pudieron cargar las actividades.");
    } finally {
      setLoading({ data: false });
    }
  };

  const handleRefresh = () => {
    getUsers();
    if (currentUserId) loadActividades(currentUserId);
  };

  const handleUserChange = (e) => {
    setCurrentUserId(parseInt(e.target.value));
  };

  // Filtrado
  const filteredData = actividades.filter((item) => {
    const lugar = (item.idLugarNavigation?.nombre || "").toLowerCase();
    const comentarios = (item.comentarios || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return lugar.includes(search) || comentarios.includes(search);
  });

  // Cálculos de Estadísticas
  const totalActividades = filteredData.length;
  const totalPasos = filteredData.reduce(
    (acc, curr) => acc + (curr.pasos || 0),
    0
  );
  const totalDistancia = filteredData.reduce(
    (acc, curr) => acc + (curr.distancia || 0),
    0
  );

  const promedioCalificacion =
    totalActividades > 0
      ? (
          filteredData.reduce(
            (acc, curr) => acc + (curr.calificacion || 0),
            0
          ) / totalActividades
        ).toFixed(1)
      : 0;

  // Renderizado de Estrellas
  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < count ? kairosTheme.warning : "none"}
        color={i < count ? kairosTheme.warning : "#ccc"}
      />
    ));
  };

  // Formato de Fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cálculo de Duración
  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
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
      `}</style>

      <Container fluid className="p-4">
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${kairosTheme.purple} 0%, #a29bfe 100%)`,
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 24px rgba(111, 66, 193, 0.3)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <Row className="align-items-center">
            <Col md={7}>
              <div className="d-flex align-items-center text-white">
                <Activity size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Monitor de Actividad
                  </h1>
                  <p className="mb-0 opacity-90">
                    Seguimiento de pasos, distancia y visitas a lugares.
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
                        {user.nombre} {user.apellido || ""} (ID:{" "}
                        {user.idUsuario})
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={loading.data}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                  className="btn-action shadow-sm"
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

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="p-2 rounded-circle me-3"
                    style={{ backgroundColor: `${kairosTheme.info}20` }}
                  >
                    <Ruler size={24} color={kairosTheme.info} />
                  </div>
                  <h6 className="mb-0 text-muted fw-bold">Distancia Total</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">
                  {totalDistancia.toFixed(2)}{" "}
                  <small className="text-muted fs-6">km</small>
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="p-2 rounded-circle me-3"
                    style={{ backgroundColor: `${kairosTheme.primary}20` }}
                  >
                    <Footprints size={24} color={kairosTheme.primary} />
                  </div>
                  <h6 className="mb-0 text-muted fw-bold">Total Pasos</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">
                  {totalPasos.toLocaleString()}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="p-2 rounded-circle me-3"
                    style={{ backgroundColor: `${kairosTheme.warning}20` }}
                  >
                    <Star size={24} color={kairosTheme.warning} />
                  </div>
                  <h6 className="mb-0 text-muted fw-bold">Calif. Promedio</h6>
                </div>
                <div className="d-flex align-items-baseline">
                  <h3 className="mb-0 fw-bold ms-1">{promedioCalificacion}</h3>
                  <div className="ms-2">
                    {renderStars(Math.round(promedioCalificacion))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="p-2 rounded-circle me-3"
                    style={{ backgroundColor: `${kairosTheme.purple}20` }}
                  >
                    <Activity size={24} color={kairosTheme.purple} />
                  </div>
                  <h6 className="mb-0 text-muted fw-bold">Visitas</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">{totalActividades}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtro y Tabla */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <InputGroup style={{ maxWidth: "400px" }}>
              <InputGroup.Text className="bg-light border-end-0">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar lugar o comentario..."
                className="bg-light border-start-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table
                className="align-middle mb-0 table-hover"
                style={{ minWidth: "900px" }}
              >
                <thead style={{ backgroundColor: kairosTheme.light }}>
                  <tr>
                    <th
                      className="p-3 ps-4 text-secondary text-uppercase small"
                      style={{ width: "200px" }}
                    >
                      Lugar Visitado
                    </th>
                    <th
                      className="p-3 text-secondary text-uppercase small"
                      style={{ width: "220px" }}
                    >
                      Horario y Duración
                    </th>
                    <th className="p-3 text-secondary text-uppercase small">
                      Métricas Físicas
                    </th>
                    <th
                      className="p-3 text-secondary text-uppercase small"
                      style={{ width: "150px" }}
                    >
                      Calificación
                    </th>
                    <th className="p-3 text-secondary text-uppercase small">
                      Comentarios
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading.data ? (
                    <tr>
                      <td colSpan="5" className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-5 text-muted">
                        {users.length === 0
                          ? "Cargando usuarios..."
                          : "No hay actividades registradas para este usuario."}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.idActividad}>
                        <td className="p-3 ps-4">
                          <div className="d-flex align-items-center">
                            <div className="p-2 rounded bg-light me-3 text-primary">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark">
                                {item.idLugarNavigation?.nombre ||
                                  "Ubicación Desconocida"}
                              </div>
                              <small className="text-muted">
                                ID: {item.idActividad}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex flex-column gap-1">
                            <div className="text-muted small d-flex align-items-center">
                              <Calendar size={14} className="me-1" />{" "}
                              {formatDate(item.fechaInicio)}
                            </div>
                            <Badge
                              bg="light"
                              text="dark"
                              className="d-flex align-items-center w-auto border"
                              style={{ width: "fit-content" }}
                            >
                              <Clock size={12} className="me-1" />
                              {calculateDuration(
                                item.fechaInicio,
                                item.fechaFin
                              )}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex gap-3">
                            <div
                              className="d-flex align-items-center"
                              title="Pasos"
                            >
                              <Footprints
                                size={16}
                                className="me-1 text-success"
                              />
                              <span className="fw-bold">
                                {item.pasos?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div
                              className="d-flex align-items-center"
                              title="Distancia"
                            >
                              <Ruler size={16} className="me-1 text-info" />
                              <span className="fw-bold">
                                {item.distancia || 0} km
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex">
                            {renderStars(item.calificacion || 0)}
                          </div>
                        </td>
                        <td className="p-3">
                          {item.comentarios ? (
                            <div className="d-flex text-muted small">
                              <MessageCircle
                                size={16}
                                className="me-2 flex-shrink-0 mt-1"
                              />
                              <span className="fst-italic">
                                "{item.comentarios}"
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

const MonitorActividad = () => (
  <ActividadesState>
    <MonitorActividadContent />
  </ActividadesState>
);

export default MonitorActividad;
