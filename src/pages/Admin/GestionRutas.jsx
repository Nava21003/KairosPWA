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
  Map,
  Navigation,
  User,
  Calendar,
  AlignLeft,
  Route,
  MapPin,
  Globe,
} from "lucide-react";

const RutasContext = createContext();

const GET_RUTAS = "GET_RUTAS";
const GET_LUGARES_PARA_RUTAS = "GET_LUGARES_PARA_RUTAS";
const CREATE_RUTA = "CREATE_RUTA";
const UPDATE_RUTA = "UPDATE_RUTA";
const DELETE_RUTA = "DELETE_RUTA";

const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const RutasReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_RUTAS: {
      const data = extractData(payload);
      return {
        ...state,
        rutas: Array.isArray(data) ? data : [],
      };
    }
    case GET_LUGARES_PARA_RUTAS: {
      const data = extractData(payload);
      return {
        ...state,
        lugaresDisponibles: Array.isArray(data) ? data : [],
      };
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
      throw error;
    }
  };

  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES_PARA_RUTAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener lugares para rutas:", error);
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
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
      setModoDefinicion("lugares");
    }
  }, [ruta, show]);

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";

    if (modoDefinicion === "coordenadas") {
      if (!formData.latitudInicio || !formData.longitudInicio) {
        errors.coordenadasInicio = "Latitud y Longitud de inicio requeridas";
      }
      if (!formData.latitudFin || !formData.longitudFin) {
        errors.coordenadasFin = "Latitud y Longitud de fin requeridas";
      }
    } else {
      if (!formData.idLugarInicio)
        errors.idLugarInicio = "Selecciona lugar de inicio";
      if (!formData.idLugarFin) errors.idLugarFin = "Selecciona lugar de fin";
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

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      idUsuario: formData.idUsuario ? parseInt(formData.idUsuario) : null,

      latitudInicio:
        modoDefinicion === "coordenadas"
          ? parseFloat(formData.latitudInicio)
          : null,
      longitudInicio:
        modoDefinicion === "coordenadas"
          ? parseFloat(formData.longitudInicio)
          : null,
      latitudFin:
        modoDefinicion === "coordenadas"
          ? parseFloat(formData.latitudFin)
          : null,
      longitudFin:
        modoDefinicion === "coordenadas"
          ? parseFloat(formData.longitudFin)
          : null,

      idLugarInicio:
        modoDefinicion === "lugares" ? parseInt(formData.idLugarInicio) : null,
      idLugarFin:
        modoDefinicion === "lugares" ? parseInt(formData.idLugarFin) : null,
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
        <Form onSubmit={handleSubmit}>
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
          <h6 className="text-muted fw-bold mb-3">Definición de Trayecto</h6>

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
                    modoDefinicion === "lugares" ? kairosTheme.primary : "",
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
                    modoDefinicion === "coordenadas" ? kairosTheme.primary : "",
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
                    {lugares.map((l) => (
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
                    {lugares.map((l) => (
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
                    <strong className="text-primary">Punto A (Inicio)</strong>
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
                <Form.Control.Feedback type="invalid" className="d-block mb-3">
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
            <Col md={6}>
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
      setError("Verifica que la API esté activa.");
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
      const rutaLimpia = { ...ruta, estatus: nuevoEstatus };
      await updateRuta(ruta.idRuta, rutaLimpia);
      showMessage(
        `Ruta ${nuevoEstatus === "Activa" ? "activada" : "desactivada"} correctamente`,
        "success"
      );
      await getRutas();
    } catch (error) {
      showMessage(`Error: ${error.message}`, "danger");
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
      showMessage(`Error: ${error.message}`, "danger");
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
      showMessage("Error al eliminar ruta", "danger");
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
    if (idLugar && navProp) {
      return (
        <Badge bg="primary">
          <MapPin size={12} className="me-1" /> {navProp.nombre}
        </Badge>
      );
    }
    if (lat && lon) {
      return (
        <Badge bg="secondary">
          <Globe size={12} className="me-1" /> {lat.toFixed(4)},{" "}
          {lon.toFixed(4)}
        </Badge>
      );
    }
    return <span className="text-muted small">N/A</span>;
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
                <Map size={40} className="me-3" />
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
            <Table className="align-middle mb-0" style={{ minWidth: "1000px" }}>
              <thead style={{ backgroundColor: kairosTheme.light }}>
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Origen</th>
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
                                ? "white"
                                : kairosTheme.success,
                              borderColor: kairosTheme.success,
                              color: isActive ? kairosTheme.secondary : "white",
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
                    <td colSpan="7" className="text-center p-5 text-muted">
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
