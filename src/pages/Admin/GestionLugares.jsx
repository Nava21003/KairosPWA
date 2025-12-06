import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  createContext,
  useRef,
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
  RefreshCw,
  Power,
  MapPin,
  Clock,
  Info,
  Star,
  Map,
  Globe,
  AlignLeft,
  Image as ImageIcon,
  Camera,
  Award,
} from "lucide-react";

const API_BASE_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net";
const API_LUGARES_URL = `${API_BASE_URL}/api/Lugares`;
const API_CATEGORIAS_URL = `${API_BASE_URL}/api/Categorias`;

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150?text=Sin+Foto";
  if (path.startsWith("data:image")) return path;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

const LugaresContext = createContext();
const GET_LUGARES = "GET_LUGARES";
const GET_CATEGORIAS = "GET_CATEGORIAS";
const CREATE_LUGAR = "CREATE_LUGAR";
const UPDATE_LUGAR = "UPDATE_LUGAR";
const DELETE_LUGAR = "DELETE_LUGAR";

const extractData = (payload) => {
  if (payload && payload.$values) {
    return payload.$values;
  }
  return payload;
};

const LugaresReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_LUGARES: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        lugares: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    case GET_CATEGORIAS: {
      const dataToUse = extractData(payload);
      return {
        ...state,
        categorias: Array.isArray(dataToUse) ? dataToUse : [],
      };
    }
    case CREATE_LUGAR:
      return state;
    case UPDATE_LUGAR:
      return state;
    case DELETE_LUGAR: {
      const idToDelete = payload;
      return {
        ...state,
        lugares: state.lugares.filter((lugar) => lugar.idLugar !== idToDelete),
      };
    }
    default:
      return state;
  }
};

