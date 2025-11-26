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
} from "react-bootstrap";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  X,
  CheckCircle,
  XCircle,
  Save,
  Search,
  MapPin,
  Building,
  RefreshCw,
  Power,
  Image as ImageIcon, // Icono para imagen
} from "lucide-react";

// --- 1. CONTEXTO Y REDUCER ---

const PromocionesContext = createContext();

const GET_PROMOCIONES = "GET_PROMOCIONES";
const GET_LUGARES_AUX = "GET_LUGARES_AUX";
const GET_SOCIOS_AUX = "GET_SOCIOS_AUX";
const CREATE_PROMOCION = "CREATE_PROMOCION";
const UPDATE_PROMOCION = "UPDATE_PROMOCION";
const DELETE_PROMOCION = "DELETE_PROMOCION";

const extractData = (payload) => {
  if (payload && payload.$values) return payload.$values;
  return payload;
};

const PromocionesReducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case GET_PROMOCIONES:
      return {
        ...state,
        promociones: Array.isArray(extractData(payload))
          ? extractData(payload)
          : [],
      };
    case GET_LUGARES_AUX:
      return {
        ...state,
        lugares: Array.isArray(extractData(payload))
          ? extractData(payload)
          : [],
      };
    case GET_SOCIOS_AUX:
      return {
        ...state,
        socios: Array.isArray(extractData(payload)) ? extractData(payload) : [],
      };
    case CREATE_PROMOCION:
      return state;
    case UPDATE_PROMOCION:
      return state;
    case DELETE_PROMOCION:
      return {
        ...state,
        promociones: state.promociones.filter((p) => p.idPromocion !== payload),
      };
    default:
      return state;
  }
};

// --- 2. STATE ---

const API_PROMOCIONES = "http://localhost:5219/api/Promociones";
const API_LUGARES = "http://localhost:5219/api/Lugares";
const API_SOCIOS = "http://localhost:5219/api/SociosAfiliados";

