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
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  Activity,
  MapPin,
  Calendar,
  Star,
  Search,
  RefreshCw,
  Users,
  Footprints,
  Ruler,
  Clock,
  MessageCircle,
  Award,
  Map,
  TrendingUp,
} from "lucide-react";

const ActividadesContext = createContext();

const GET_ACTIVIDADES_BY_USER = "GET_ACTIVIDADES_BY_USER";
const GET_USERS_LIST = "GET_USERS_LIST";
const GET_HISTORIAL_VISITAS = "GET_HISTORIAL_VISITAS";

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
    case GET_HISTORIAL_VISITAS: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        historialVisitas: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    default:
      return state;
  }
};

const API_BASE_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net";
const API_ACTIVIDADES_URL = `${API_BASE_URL}/api/Actividades`;
const API_USUARIOS_URL = `${API_BASE_URL}/api/Usuarios`;
const API_LUGARES_URL = `${API_BASE_URL}/api/Lugares`;

const ActividadesState = ({ children }) => {
  const initialState = {
    actividades: [],
    historialVisitas: [],
    users: [],
  };

  const [state, dispatch] = useReducer(ActividadesReducer, initialState);

  const getActividadesByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_ACTIVIDADES_URL}/${idUsuario}`);
      dispatch({ type: GET_ACTIVIDADES_BY_USER, payload: res.data });
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      throw error;
    }
  };

  const getHistorialVisitas = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_LUGARES_URL}/historial/${idUsuario}`);
      dispatch({ type: GET_HISTORIAL_VISITAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener historial de visitas:", error);
    }
  };

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
        historialVisitas: state.historialVisitas,
        users: state.users,
        getActividadesByUsuario,
        getHistorialVisitas,
        getUsers,
      }}
    >
      {children}
    </ActividadesContext.Provider>
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
  purple: "#6f42c1",
  gold: "#f1c40f",
  bodyBg: "#f4f6f9",
};