const LugaresState = ({ children }) => {
  const initialState = {
    lugares: [],
    categorias: [],
  };

  const [state, dispatch] = useReducer(LugaresReducer, initialState);

  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error al obtener lugares:", error);
      throw error;
    }
  };

  const getCategorias = async () => {
    try {
      const res = await axios.get(API_CATEGORIAS_URL);
      dispatch({ type: GET_CATEGORIAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const createLugar = async (lugarData) => {
    try {
      const response = await axios.post(API_LUGARES_URL, lugarData);
      dispatch({ type: CREATE_LUGAR, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error al crear lugar:", error);
      throw error;
    }
  };

  const updateLugar = async (id, lugarData) => {
    try {
      const dataToSend = { ...lugarData, idLugar: id };
      await axios.put(`${API_LUGARES_URL}/${id}`, dataToSend);
      dispatch({ type: UPDATE_LUGAR, payload: dataToSend });
      return true;
    } catch (error) {
      console.error("Error al actualizar lugar:", error);
      throw error;
    }
  };

  const deleteLugar = async (id) => {
    try {
      await axios.delete(`${API_LUGARES_URL}/${id}`);
      dispatch({ type: DELETE_LUGAR, payload: id });
    } catch (error) {
      console.error("Error al eliminar lugar:", error);
      throw error;
    }
  };

  return (
    <LugaresContext.Provider
      value={{
        lugares: state.lugares,
        categorias: state.categorias,
        getLugares,
        getCategorias,
        createLugar,
        updateLugar,
        deleteLugar,
      }}
    >
      {children}
    </LugaresContext.Provider>
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
    info: <MapPin size={20} />,
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

const LugarModal = ({
  show,
  handleClose,
  saveLugar,
  lugar,
  loading,
  categorias,
}) => {
  const isEditing = lugar !== null;
  const fileInputRef = useRef(null);

  const initialFormData = {
    nombre: "",
    descripcion: "",
    idCategoria: "",
    latitud: "",
    longitud: "",
    direccion: "",
    horario: "",
    imagen: "",
    puntosOtorgados: 10,
    esPatrocinado: false,
    estatus: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (lugar && show) {
      setFormData({
        idLugar: lugar.idLugar,
        nombre: lugar.nombre || "",
        descripcion: lugar.descripcion || "",
        idCategoria: lugar.idCategoria || "",
        latitud: lugar.latitud || "",
        longitud: lugar.longitud || "",
        direccion: lugar.direccion || "",
        horario: lugar.horario || "",
        imagen: lugar.imagen || "",
        puntosOtorgados: lugar.puntosOtorgados ?? 10,
        esPatrocinado: lugar.esPatrocinado ?? false,
        estatus: lugar.estatus ?? true,
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [lugar, show]);

  const validateForm = () => {
    const errors = {};
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    } else if (!regexSoloLetras.test(formData.nombre)) {
      errors.nombre =
        "El nombre no puede llevar números ni caracteres especiales";
    }

    if (!formData.direccion.trim())
      errors.direccion = "La dirección es requerida";
    if (!formData.idCategoria) errors.idCategoria = "Selecciona una categoría";

    if (formData.puntosOtorgados < 0)
      errors.puntosOtorgados = "No puede ser negativo";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagen: reader.result,
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
    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      idCategoria: formData.idCategoria ? parseInt(formData.idCategoria) : null,
      latitud: formData.latitud ? parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? parseFloat(formData.longitud) : null,
      puntosOtorgados: formData.puntosOtorgados
        ? parseInt(formData.puntosOtorgados)
        : 0,
    };

    saveLugar(dataToSend, isEditing);
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
              Editar Lugar
            </>
          ) : (
            <>
              <Plus className="me-2" style={{ color: kairosTheme.primary }} />
              Nuevo Lugar
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center mb-4">
            <div className="position-relative">
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `4px solid ${kairosTheme.light}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.imagen ? (
                  <img
                    src={getImageUrl(formData.imagen)}
                    alt="Lugar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                ) : (
                  <ImageIcon size={60} color="#adb5bd" />
                )}
              </div>
              <Button
                size="sm"
                onClick={triggerFileInput}
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  right: "-5px",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: kairosTheme.primary,
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                <Camera size={20} />
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
            <Form.Group as={Col} md={8}>
              <Form.Label className="fw-semibold">
                <MapPin size={16} className="me-1" /> Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del lugar"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                isInvalid={!!formErrors.nombre}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>

              <Form.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                Solo se permiten letras y espacios (sin números ni símbolos).
              </Form.Text>
            </Form.Group>

            <Form.Group as={Col} md={4}>
              <Form.Label className="fw-semibold">
                <Hash size={16} className="me-1" /> Categoría *
              </Form.Label>
              <Form.Select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                isInvalid={!!formErrors.idCategoria}
              >
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.idCategoria}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/* Reduje el ancho de Dirección para meter Puntos */}
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Map size={16} className="me-1" /> Dirección *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Calle, Número, Colonia"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                isInvalid={!!formErrors.direccion}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.direccion}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={3}>
              <Form.Label className="fw-semibold">
                <Clock size={16} className="me-1" /> Horario
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. 09:00 - 18:00"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
              />
            </Form.Group>

            {/* --- NUEVO CAMPO: PUNTOS OTORGADOS --- */}
            <Form.Group as={Col} md={3}>
              <Form.Label className="fw-semibold">
                <Award size={16} className="me-1" /> Puntos
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="10"
                  name="puntosOtorgados"
                  value={formData.puntosOtorgados}
                  onChange={handleChange}
                  isInvalid={!!formErrors.puntosOtorgados}
                />
                <InputGroup.Text className="text-muted small">
                  pts
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {/* ------------------------------------ */}
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Latitud</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="20.123456"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Longitud</Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="-101.123456"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Info size={16} className="me-1" /> Descripción
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Descripción del lugar..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  name="estatus"
                  id="estatus-switch"
                  label={
                    <span className="d-flex align-items-center fw-semibold">
                      <CheckCircle
                        size={18}
                        className="me-2"
                        style={{
                          color: formData.estatus
                            ? kairosTheme.success
                            : kairosTheme.danger,
                        }}
                      />
                      {formData.estatus ? "Lugar Abierto" : "Lugar Cerrado"}
                    </span>
                  }
                  checked={formData.estatus}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  name="esPatrocinado"
                  id="patrocinado-switch"
                  label={
                    <span className="d-flex align-items-center fw-semibold">
                      <Star
                        size={18}
                        className="me-2"
                        style={{
                          color: formData.esPatrocinado
                            ? kairosTheme.warning
                            : kairosTheme.secondary,
                        }}
                      />
                      {formData.esPatrocinado
                        ? "Es Patrocinado"
                        : "No Patrocinado"}
                    </span>
                  }
                  checked={formData.esPatrocinado}
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
          {isEditing ? "Guardar Cambios" : "Crear Lugar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionLugaresContent = () => {
  const {
    lugares = [],
    categorias = [],
    getLugares,
    getCategorias,
    createLugar,
    updateLugar,
    deleteLugar,
  } = useContext(LugaresContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lugarToEdit, setLugarToEdit] = useState(null);
  const [loading, setLoading] = useState({ lugares: false, action: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.lugares) return;
    setLoading((prev) => ({ ...prev, lugares: true }));
    setError(null);
    try {
      await Promise.all([getLugares(), getCategorias()]);
      setDataLoaded(true);
    } catch (error) {
      setError("Verifica que la API esté activa.");
      showMessage("Error al cargar los datos", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, lugares: false }));
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
    setLugarToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const lugar = lugares.find((l) => l.idLugar === id);
    if (lugar) {
      setLugarToEdit(lugar);
      setShowModal(true);
    } else {
      showMessage("Lugar no encontrado", "danger");
    }
  };

  const handleToggleStatus = async (lugar) => {
    if (loading.action) return;
    const nuevoEstatus = !lugar.estatus;
    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const lugarLimpio = {
        idLugar: lugar.idLugar,
        nombre: lugar.nombre,
        descripcion: lugar.descripcion,
        idCategoria: lugar.idCategoria,
        latitud: lugar.latitud,
        longitud: lugar.longitud,
        direccion: lugar.direccion,
        horario: lugar.horario,
        imagen: lugar.imagen,
        puntosOtorgados: lugar.puntosOtorgados,
        esPatrocinado: lugar.esPatrocinado,
        estatus: nuevoEstatus,
      };

      await updateLugar(lugar.idLugar, lugarLimpio);
      showMessage(
        `Lugar ${nuevoEstatus ? "activado" : "desactivado"} correctamente`,
        "success"
      );
      await getLugares();
    } catch (error) {
      showMessage(`Error al cambiar estatus: ${error.message}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLugarToEdit(null);
  };

  const saveLugar = async (lugarData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateLugar(lugarData.idLugar, lugarData);
        showMessage("Lugar actualizado exitosamente", "success");
      } else {
        await createLugar(lugarData);
        showMessage("Lugar creado exitosamente", "success");
      }
      handleCloseModal();
      await getLugares();
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
      await deleteLugar(idToDelete);
      showMessage("Lugar eliminado exitosamente", "success");
      await getLugares();
    } catch (error) {
      showMessage("Error al eliminar lugar", "danger");
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentLugares = Array.isArray(lugares) ? lugares : [];
  const filteredLugares = currentLugares.filter((lugar) => {
    const nombre = (lugar.nombre || "").toLowerCase();
    const direccion = (lugar.direccion || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(search) || direccion.includes(search);
    const matchesEstatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && lugar.estatus) ||
      (filterEstatus === "inactive" && !lugar.estatus) ||
      (filterEstatus === "sponsored" && lugar.esPatrocinado);
    return matchesSearch && matchesEstatus;
  });

  const isLoading = loading.lugares && !dataLoaded;

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

      <LugarModal
        show={showModal}
        handleClose={handleCloseModal}
        saveLugar={saveLugar}
        lugar={lugarToEdit}
        loading={loading.action}
        categorias={categorias}
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
                <MapPin size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Lugares
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra los puntos de interés, fotos, puntos otorgados y
                    detalles.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.lugares}
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
                  disabled={loading.lugares}
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
                  <Plus className="me-2" size={20} /> Nueva Lugar
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>Error</Alert.Heading>
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
            Cargando lugares...
          </Alert>
        )}

        {/* STATS CARDS */}
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
                  <p className="text-muted mb-1 fw-semibold">Total Lugares</p>
                  <h3 className="mb-0 fw-bold">{currentLugares.length}</h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.primary}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Map size={32} style={{ color: kairosTheme.primary }} />
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
                  <p className="text-muted mb-1 fw-semibold">Patrocinados</p>
                  <h3 className="mb-0 fw-bold">
                    {currentLugares.filter((l) => l.esPatrocinado).length}
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: `${kairosTheme.warning}20`,
                    padding: "1rem",
                    borderRadius: "12px",
                  }}
                >
                  <Star size={32} style={{ color: kairosTheme.warning }} />
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
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Activos</p>
                  <h3 className="mb-0 fw-bold">
                    {currentLugares.filter((l) => l.estatus).length}
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
        </Row>

        {/* FILTERS CARD */}
        <Card
          className="border-0 shadow-sm mb-4 card-hover"
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
                    placeholder="Buscar por nombre o dirección..."
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
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                  <option value="sponsored">Patrocinados</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Confirm Delete */}
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
                    ¿Estás seguro? ID: <b>{confirmingId}</b>
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
            <Table className="align-middle mb-0" style={{ minWidth: "1200px" }}>
              <thead style={{ backgroundColor: kairosTheme.light }}>
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3 text-center">
                    <ImageIcon size={16} /> Foto
                  </th>
                  <th className="p-3">
                    <div className="d-flex align-items-center">
                      <MapPin size={16} className="me-2" /> Lugar
                    </div>
                  </th>
                  <th className="p-3">Categoría</th>
                  {/* --- NUEVA COLUMNA PUNTOS --- */}
                  <th className="p-3 text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <Award size={16} className="me-2" /> Puntos
                    </div>
                  </th>
                  {/* --------------------------- */}
                  <th className="p-3">
                    <div className="d-flex align-items-center">
                      <Clock size={16} className="me-2" /> Horario
                    </div>
                  </th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3 text-center">Patrocinado</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLugares.map((l) => (
                  <tr key={l.idLugar} className="table-row-hover">
                    <td className="p-3">
                      <Badge bg="light" text="dark">
                        #{l.idLugar}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          margin: "0 auto",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        <img
                          src={getImageUrl(l.imagen)}
                          alt={l.nombre}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=IMG";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="fw-bold">{l.nombre}</div>
                      <div
                        className="text-truncate small text-muted"
                        style={{ maxWidth: "150px" }}
                      >
                        {l.descripcion}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge bg="info">
                        {l.idCategoriaNavigation?.nombre ||
                          `ID: ${l.idCategoria}`}
                      </Badge>
                    </td>

                    {/* --- CELDA DE PUNTOS --- */}
                    <td className="p-3 text-center">
                      <Badge
                        bg="warning"
                        text="dark"
                        className="d-inline-flex align-items-center"
                      >
                        <Award size={12} className="me-1" />+
                        {l.puntosOtorgados || 10} pts
                      </Badge>
                    </td>
                    {/* ----------------------- */}

                    <td className="p-3">
                      <small className="text-muted font-monospace">
                        {l.horario || "N/A"}
                      </small>
                    </td>
                    <td className="p-3">
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "150px" }}
                        title={l.direccion}
                      >
                        {l.direccion}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {l.esPatrocinado && (
                        <Star
                          size={18}
                          fill={kairosTheme.warning}
                          color={kairosTheme.warning}
                        />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: l.estatus
                            ? `${kairosTheme.success}15`
                            : `${kairosTheme.danger}15`,
                          color: l.estatus
                            ? kairosTheme.success
                            : kairosTheme.danger,
                        }}
                      >
                        {l.estatus ? "Abierto" : "Cerrado"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          size="sm"
                          onClick={() => handleToggleStatus(l)}
                          className="btn-action"
                          style={{
                            backgroundColor: l.estatus
                              ? kairosTheme.success
                              : kairosTheme.white,

                            borderColor: l.estatus
                              ? kairosTheme.success
                              : kairosTheme.secondary,

                            color: l.estatus
                              ? kairosTheme.white
                              : kairosTheme.secondary,
                          }}
                          title={
                            l.estatus ? "Desactivar Lugar" : "Activar Lugar"
                          }
                        >
                          <Power size={16} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(l.idLugar)}
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
                          onClick={() => setConfirmingId(l.idLugar)}
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
                {filteredLugares.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="11" className="text-center p-5 text-muted">
                      No se encontraron lugares
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

const GestionLugares = () => (
  <LugaresState>
    <GestionLugaresContent />
  </LugaresState>
);

export default GestionLugares;
