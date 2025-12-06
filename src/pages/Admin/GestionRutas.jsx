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
  Nav,
  Tab,
  OverlayTrigger,
  Tooltip,
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
  Power,
  Map as MapIcon,
  Navigation,
  User,
  AlignLeft,
  Route,
  MapPin,
  Globe,
  ListOrdered,
  MoveUp,
  MoveDown,
  Info,
} from "lucide-react";

const RutasContext = createContext();

const GET_RUTAS = "GET_RUTAS";
const GET_LUGARES_PARA_RUTAS = "GET_LUGARES_PARA_RUTAS";
const CREATE_RUTA = "CREATE_RUTA";
const UPDATE_RUTA = "UPDATE_RUTA";
const DELETE_RUTA = "DELETE_RUTA";

const extractData = (payload) => {
  if (!payload) return [];
  if (payload.$values) {
    return payload.$values;
  }
  return Array.isArray(payload) ? payload : [];
};

// Helper para formatear errores
const formatError = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.errors) {
      return Object.values(data.errors).flat().join(", ");
    }
    if (typeof data === "object") {
      return data.title || data.message || JSON.stringify(data);
    }
    return data;
  }
  return error.message || "Error desconocido";
};

const RutasReducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case GET_RUTAS: {
      const data = extractData(payload);
      return { ...state, rutas: data };
    }
    case GET_LUGARES_PARA_RUTAS: {
      const data = extractData(payload);
      return { ...state, lugaresDisponibles: data };
    }
    case CREATE_RUTA:
    case UPDATE_RUTA:
      return state;
    case DELETE_RUTA: {
      const idToDelete = payload;
      return {
        ...state,
        rutas: state.rutas.filter((ruta) => ruta.idRuta !== idToDelete),
      };
    }
    default:
      return state;
  }
};

const API_RUTAS_URL = "http://localhost:5219/api/Rutas";
const API_LUGARES_URL = "http://localhost:5219/api/Lugares";

