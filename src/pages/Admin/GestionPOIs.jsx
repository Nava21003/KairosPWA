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
  MapPin,
  Award,
  Trophy,
  SortAsc,
  AlignLeft,
} from "lucide-react";

import PuntosInteresState from "../../Context/PuntosInteres/PuntosInteresState";
import PuntosInteresContext from "../../Context/PuntosInteres/PuntosInteresContext";

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
      <Award size={20} /> <span>{message.text}</span>
    </div>
  );
};

const POIModal = ({ show, handleClose, savePOI, poi, lugares, loading }) => {
  const isEditing = poi !== null;
  const [formData, setFormData] = useState({
    idLugar: "",
    etiqueta: "",
    descripcion: "",
    prioridad: 0,
    estatus: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (poi && show) {
      setFormData({
        idPunto: poi.idPunto,
        idLugar: poi.idLugar,
        etiqueta: poi.etiqueta || "",
        descripcion: poi.descripcion || "",
        prioridad: poi.prioridad || 0,
        estatus: poi.estatus ?? true,
      });
    } else if (!show) {
      setFormData({
        idLugar: "",
        etiqueta: "",
        descripcion: "",
        prioridad: 0,
        estatus: true,
      });
      setFormErrors({});
    }
  }, [poi, show]);

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
    const errors = {};
    if (!formData.idLugar) errors.idLugar = "Debes seleccionar un lugar";
    if (!formData.etiqueta.trim()) errors.etiqueta = "La etiqueta es requerida";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const dataToSend = {
      ...formData,
      idLugar: parseInt(formData.idLugar),
      prioridad: parseInt(formData.prioridad),
    };
    savePOI(dataToSend, isEditing);
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
              <Pencil className="me-2" color={kairosTheme.info} /> Editar Punto
              Destacado
            </>
          ) : (
            <>
              <Plus className="me-2" color={kairosTheme.primary} /> Nuevo Punto
              Destacado
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label className="fw-semibold">
                <MapPin size={16} className="me-1" /> Lugar a Destacar *
              </Form.Label>
              <Form.Select
                name="idLugar"
                value={formData.idLugar}
                onChange={handleChange}
                isInvalid={!!formErrors.idLugar}
                disabled={isEditing}
              >
                <option value="">Seleccionar lugar...</option>
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
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md={8}>
              <Form.Label className="fw-semibold">
                <Award size={16} className="me-1" /> Etiqueta (Badge) *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Más Visitado, Top 1, Recomendado"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
                isInvalid={!!formErrors.etiqueta}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.etiqueta}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={4}>
              <Form.Label className="fw-semibold">
                <SortAsc size={16} className="me-1" /> Prioridad
              </Form.Label>
              <Form.Control
                type="number"
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>
                Mayor número = sale primero
              </Form.Text>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <AlignLeft size={16} className="me-1" /> Descripción (Opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Por qué es destacado..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="estatus"
              id="estatus-switch"
              label={
                <span className="fw-semibold">
                  {formData.estatus
                    ? "Punto Activo (Visible)"
                    : "Punto Inactivo"}
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

const GestionPOIsContent = () => {
  // Consumimos el contexto importado (ya NO se define aquí)
  const {
    pois,
    lugaresDisponibles,
    getPOIs,
    getLugaresForSelect,
    createPOI,
    updatePOI,
    deletePOI,
  } = useContext(PuntosInteresContext);

  const [loading, setLoading] = useState({ data: false, action: false });
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [poiToEdit, setPoiToEdit] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    if (loading.data) return;
    setLoading((p) => ({ ...p, data: true }));
    try {
      await Promise.all([getPOIs(), getLugaresForSelect()]);
    } catch (e) {
      showMessage("Error de conexión", "danger");
    } finally {
      setLoading((p) => ({ ...p, data: false }));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreate = () => {
    setPoiToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const p = pois.find((x) => x.idPunto === id);
    if (p) {
      setPoiToEdit(p);
      setShowModal(true);
    }
  };

  const handleToggleStatus = async (poi) => {
    if (loading.action) return;
    setLoading((p) => ({ ...p, action: true }));
    try {
      const cleanData = { ...poi, estatus: !poi.estatus };
      delete cleanData.idLugarNavigation;
      await updatePOI(poi.idPunto, cleanData);
      showMessage(
        `Punto ${!poi.estatus ? "activado" : "desactivado"}`,
        "success"
      );
      // Opcional si tu reducer actualiza localmente, si no, recargamos:
      await getPOIs();
    } catch (e) {
      showMessage("Error al cambiar estatus", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const savePOI = async (data, isEditing) => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      if (isEditing) await updatePOI(data.idPunto, data);
      else await createPOI(data);
      showMessage("Guardado exitosamente", "success");
      setShowModal(false);
      await getPOIs();
    } catch (e) {
      showMessage("Error al guardar", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const executeDelete = async () => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      await deletePOI(confirmingId);
      showMessage("Eliminado exitosamente", "success");
      setConfirmingId(null);
      await getPOIs();
    } catch (e) {
      showMessage("Error al eliminar", "danger");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const filteredPois = pois.filter((p) => {
    const term = searchTerm.toLowerCase();
    const placeName = p.idLugarNavigation?.nombre?.toLowerCase() || "";
    const tag = p.etiqueta?.toLowerCase() || "";
    return placeName.includes(term) || tag.includes(term);
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
      <POIModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        savePOI={savePOI}
        poi={poiToEdit}
        lugares={lugaresDisponibles}
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
                <Trophy size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Puntos de Interés Destacados
                  </h1>
                  <p className="mb-0 opacity-90">
                    Gestiona los lugares más visitados y destacados.
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
                  <Plus size={20} className="me-2" /> Nuevo Destacado
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Stats */}
        <Row className="mb-4 g-3">
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
                  <p className="text-muted mb-1 fw-semibold">
                    Total Destacados
                  </p>
                  <h3 className="mb-0 fw-bold">{pois.length}</h3>
                </div>
                <Trophy size={32} color={kairosTheme.primary} />
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
                  <p className="text-muted mb-1 fw-semibold">Activos</p>
                  <h3 className="mb-0 fw-bold">
                    {pois.filter((p) => p.estatus).length}
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
                borderLeft: `4px solid ${kairosTheme.warning}`,
              }}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Alta Prioridad</p>
                  <h3 className="mb-0 fw-bold">
                    {pois.filter((p) => p.prioridad > 0).length}
                  </h3>
                </div>
                <SortAsc size={32} color={kairosTheme.warning} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card
          className="border-0 shadow-sm mb-4"
          style={{ borderRadius: "12px" }}
        >
          <Card.Body>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: "white" }}>
                <Search size={20} color={kairosTheme.primary} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre de lugar o etiqueta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Body>
        </Card>

        {/* Delete Confirm */}
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
                  <p className="mb-0">¿Eliminar este punto destacado?</p>
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

        {/* Table */}
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
                style={{ minWidth: "800px" }}
              >
                <thead style={{ backgroundColor: kairosTheme.light }}>
                  <tr>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Lugar</th>
                    <th className="p-3">Etiqueta (Badge)</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPois.map((p) => (
                    <tr key={p.idPunto} style={{ transition: "0.2s" }}>
                      <td className="p-3">
                        <Badge bg="secondary">#{p.prioridad}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="fw-bold">
                          {p.idLugarNavigation?.nombre || `ID: ${p.idLugar}`}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge bg="warning" text="dark">
                          <Award size={12} className="me-1" /> {p.etiqueta}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted small">
                        {p.descripcion || "-"}
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
                          {p.estatus ? "Visible" : "Oculto"}
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
                            onClick={() => handleEdit(p.idPunto)}
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
                            onClick={() => setConfirmingId(p.idPunto)}
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
                  {filteredPois.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-5 text-muted">
                        No hay puntos destacados registrados.
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

// Envolvemos el componente con el State Provider importado
const GestionPOIs = () => (
  <PuntosInteresState>
    <GestionPOIsContent />
  </PuntosInteresState>
);

export default GestionPOIs;