const MonitorActividadContent = () => {
  const {
    actividades = [],
    historialVisitas = [],
    users = [],
    getActividadesByUsuario,
    getHistorialVisitas,
    getUsers,
  } = useContext(ActividadesContext);

  const [loading, setLoading] = useState({ data: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !currentUserId) {
      setCurrentUserId(users[0].idUsuario);
    }
  }, [users, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      loadAllData(currentUserId);
    }
  }, [currentUserId]);

  const loadAllData = async (userId) => {
    setLoading({ data: true });
    setError(null);
    try {
      await Promise.all([
        getActividadesByUsuario(userId),
        getHistorialVisitas(userId),
      ]);
    } catch (err) {
      setError("No se pudieron cargar los datos del usuario.");
    } finally {
      setLoading({ data: false });
    }
  };

  const handleRefresh = () => {
    getUsers();
    if (currentUserId) loadAllData(currentUserId);
  };

  const handleUserChange = (e) => {
    setCurrentUserId(parseInt(e.target.value));
  };

  const filteredActividades = actividades.filter((item) => {
    const lugar = (item.idLugarNavigation?.nombre || "").toLowerCase();
    const comentarios = (item.comentarios || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return lugar.includes(search) || comentarios.includes(search);
  });

  const totalActividades = filteredActividades.length;
  const totalVisitasCheckIn = historialVisitas.length;

  const totalPasos = filteredActividades.reduce(
    (acc, curr) => acc + (curr.pasos || 0),
    0
  );
  const totalDistancia = filteredActividades.reduce(
    (acc, curr) => acc + (curr.distancia || 0),
    0
  );

  const totalPuntosGanados = historialVisitas.reduce(
    (acc, curr) => acc + (curr.puntosGanados || 0),
    0
  );

  const promedioCalificacion =
    totalActividades > 0
      ? (
          filteredActividades.reduce(
            (acc, curr) => acc + (curr.calificacion || 0),
            0
          ) / totalActividades
        ).toFixed(1)
      : 0;

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x150?text=Sin+Imagen";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path}`;
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
        .visit-card { overflow: hidden; border: none; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .visit-card-img-wrapper { height: 140px; overflow: hidden; position: relative; }
        .visit-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .visit-card:hover .visit-card-img { transform: scale(1.1); }
        .points-badge { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.95); padding: 4px 12px; border-radius: 20px; font-weight: bold; color: ${kairosTheme.warning}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 4px; }
        .nav-pills .nav-link.active { background-color: ${kairosTheme.primary} !important; }
      `}</style>

      <Container fluid className="p-4">
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
                    Dashboard del Explorador
                  </h1>
                  <p className="mb-0 opacity-90">
                    Visión 360° de actividad física, puntos y visitas.
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
                  }}
                  className="btn-action shadow-sm"
                >
                  <RefreshCw
                    className={loading.data ? "spin-anim" : ""}
                    size={20}
                    color="white"
                  />
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-4 g-3">
          <Col md={12} lg={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover h-100"
              style={{
                borderRadius: "12px",
                borderLeft: `5px solid ${kairosTheme.warning}`,
              }}
            >
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0 text-muted fw-bold">Puntos Acumulados</h6>
                  <div
                    className="p-2 rounded-circle"
                    style={{ backgroundColor: `${kairosTheme.warning}20` }}
                  >
                    <Award size={24} color={kairosTheme.warning} />
                  </div>
                </div>
                <h2 className="mb-0 fw-bold text-dark">
                  {totalPuntosGanados}{" "}
                  <small className="fs-6 text-muted">pts</small>
                </h2>
                <small className="text-success fw-bold">
                  <TrendingUp size={14} /> Nivel Explorador
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover h-100"
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
                  <h6 className="mb-0 text-muted fw-bold">Distancia</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">
                  {totalDistancia.toFixed(2)}{" "}
                  <small className="text-muted fs-6">km</small>
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover h-100"
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
                  <h6 className="mb-0 text-muted fw-bold">Pasos Totales</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">
                  {totalPasos.toLocaleString()}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} lg={3}>
            <Card
              className="border-0 shadow-sm stat-card card-hover h-100"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="p-2 rounded-circle me-3"
                    style={{ backgroundColor: `${kairosTheme.purple}20` }}
                  >
                    <Map size={24} color={kairosTheme.purple} />
                  </div>
                  <h6 className="mb-0 text-muted fw-bold">Check-ins Totales</h6>
                </div>
                <h3 className="mb-0 fw-bold ms-1">
                  {totalVisitasCheckIn}{" "}
                  <small className="fs-6 text-muted">lugares</small>
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="dashboard"
          id="admin-dashboard-tabs"
          className="mb-4 custom-tabs border-0"
          variant="pills"
        >
          <Tab
            eventKey="dashboard"
            title={
              <span>
                <MapPin size={16} className="me-2" />
                Historial de Lugares (Visual)
              </span>
            }
          >
            {loading.data ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    Lugares Reclamados Recientemente
                  </h5>
                  <Badge
                    bg="light"
                    text="dark"
                    className="border px-3 py-2 rounded-pill"
                  >
                    {historialVisitas.length} registros encontrados
                  </Badge>
                </div>

                {historialVisitas.length === 0 ? (
                  <Alert
                    variant="light"
                    className="text-center py-5 border-0 shadow-sm"
                  >
                    <MapPin size={48} className="text-muted mb-3 opacity-50" />
                    <h5>Aún no hay visitas registradas</h5>
                    <p className="text-muted">
                      El usuario no ha reclamado puntos en ningún lugar.
                    </p>
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {historialVisitas.map((visita) => (
                      <Col key={visita.idVisita} xs={12} md={6} lg={4} xl={3}>
                        <Card className="visit-card h-100 bg-white card-hover">
                          <div className="visit-card-img-wrapper">
                            <Card.Img
                              variant="top"
                              src={getImageUrl(visita.imagenLugar)}
                              className="visit-card-img"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/300x150?text=Kairos+Lugar")
                              }
                            />
                            <div className="points-badge">
                              <Award size={14} fill={kairosTheme.warning} />+
                              {visita.puntosGanados} pts
                            </div>
                          </div>
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-start justify-content-between mb-2">
                              <Card.Title
                                className="fw-bold fs-6 mb-0 text-dark text-truncate"
                                title={visita.nombreLugar}
                              >
                                {visita.nombreLugar}
                              </Card.Title>
                            </div>
                            <div className="text-muted small d-flex align-items-center mb-2">
                              <Calendar size={14} className="me-2" />
                              {formatDate(visita.fechaVisita)}
                            </div>
                            <div className="d-grid mt-3">
                              <Button
                                size="sm"
                                variant="outline-light"
                                className="text-muted border py-1"
                                disabled
                              >
                                ID Visita: #{visita.idVisita}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </Tab>

          <Tab
            eventKey="table"
            title={
              <span>
                <Activity size={16} className="me-2" />
                Reporte de Actividades (Tabla)
              </span>
            }
          >
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <Card.Header className="bg-white border-0 pt-4 px-4 d-flex justify-content-between">
                <h5 className="fw-bold mb-0">Detalle de Actividades Físicas</h5>
                <InputGroup style={{ maxWidth: "300px" }} size="sm">
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por nombre..."
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
                        <th className="p-3 ps-4 text-secondary text-uppercase small">
                          Lugar Visitado
                        </th>
                        <th className="p-3 text-secondary text-uppercase small">
                          Horario
                        </th>
                        <th className="p-3 text-secondary text-uppercase small">
                          Métricas
                        </th>
                        <th className="p-3 text-secondary text-uppercase small">
                          Calif.
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
                      ) : filteredActividades.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center p-5 text-muted"
                          >
                            No hay actividades físicas registradas.
                          </td>
                        </tr>
                      ) : (
                        filteredActividades.map((item) => (
                          <tr key={item.idActividad}>
                            <td className="p-3 ps-4">
                              <div className="d-flex align-items-center">
                                <div className="p-2 rounded bg-light me-3 text-primary">
                                  <MapPin size={20} />
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">
                                    {item.idLugarNavigation?.nombre ||
                                      "Desconocido"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <small className="text-muted">
                                <Calendar size={12} className="me-1" />{" "}
                                {formatDate(item.fechaInicio)}
                              </small>
                            </td>
                            <td className="p-3">
                              <Badge
                                bg="light"
                                text="dark"
                                className="me-2 border"
                              >
                                <Footprints size={12} /> {item.pasos || 0}
                              </Badge>
                              <Badge bg="light" text="dark" className="border">
                                <Ruler size={12} /> {item.distancia || 0}km
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="d-flex">
                                {renderStars(item.calificacion || 0)}
                              </div>
                            </td>
                            <td className="p-3 text-muted small fst-italic">
                              {item.comentarios || "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
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