const RutasState = ({ children }) => {
  const initialState = {
    rutas: [],
    lugaresDisponibles: [],
  };

  const [state, dispatch] = useReducer(RutasReducer, initialState);

  const getRutas = async () => {
    try {
      const res = await axios.get(API_RUTAS_URL);
      dispatch({ type: GET_RUTAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener rutas:", error);
    }
  };

  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES_PARA_RUTAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener lugares:", error);
    }
  };

  const createRuta = async (rutaData) => {
    try {
      const response = await axios.post(API_RUTAS_URL, rutaData);
      dispatch({ type: CREATE_RUTA, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error al crear ruta:", error);
      throw error;
    }
  };

  const updateRuta = async (id, rutaData) => {
    try {
      const dataToSend = { ...rutaData, idRuta: id };
      await axios.put(`${API_RUTAS_URL}/${id}`, dataToSend);
      dispatch({ type: UPDATE_RUTA, payload: dataToSend });
      return true;
    } catch (error) {
      console.error("Error al actualizar ruta:", error);
      throw error;
    }
  };

  const deleteRuta = async (id) => {
    try {
      await axios.delete(`${API_RUTAS_URL}/${id}`);
      dispatch({ type: DELETE_RUTA, payload: id });
    } catch (error) {
      console.error("Error al eliminar ruta:", error);
      throw error;
    }
  };

  return (
    <RutasContext.Provider
      value={{
        rutas: state.rutas,
        lugaresDisponibles: state.lugaresDisponibles,
        getRutas,
        getLugares,
        createRuta,
        updateRuta,
        deleteRuta,
      }}
    >
      {children}
    </RutasContext.Provider>
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
      {message.type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}
      <span>{message.text}</span>
    </div>
  );
};

const RutaModal = ({ show, handleClose, saveRuta, ruta, loading, lugares }) => {
  const isEditing = ruta !== null;
  const [modoDefinicion, setModoDefinicion] = useState("lugares");
  const [activeTab, setActiveTab] = useState("general");
  const [intermediateStops, setIntermediateStops] = useState([]);
  const [newStopId, setNewStopId] = useState("");

  const initialFormData = {
    nombre: "",
    descripcion: "",
    idUsuario: "",
    estatus: "Activa",
    fechaCreacion: new Date().toISOString(),
    latitudInicio: "",
    longitudInicio: "",
    latitudFin: "",
    longitudFin: "",
    idLugarInicio: "",
    idLugarFin: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (ruta && show) {
      let modoInicial = "lugares";
      if (
        !ruta.idLugarInicio &&
        !ruta.idLugarFin &&
        (ruta.latitudInicio || ruta.latitudFin)
      ) {
        modoInicial = "coordenadas";
      }
      setModoDefinicion(modoInicial);
      setActiveTab("general");

      setFormData({
        idRuta: ruta.idRuta,
        nombre: ruta.nombre || "",
        descripcion: ruta.descripcion || "",
        idUsuario: ruta.idUsuario || "",
        estatus: ruta.estatus || "Activa",
        fechaCreacion: ruta.fechaCreacion,
        latitudInicio: ruta.latitudInicio || "",
        longitudInicio: ruta.longitudInicio || "",
        latitudFin: ruta.latitudFin || "",
        longitudFin: ruta.longitudFin || "",
        idLugarInicio: ruta.idLugarInicio || "",
        idLugarFin: ruta.idLugarFin || "",
      });

      const rawStops = extractData(ruta.rutasLugares);
      const stops = rawStops
        .map((rl) => {
          let nombreLugar = "Lugar Desconocido";
          if (rl.idLugarNavigation?.nombre) {
            nombreLugar = rl.idLugarNavigation.nombre;
          } else {
            const found = lugares.find((l) => l.idLugar === rl.idLugar);
            if (found) nombreLugar = found.nombre;
          }
          return {
            idLugar: rl.idLugar,
            orden: rl.orden,
            nombreLugar: nombreLugar,
          };
        })
        .sort((a, b) => a.orden - b.orden);

      setIntermediateStops(stops);
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
      setModoDefinicion("lugares");
      setActiveTab("general");
      setIntermediateStops([]);
      setNewStopId("");
    }
  }, [ruta, show, lugares]);

  const validateForm = () => {
    const errors = {};
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    } else if (!regexSoloLetras.test(formData.nombre)) {
      errors.nombre =
        "El nombre no puede llevar números ni caracteres especiales";
    }

    if (modoDefinicion === "coordenadas") {
      if (!formData.latitudInicio || !formData.longitudInicio)
        errors.coordenadasInicio = "Latitud y Longitud de inicio requeridas";
      if (!formData.latitudFin || !formData.longitudFin)
        errors.coordenadasFin = "Latitud y Longitud de fin requeridas";
    } else {
      if (!formData.idLugarInicio)
        errors.idLugarInicio = "Selecciona lugar de inicio";
      if (!formData.idLugarFin) errors.idLugarFin = "Selecciona lugar de fin";
    }

    if (modoDefinicion === "lugares") {
      const inicioId = parseInt(formData.idLugarInicio);
      const finId = parseInt(formData.idLugarFin);
      const inicioInStops = intermediateStops.some(
        (s) => s.idLugar === inicioId
      );
      const finInStops = intermediateStops.some((s) => s.idLugar === finId);

      if (inicioInStops)
        errors.idLugarInicio =
          "El lugar de inicio no puede ser una parada intermedia.";
      if (finInStops)
        errors.idLugarFin =
          "El lugar de destino no puede ser una parada intermedia.";
      if (inicioId === finId && inicioId)
        errors.idLugarFin = "El inicio y el fin no pueden ser el mismo lugar.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (name.includes("latitud") || name.includes("longitud")) {
      setFormErrors((prev) => ({
        ...prev,
        coordenadasInicio: "",
        coordenadasFin: "",
      }));
    }
    let newValue = value;
    if (type === "checkbox") {
      if (name === "estatusBool") {
        setFormData((prev) => ({
          ...prev,
          estatus: checked ? "Activa" : "Inactiva",
        }));
        return;
      }
      newValue = checked;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const addStop = () => {
    const lugarId = parseInt(newStopId);
    if (!lugarId) return;

    const isDuplicate = intermediateStops.some((s) => s.idLugar === lugarId);
    if (isDuplicate) return alert("Este lugar ya fue agregado como parada.");

    if (
      modoDefinicion === "lugares" &&
      (lugarId === parseInt(formData.idLugarInicio) ||
        lugarId === parseInt(formData.idLugarFin))
    )
      return alert("Este lugar ya es inicio o destino.");

    const lugar = lugares.find((l) => l.idLugar === lugarId);
    if (!lugar) return;

    const newStop = {
      idLugar: lugarId,
      nombreLugar: lugar.nombre,
      orden: intermediateStops.length + 1,
    };

    setIntermediateStops((prev) =>
      [...prev, newStop].map((stop, index) => ({
        ...stop,
        orden: index + 1,
      }))
    );
    setNewStopId("");
  };

  const removeStop = (idLugarToRemove) => {
    setIntermediateStops((prev) =>
      prev
        .filter((s) => s.idLugar !== idLugarToRemove)
        .map((stop, index) => ({ ...stop, orden: index + 1 }))
    );
  };

  const updateStopOrder = (index, direction) => {
    setIntermediateStops((prev) => {
      const stops = [...prev];
      const newIndex = index + (direction === "up" ? -1 : 1);
      if (newIndex >= 0 && newIndex < stops.length) {
        [stops[index], stops[newIndex]] = [stops[newIndex], stops[index]];
        return stops.map((stop, i) => ({ ...stop, orden: i + 1 }));
      }
      return stops;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab("general");
      return;
    }

    const parseNumberOrNull = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };
    const parseIntOrNull = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const rutasLugares = intermediateStops.map((s) => ({
      idLugar: s.idLugar,
      orden: s.orden,
    }));

    const dataToSend = {
      ...formData,
      idRuta: isEditing ? formData.idRuta : 0,
      idUsuario: parseIntOrNull(formData.idUsuario),
      latitudInicio:
        modoDefinicion === "coordenadas"
          ? parseNumberOrNull(formData.latitudInicio)
          : null,
      longitudInicio:
        modoDefinicion === "coordenadas"
          ? parseNumberOrNull(formData.longitudInicio)
          : null,
      latitudFin:
        modoDefinicion === "coordenadas"
          ? parseNumberOrNull(formData.latitudFin)
          : null,
      longitudFin:
        modoDefinicion === "coordenadas"
          ? parseNumberOrNull(formData.longitudFin)
          : null,
      idLugarInicio:
        modoDefinicion === "lugares"
          ? parseIntOrNull(formData.idLugarInicio)
          : null,
      idLugarFin:
        modoDefinicion === "lugares"
          ? parseIntOrNull(formData.idLugarFin)
          : null,
      rutasLugares: rutasLugares,
    };

    saveRuta(dataToSend, isEditing);
  };

  const isStatusActive =
    formData.estatus === "Activa" ||
    formData.estatus === "Abierto" ||
    formData.estatus === true;

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
              <Pencil className="me-2" /> Editar Ruta
            </>
          ) : (
            <>
              <Plus className="me-2" /> Nueva Ruta
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="general" style={{ cursor: "pointer" }}>
                <Route size={16} className="me-1" /> General
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="paradas" style={{ cursor: "pointer" }}>
                <ListOrdered size={16} className="me-1" /> Paradas Intermedias (
                {intermediateStops.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form onSubmit={handleSubmit}>
            <Tab.Content>
              <Tab.Pane eventKey="general">
                <h6 className="text-muted fw-bold mb-3">Datos Generales</h6>
                <Row className="mb-3">
                  <Form.Group as={Col} md={8}>
                    <Form.Label className="fw-semibold">
                      <Navigation size={16} className="me-1" /> Nombre *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej. Ruta Gastronómica"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      isInvalid={!!formErrors.nombre}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.nombre}
                    </Form.Control.Feedback>

                    {/* --- MODIFICACIÓN 2: Texto de ayuda --- */}
                    <Form.Text
                      className="text-muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Solo se permiten letras y espacios (sin números ni
                      símbolos).
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="fw-semibold">
                      <User size={16} className="me-1" /> ID Usuario (Opcional)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Sin asignar"
                      name="idUsuario"
                      value={formData.idUsuario}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <AlignLeft size={16} className="me-1" /> Descripción
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </Form.Group>
                <hr className="my-4" />
                <h6 className="text-muted fw-bold mb-3">
                  Definición de Trayecto
                </h6>
                <Nav
                  variant="pills"
                  className="mb-3 justify-content-center"
                  activeKey={modoDefinicion}
                  onSelect={(k) => setModoDefinicion(k)}
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="lugares"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          modoDefinicion === "lugares"
                            ? kairosTheme.primary
                            : "",
                      }}
                    >
                      <MapPin size={16} className="me-2" /> Por Lugares
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="coordenadas"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          modoDefinicion === "coordenadas"
                            ? kairosTheme.primary
                            : "",
                      }}
                    >
                      <Globe size={16} className="me-2" /> Por Coordenadas
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className="p-3 border rounded bg-light">
                  {modoDefinicion === "lugares" ? (
                    <Row>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Lugar de Inicio *
                        </Form.Label>
                        <Form.Select
                          name="idLugarInicio"
                          value={formData.idLugarInicio}
                          onChange={handleChange}
                          isInvalid={!!formErrors.idLugarInicio}
                        >
                          <option value="">Seleccionar...</option>
                          {lugares
                            .filter(
                              (l) =>
                                !intermediateStops.some(
                                  (s) => s.idLugar === l.idLugar
                                )
                            )
                            .map((l) => (
                              <option key={l.idLugar} value={l.idLugar}>
                                {l.nombre}
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.idLugarInicio}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Lugar de Destino *
                        </Form.Label>
                        <Form.Select
                          name="idLugarFin"
                          value={formData.idLugarFin}
                          onChange={handleChange}
                          isInvalid={!!formErrors.idLugarFin}
                        >
                          <option value="">Seleccionar...</option>
                          {lugares
                            .filter(
                              (l) =>
                                !intermediateStops.some(
                                  (s) => s.idLugar === l.idLugar
                                )
                            )
                            .map((l) => (
                              <option key={l.idLugar} value={l.idLugar}>
                                {l.nombre}
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.idLugarFin}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <Row className="mb-2">
                        <Col md={12}>
                          <strong className="text-primary">
                            Punto A (Inicio)
                          </strong>
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            step="any"
                            placeholder="Latitud Inicio"
                            name="latitudInicio"
                            value={formData.latitudInicio}
                            onChange={handleChange}
                            isInvalid={!!formErrors.coordenadasInicio}
                          />
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            step="any"
                            placeholder="Longitud Inicio"
                            name="longitudInicio"
                            value={formData.longitudInicio}
                            onChange={handleChange}
                            isInvalid={!!formErrors.coordenadasInicio}
                          />
                        </Col>
                      </Row>
                      <Form.Control.Feedback
                        type="invalid"
                        className="d-block mb-3"
                      >
                        {formErrors.coordenadasInicio}
                      </Form.Control.Feedback>
                      <Row>
                        <Col md={12}>
                          <strong className="text-danger">Punto B (Fin)</strong>
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            step="any"
                            placeholder="Latitud Fin"
                            name="latitudFin"
                            value={formData.latitudFin}
                            onChange={handleChange}
                            isInvalid={!!formErrors.coordenadasFin}
                          />
                        </Col>
                        <Col>
                          <Form.Control
                            type="number"
                            step="any"
                            placeholder="Longitud Fin"
                            name="longitudFin"
                            value={formData.longitudFin}
                            onChange={handleChange}
                            isInvalid={!!formErrors.coordenadasFin}
                          />
                        </Col>
                      </Row>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {formErrors.coordenadasFin}
                      </Form.Control.Feedback>
                    </>
                  )}
                </div>
                <Row className="mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        name="estatusBool"
                        id="estatus-switch"
                        label={
                          <span className="d-flex align-items-center fw-semibold">
                            <CheckCircle
                              size={18}
                              className="me-2"
                              style={{
                                color: isStatusActive
                                  ? kairosTheme.success
                                  : kairosTheme.danger,
                              }}
                            />
                            {isStatusActive ? "Ruta Activa" : "Ruta Inactiva"}
                          </span>
                        }
                        checked={isStatusActive}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="paradas">
                <h6 className="text-muted fw-bold mb-3">
                  Puntos de Parada (entre inicio y destino)
                </h6>
                <Row className="mb-3">
                  <Col md={9}>
                    <Form.Select
                      value={newStopId}
                      onChange={(e) => setNewStopId(e.target.value)}
                    >
                      <option value="">Añadir Lugar de Parada...</option>
                      {lugares
                        .filter(
                          (l) =>
                            l.idLugar !== parseInt(formData.idLugarInicio) &&
                            l.idLugar !== parseInt(formData.idLugarFin) &&
                            !intermediateStops.some(
                              (s) => s.idLugar === l.idLugar
                            )
                        )
                        .map((l) => (
                          <option key={l.idLugar} value={l.idLugar}>
                            {l.nombre}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Button
                      onClick={addStop}
                      disabled={!newStopId}
                      className="w-100"
                      style={{
                        backgroundColor: kairosTheme.primary,
                        border: "none",
                      }}
                    >
                      <Plus size={16} /> Agregar
                    </Button>
                  </Col>
                </Row>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr style={{ backgroundColor: kairosTheme.light }}>
                        <th>#</th>
                        <th>Lugar</th>
                        <th className="text-center">Orden</th>
                        <th className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intermediateStops.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            Aún no hay paradas intermedias.
                          </td>
                        </tr>
                      ) : (
                        intermediateStops.map((stop, index) => (
                          <tr key={stop.idLugar}>
                            <td>
                              <Badge bg="info">{stop.idLugar}</Badge>
                            </td>
                            <td>{stop.nombreLugar}</td>
                            <td className="text-center fw-bold">
                              {stop.orden}
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateStopOrder(index, "up")}
                                disabled={index === 0}
                                className="me-1"
                              >
                                <MoveUp size={14} />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateStopOrder(index, "down")}
                                disabled={
                                  index === intermediateStops.length - 1
                                }
                                className="me-2"
                              >
                                <MoveDown size={14} />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeStop(stop.idLugar)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
                {modoDefinicion === "coordenadas" &&
                  intermediateStops.length > 0 && (
                    <Alert variant="warning" className="mt-3">
                      ⚠️ **Nota:** Las paradas intermedias solo usan el ID del
                      lugar. Si usaste coordenadas para inicio/fin, la ruta
                      resultante será: Inicio (coordenadas) → Paradas (lugares)
                      → Fin
                    </Alert>
                  )}
              </Tab.Pane>
            </Tab.Content>
          </Form>
        </Tab.Container>
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
          {isEditing ? "Guardar Cambios" : "Crear Ruta"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionRutasContent = () => {
  const {
    rutas = [],
    lugaresDisponibles = [],
    getRutas,
    getLugares,
    createRuta,
    updateRuta,
    deleteRuta,
  } = useContext(RutasContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rutaToEdit, setRutaToEdit] = useState(null);
  const [loading, setLoading] = useState({ rutas: false, action: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.rutas) return;
    setLoading((prev) => ({ ...prev, rutas: true }));
    setError(null);
    try {
      await Promise.all([getRutas(), getLugares()]);
      setDataLoaded(true);
    } catch (error) {
      setError("Error al cargar datos. Verifica que la API esté activa.");
      showMessage("Error al cargar datos", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, rutas: false }));
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
    setRutaToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const ruta = rutas.find((r) => r.idRuta === id);
    if (ruta) {
      setRutaToEdit(ruta);
      setShowModal(true);
    } else {
      showMessage("Ruta no encontrada", "danger");
    }
  };

  const handleToggleStatus = async (ruta) => {
    if (loading.action) return;
    const isActive =
      ruta.estatus === "Activa" ||
      ruta.estatus === "Abierto" ||
      ruta.estatus === true;
    const nuevoEstatus = isActive ? "Inactiva" : "Activa";

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const rutaLimpia = {
        ...ruta,
        estatus: nuevoEstatus,
        idLugarInicioNavigation: null,
        idLugarFinNavigation: null,
        idUsuarioNavigation: null,
        rutasLugares: extractData(ruta.rutasLugares).map((rl) => ({
          idLugar: rl.idLugar,
          orden: rl.orden,
        })),
      };
      await updateRuta(ruta.idRuta, rutaLimpia);
      showMessage(
        `Ruta ${
          nuevoEstatus === "Activa" ? "activada" : "desactivada"
        } correctamente`,
        "success"
      );
      await getRutas();
    } catch (error) {
      showMessage(`Error: ${formatError(error)}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRutaToEdit(null);
  };

  const saveRuta = async (rutaData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateRuta(rutaData.idRuta, rutaData);
        showMessage("Ruta actualizada exitosamente", "success");
      } else {
        await createRuta(rutaData);
        showMessage("Ruta creada exitosamente", "success");
      }
      handleCloseModal();
      await getRutas();
    } catch (error) {
      showMessage(`Error: ${formatError(error)}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteRuta(idToDelete);
      showMessage("Ruta eliminada exitosamente", "success");
      await getRutas();
    } catch (error) {
      showMessage(`Error al eliminar: ${formatError(error)}`, "danger");
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentRutas = Array.isArray(rutas) ? rutas : [];

  const filteredRutas = currentRutas.filter((ruta) => {
    const nombre = (ruta.nombre || "").toLowerCase();
    const desc = (ruta.descripcion || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(search) || desc.includes(search);
    const isActive =
      ruta.estatus === "Activa" ||
      ruta.estatus === "Abierto" ||
      ruta.estatus === true;
    const matchesEstatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && isActive) ||
      (filterEstatus === "inactive" && !isActive);
    return matchesSearch && matchesEstatus;
  });

  const isLoading = loading.rutas && !dataLoaded;
  const countActivas = currentRutas.filter(
    (r) =>
      r.estatus === "Activa" || r.estatus === "Abierto" || r.estatus === true
  ).length;

  const renderUbicacion = (idLugar, lat, lon, navProp) => {
    if (idLugar) {
      if (navProp && navProp.nombre) {
        return (
          <Badge bg="primary">
            <MapPin size={12} className="me-1" /> {navProp.nombre}
          </Badge>
        );
      } else {
        const found = lugaresDisponibles.find((l) => l.idLugar === idLugar);
        if (found) {
          return (
            <Badge bg="primary">
              <MapPin size={12} className="me-1" /> {found.nombre}
            </Badge>
          );
        }
      }
    }

    if (lat && lon) {
      return (
        <Badge bg="secondary">
          <Globe size={12} className="me-1" /> {parseFloat(lat).toFixed(4)},{" "}
          {parseFloat(lon).toFixed(4)}
        </Badge>
      );
    }
    return <span className="text-muted small">N/A</span>;
  };

  const renderParadasIntermedias = (rutasLugares) => {
    const stops = extractData(rutasLugares).sort((a, b) => a.orden - b.orden);
    const count = stops.length;

    if (count === 0) {
      return (
        <Badge bg="light" text="secondary">
          Directo
        </Badge>
      );
    }

    const getNombreLugar = (idLugar, navProp) => {
      if (navProp && navProp.nombre) return navProp.nombre;
      const lugarEncontrado = lugaresDisponibles.find(
        (l) => l.idLugar === idLugar
      );
      if (lugarEncontrado) return lugarEncontrado.nombre;
      return `Lugar ID: ${idLugar}`;
    };

    const tooltip = (
      <Tooltip id={`tooltip-stops-${count}`}>
        <div className="text-start">
          <div className="fw-bold mb-1 border-bottom pb-1">Itinerario:</div>
          <ul className="list-unstyled mb-0" style={{ fontSize: "0.85rem" }}>
            {stops.map((stop) => (
              <li key={stop.idLugar} className="mb-1">
                <span className="fw-bold text-info me-1">{stop.orden}.</span>
                {/* Lógica de búsqueda de nombre aquí */}
                {getNombreLugar(stop.idLugar, stop.idLugarNavigation)}
              </li>
            ))}
          </ul>
        </div>
      </Tooltip>
    );

    return (
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={tooltip}
      >
        <Badge
          bg="warning"
          text="dark"
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <ListOrdered size={14} className="me-1" />
          {count} Paradas
          <Info size={12} className="ms-1 opacity-50" />
        </Badge>
      </OverlayTrigger>
    );
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
      <RutaModal
        show={showModal}
        handleClose={handleCloseModal}
        saveRuta={saveRuta}
        ruta={rutaToEdit}
        loading={loading.action}
        lugares={lugaresDisponibles}
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
                <MapIcon size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Rutas
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra recorridos por lugares o coordenadas GPS.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.rutas}
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
                  disabled={loading.rutas}
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
                  <Plus className="me-2" size={20} /> Nueva Ruta
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        {error && (
          <Alert variant="danger">
            {error}{" "}
            <Button variant="outline-danger" size="sm" onClick={handleRefresh}>
              Reintentar
            </Button>
          </Alert>
        )}
        {isLoading && (
          <Alert variant="info">
            <Spinner animation="border" size="sm" className="me-2" /> Cargando
            rutas...
          </Alert>
        )}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Total</p>
                  <h3 className="mb-0 fw-bold">{currentRutas.length}</h3>
                </div>
                <Route size={32} color={kairosTheme.primary} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.success,
              }}
            >
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Activas</p>
                  <h3 className="mb-0 fw-bold">{countActivas}</h3>
                </div>
                <CheckCircle size={32} color={kairosTheme.success} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm stat-card card-hover"
              style={{
                borderRadius: "12px",
                borderLeftColor: kairosTheme.secondary,
              }}
            >
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Inactivas</p>
                  <h3 className="mb-0 fw-bold">
                    {currentRutas.length - countActivas}
                  </h3>
                </div>
                <XCircle size={32} color={kairosTheme.secondary} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card
          className="border-0 shadow-sm mb-4"
          style={{ borderRadius: "12px" }}
        >
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <Search size={20} color={kairosTheme.primary} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filterEstatus}
                  onChange={(e) => setFilterEstatus(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="active">Activas</option>
                  <option value="inactive">Inactivas</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card
          className="border-0 shadow-sm"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <div className="table-responsive">
            <Table className="align-middle mb-0" style={{ minWidth: "1200px" }}>
              <thead style={{ backgroundColor: kairosTheme.light }}>
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Origen</th>
                  <th className="p-3">Paradas Intermedias</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRutas.map((r) => {
                  const isActive =
                    r.estatus === "Activa" ||
                    r.estatus === "Abierto" ||
                    r.estatus === true;
                  return (
                    <tr key={r.idRuta} className="table-row-hover">
                      <td className="p-3">
                        <Badge bg="light" text="dark">
                          #{r.idRuta}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="fw-bold">{r.nombre}</div>
                        <small
                          className="text-muted text-truncate d-block"
                          style={{ maxWidth: "200px" }}
                        >
                          {r.descripcion}
                        </small>
                      </td>
                      <td className="p-3">
                        {renderUbicacion(
                          r.idLugarInicio,
                          r.latitudInicio,
                          r.longitudInicio,
                          r.idLugarInicioNavigation
                        )}
                      </td>
                      <td className="p-3">
                        {renderParadasIntermedias(r.rutasLugares)}
                      </td>
                      <td className="p-3">
                        {renderUbicacion(
                          r.idLugarFin,
                          r.latitudFin,
                          r.longitudFin,
                          r.idLugarFinNavigation
                        )}
                      </td>
                      <td className="p-3">
                        {r.idUsuario ? (
                          <Badge bg="info">ID: {r.idUsuario}</Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: isActive
                              ? `${kairosTheme.success}15`
                              : `${kairosTheme.danger}15`,
                            color: isActive
                              ? kairosTheme.success
                              : kairosTheme.danger,
                          }}
                        >
                          {isActive ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(r)}
                            className="btn-action"
                            style={{
                              backgroundColor: isActive
                                ? kairosTheme.success
                                : "white",
                              borderColor: isActive
                                ? kairosTheme.success
                                : kairosTheme.secondary,
                              color: isActive ? "white" : kairosTheme.secondary,
                            }}
                          >
                            <Power size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEdit(r.idRuta)}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.info,
                              color: "white",
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setConfirmingId(r.idRuta)}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.danger,
                              color: "white",
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredRutas.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="8" className="text-center p-5 text-muted">
                      No se encontraron rutas
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
      {confirmingId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            className="shadow-lg border-0 p-4"
            style={{
              borderRadius: "12px",
              borderLeft: `5px solid ${kairosTheme.danger}`,
              maxWidth: "400px",
            }}
          >
            <h5 className="fw-bold mb-3 text-danger">Confirmar Eliminación</h5>
            <p>
              ¿Estás seguro de que deseas eliminar la ruta{" "}
              <b>#{confirmingId}</b>?
            </p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="outline-secondary"
                onClick={() => setConfirmingId(null)}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={executeDelete}>
                Eliminar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
};

const GestionRutas = () => (
  <RutasState>
    <GestionRutasContent />
  </RutasState>
);

export default GestionRutas;