const PromocionesState = ({ children }) => {
  const initialState = { promociones: [], lugares: [], socios: [] };
  const [state, dispatch] = useReducer(PromocionesReducer, initialState);

  const getPromociones = async () => {
    try {
      const res = await axios.get(API_PROMOCIONES);
      dispatch({ type: GET_PROMOCIONES, payload: res.data });
    } catch (error) {
      console.error("Error obteniendo promociones:", error);
      throw error;
    }
  };

  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES);
      dispatch({ type: GET_LUGARES_AUX, payload: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  const getSocios = async () => {
    try {
      const res = await axios.get(API_SOCIOS);
      dispatch({ type: GET_SOCIOS_AUX, payload: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  const createPromocion = async (data) => {
    try {
      const res = await axios.post(API_PROMOCIONES, data);
      dispatch({ type: CREATE_PROMOCION, payload: res.data });
    } catch (error) {
      console.error("Error creando promoción:", error);
      throw error;
    }
  };

  const updatePromocion = async (id, data) => {
    try {
      const dataToSend = { ...data, idPromocion: id };
      await axios.put(`${API_PROMOCIONES}/${id}`, dataToSend);
      dispatch({ type: UPDATE_PROMOCION, payload: dataToSend });
    } catch (error) {
      console.error("Error actualizando promoción:", error);
      throw error;
    }
  };

  const deletePromocion = async (id) => {
    try {
      await axios.delete(`${API_PROMOCIONES}/${id}`);
      dispatch({ type: DELETE_PROMOCION, payload: id });
    } catch (error) {
      console.error("Error eliminando promoción:", error);
      throw error;
    }
  };

  return (
    <PromocionesContext.Provider
      value={{
        promociones: state.promociones,
        lugares: state.lugares,
        socios: state.socios,
        getPromociones,
        getLugares,
        getSocios,
        createPromocion,
        updatePromocion,
        deletePromocion,
      }}
    >
      {children}
    </PromocionesContext.Provider>
  );
};

// --- 3. UI ---

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
      <Tag size={20} /> <span>{message.text}</span>
    </div>
  );
};

const PromocionModal = ({
  show,
  handleClose,
  savePromocion,
  promocion,
  lugares,
  socios,
  loading,
}) => {
  const isEditing = promocion !== null;
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: "", // Nuevo campo en estado
    idLugar: "",
    idSocio: "",
    fechaInicio: "",
    fechaFin: "",
    estatus: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (promocion && show) {
      setFormData({
        idPromocion: promocion.idPromocion,
        titulo: promocion.titulo || "",
        descripcion: promocion.descripcion || "",
        imagen: promocion.imagen || "", // Cargar imagen al editar
        idLugar: promocion.idLugar || "",
        idSocio: promocion.idSocio || "",
        fechaInicio: promocion.fechaInicio
          ? promocion.fechaInicio.split("T")[0]
          : "",
        fechaFin: promocion.fechaFin ? promocion.fechaFin.split("T")[0] : "",
        estatus: promocion.estatus ?? true,
      });
    } else if (!show) {
      setFormData({
        titulo: "",
        descripcion: "",
        imagen: "", // Resetear imagen
        idLugar: "",
        idSocio: "",
        fechaInicio: "",
        fechaFin: "",
        estatus: true,
      });
      setFormErrors({});
    }
  }, [promocion, show]);

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo.trim()) errors.titulo = "El título es requerido";
    if (!formData.idLugar) errors.idLugar = "Seleccione un lugar";
    if (!formData.fechaInicio) errors.fechaInicio = "Fecha inicio requerida";
    if (!formData.fechaFin) errors.fechaFin = "Fecha fin requerida";
    else if (
      formData.fechaInicio &&
      formData.fechaFin &&
      new Date(formData.fechaFin) <= new Date(formData.fechaInicio)
    ) {
      errors.fechaFin = "La fecha fin debe ser posterior a la de inicio";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSend = {
      ...formData,
      idLugar: parseInt(formData.idLugar),
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
              <Pencil className="me-2" color={kairosTheme.info} /> Editar
              Promoción
            </>
          ) : (
            <>
              <Plus className="me-2" color={kairosTheme.primary} /> Nueva
              Promoción
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          {/* Fila Titulo e Imagen */}
          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Tag size={16} className="me-1" /> Título *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. 2x1 en Cenas"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                isInvalid={!!formErrors.titulo}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.titulo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <ImageIcon size={16} className="me-1" /> URL Imagen
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. uploads/promo.jpg o https://..."
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Building size={16} className="me-1" /> Descripción
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Detalles de la promoción..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <MapPin size={16} className="me-1" /> Lugar *
              </Form.Label>
              <Form.Select
                name="idLugar"
                value={formData.idLugar}
                onChange={handleChange}
                isInvalid={!!formErrors.idLugar}
              >
                <option value="">Seleccionar...</option>
                {lugares.map((l) => (
                  <option key={l.idLugar} value={l.idLugar}>
                    {l.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.idLugar}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Building size={16} className="me-1" /> Socio Afiliado
              </Form.Label>
              <Form.Select
                name="idSocio"
                value={formData.idSocio}
                onChange={handleChange}
              >
                <option value="">Ninguno</option>
                {socios.map((s) => (
                  <option key={s.idSocio} value={s.idSocio}>
                    {s.nombreSocio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Calendar size={16} className="me-1" /> Inicio *
              </Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                isInvalid={!!formErrors.fechaInicio}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.fechaInicio}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">
                <Calendar size={16} className="me-1" /> Fin *
              </Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                isInvalid={!!formErrors.fechaFin}
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
                <span className="fw-semibold">
                  {formData.estatus ? "Promoción Activa" : "Promoción Inactiva"}
                </span>
              }
              checked={formData.estatus}
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
          <X size={16} className="me-1" /> Cancelar
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
            <Save size={16} className="me-2" />
          )}{" "}
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionPromocionesContent = () => {
  const {
    promociones,
    lugares,
    socios,
    getPromociones,
    getLugares,
    getSocios,
    createPromocion,
    updatePromocion,
    deletePromocion,
  } = useContext(PromocionesContext);
  const [loading, setLoading] = useState({ data: false, action: false });
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [promocionToEdit, setPromocionToEdit] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");

  const loadData = async () => {
    if (loading.data) return;
    setLoading((p) => ({ ...p, data: true }));
    try {
      await Promise.all([getPromociones(), getLugares(), getSocios()]);
    } catch (e) {
      showMessage("Error de conexión", "danger");
    } finally {
      setLoading((p) => ({ ...p, data: false }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };
  const handleCreate = () => {
    setPromocionToEdit(null);
    setShowModal(true);
  };
  const handleEdit = (id) => {
    const p = promociones.find((x) => x.idPromocion === id);
    if (p) {
      setPromocionToEdit(p);
      setShowModal(true);
    }
  };

  const handleToggleStatus = async (promocion) => {
    if (loading.action) return;
    setLoading((p) => ({ ...p, action: true }));
    try {
      const dataClean = {
        idPromocion: promocion.idPromocion,
        idLugar: promocion.idLugar,
        idSocio: promocion.idSocio,
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        imagen: promocion.imagen, // No olvidar incluir la imagen al cambiar estatus
        fechaInicio: promocion.fechaInicio,
        fechaFin: promocion.fechaFin,
        estatus: !promocion.estatus,
      };
      await updatePromocion(promocion.idPromocion, dataClean);
      showMessage(
        `Promoción ${!promocion.estatus ? "activada" : "desactivada"}`,
        "success"
      );
      await getPromociones();
    } catch (e) {
      showMessage("Error al cambiar estatus", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const savePromocion = async (data, isEditing) => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      if (isEditing) await updatePromocion(data.idPromocion, data);
      else await createPromocion(data);
      showMessage("Guardado exitosamente", "success");
      setShowModal(false);
      await getPromociones();
    } catch (e) {
      showMessage("Error al guardar", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const executeDelete = async () => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      await deletePromocion(confirmingId);
      showMessage("Eliminado exitosamente", "success");
      setConfirmingId(null);
      await getPromociones();
    } catch (e) {
      showMessage("Error al eliminar", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d)
      ? "Inválida"
      : d.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const getNombreLugar = (id) =>
    lugares.find((l) => l.idLugar === id)?.nombre || `ID: ${id}`;
  const getNombreSocio = (id) =>
    socios.find((s) => s.idSocio === id)?.nombreSocio || "N/A";

  const filteredPromociones = promociones.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchText = (p.titulo || "").toLowerCase().includes(term);
    const matchStatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && p.estatus) ||
      (filterEstatus === "inactive" && !p.estatus);
    return matchText && matchStatus;
  });

  return (
    <Container
      fluid
      style={{
        backgroundColor: kairosTheme.bodyBg,
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <style>{`.btn-action:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }`}</style>
      <PromocionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        savePromocion={savePromocion}
        promocion={promocionToEdit}
        lugares={lugares}
        socios={socios}
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
                    Administra las campañas y descuentos.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={loadData}
                  disabled={loading.data}
                  style={{
                    backgroundColor: kairosTheme.info,
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                  className="btn-action"
                >
                  <RefreshCw size={20} className="me-2" /> Recargar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading.data}
                  style={{
                    backgroundColor: kairosTheme.white,
                    color: kairosTheme.primary,
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 700,
                  }}
                  className="btn-action"
                >
                  <Plus size={20} className="me-2" /> Nueva
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="mb-4 g-3">
          {/* Tarjetas de Resumen (Sin cambios) */}
          <Col md={4}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "12px",
                borderLeft: `4px solid ${kairosTheme.primary}`,
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Total</p>
                  <h3 className="mb-0 fw-bold">{promociones.length}</h3>
                </div>
                <Tag size={32} color={kairosTheme.primary} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "12px",
                borderLeft: `4px solid ${kairosTheme.success}`,
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Activas</p>
                  <h3 className="mb-0 fw-bold">
                    {promociones.filter((p) => p.estatus).length}
                  </h3>
                </div>
                <CheckCircle size={32} color={kairosTheme.success} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "12px",
                borderLeft: `4px solid ${kairosTheme.danger}`,
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Inactivas</p>
                  <h3 className="mb-0 fw-bold">
                    {promociones.filter((p) => !p.estatus).length}
                  </h3>
                </div>
                <XCircle size={32} color={kairosTheme.danger} />
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
                    placeholder="Buscar promoción..."
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
                  <option value="active">Activas</option>
                  <option value="inactive">Inactivas</option>
                </Form.Select>
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
                  <p className="mb-0">¿Estás seguro?</p>
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
            {loading.data ? (
              <div className="text-center p-5">
                <Spinner
                  animation="border"
                  style={{ color: kairosTheme.primary }}
                />
              </div>
            ) : (
              <Table
                className="align-middle mb-0"
                style={{ minWidth: "1000px" }}
              >
                <thead style={{ backgroundColor: kairosTheme.light }}>
                  <tr>
                    <th className="p-3 text-center">Imagen</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Lugar</th>
                    <th className="p-3">Socio</th>
                    <th className="p-3">Vigencia</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromociones.map((p) => (
                    <tr key={p.idPromocion} style={{ transition: "0.2s" }}>
                      <td className="p-3 text-center">
                        {p.imagen ? (
                          <img
                            src={p.imagen}
                            alt="promo"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #dee2e6",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px",
                              backgroundColor: "#f1f3f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto",
                              color: "#adb5bd",
                            }}
                          >
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="fw-bold">{p.titulo}</div>
                        <small className="text-muted">
                          {p.descripcion?.substring(0, 40)}...
                        </small>
                      </td>
                      <td className="p-3">
                        <Badge bg="secondary">
                          {getNombreLugar(p.idLugar)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {p.idSocio ? (
                          <Badge bg="info">{getNombreSocio(p.idSocio)}</Badge>
                        ) : (
                          <span className="text-muted small">N/A</span>
                        )}
                      </td>
                      <td className="p-3 small">
                        <div>{formatDateTime(p.fechaInicio)}</div>
                        <div>{formatDateTime(p.fechaFin)}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          style={{
                            padding: "0.3rem 0.8rem",
                            borderRadius: "20px",
                            backgroundColor: p.estatus
                              ? `${kairosTheme.success}15`
                              : `${kairosTheme.danger}15`,
                            color: p.estatus
                              ? kairosTheme.success
                              : kairosTheme.danger,
                            fontWeight: 600,
                          }}
                        >
                          {p.estatus ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(p)}
                            className="btn-action"
                            style={{
                              backgroundColor: p.estatus
                                ? "white"
                                : kairosTheme.success,
                              borderColor: kairosTheme.success,
                              color: p.estatus
                                ? kairosTheme.secondary
                                : "white",
                            }}
                          >
                            <Power size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEdit(p.idPromocion)}
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
                            onClick={() => setConfirmingId(p.idPromocion)}
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
                  ))}
                  {filteredPromociones.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center p-5 text-muted">
                        No hay promociones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
        </Card>
      </Container>
    </Container>
  );
};

const GestionPromociones = () => (
  <PromocionesState>
    <GestionPromocionesContent />
  </PromocionesState>
);

export default GestionPromociones;
