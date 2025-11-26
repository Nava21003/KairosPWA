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
  Alert,
} from "react-bootstrap";
import {
  Tag,
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
  Layers,
  Power,
} from "lucide-react";

import CategoriasContext from "../../Context/Categorias/CategoriasContext";
import CategoriasState from "../../Context/Categorias/CategoriasState";

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
    info: <Tag size={20} />,
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

const CategoriaModal = ({
  show,
  handleClose,
  saveCategoria,
  categoria,
  loading,
}) => {
  const isEditing = categoria !== null;

  const initialFormData = {
    nombre: "",
    descripcion: "",
    estatus: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (categoria && show) {
      setFormData({
        idCategoria: categoria.idCategoria,
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        estatus: categoria.estatus ?? true,
      });
    } else if (!show) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [categoria, show]);

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
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

    if (!validateForm()) {
      return;
    }

    saveCategoria(formData, isEditing);
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
              Editar Categoría
            </>
          ) : (
            <>
              <Plus className="me-2" style={{ color: kairosTheme.primary }} />
              Nueva Categoría
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: kairosTheme.white }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label className="fw-semibold">
                <Tag size={16} className="me-1" /> Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre de la categoría"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                isInvalid={!!formErrors.nombre}
                required
                style={{ borderRadius: "8px", padding: "0.625rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <Layers size={16} className="me-1" /> Descripción
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe la categoría..."
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={{ borderRadius: "8px", padding: "0.625rem" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="estatus"
              id="estatus-switch"
              label={
                <span className="d-flex align-items-center fw-semibold">
                  <Tag
                    size={18}
                    className="me-2"
                    style={{
                      color: formData.estatus
                        ? kairosTheme.success
                        : kairosTheme.danger,
                    }}
                  />
                  {formData.estatus ? "Categoría Activa" : "Categoría Inactiva"}
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
          {isEditing ? "Guardar Cambios" : "Crear Categoría"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GestionCategoriasContent = () => {
  const {
    categorias = [],
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  } = useContext(CategoriasContext);

  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [loading, setLoading] = useState({
    categorias: false,
    action: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("all");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async () => {
    if (loading.categorias) return;

    setLoading((prev) => ({ ...prev, categorias: true }));
    setError(null);

    try {
      console.log("Iniciando carga de categorías...");
      await getCategorias();
      console.log("Carga de datos completada");
      setDataLoaded(true);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError(
        "Hubo un problema al conectar con el servidor. Verifica que la API esté activa."
      );
      showMessage("Error al cargar los datos", "danger");
    } finally {
      setLoading((prev) => ({ ...prev, categorias: false }));
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
    console.log("🔄 Recargando datos manualmente...");
    loadAllData();
  };

  const handleCreate = () => {
    setCategoriaToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const categoria = categorias.find((c) => c.idCategoria === id);
    if (categoria) {
      setCategoriaToEdit(categoria);
      setShowModal(true);
    } else {
      showMessage("Categoría no encontrada para editar", "danger");
    }
  };

  const handleToggleStatus = async (categoria) => {
    if (loading.action) return;

    const nuevoEstatus = !categoria.estatus;
    const accion = nuevoEstatus ? "activar" : "desactivar";

    const confirmacion = window.confirm(
      `¿Deseas ${accion} la categoría "${categoria.nombre}"?`
    );
    if (!confirmacion) return;

    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const categoriaActualizada = {
        ...categoria,
        estatus: nuevoEstatus,
      };

      await updateCategoria(categoria.idCategoria, categoriaActualizada);
      showMessage(
        `Categoría ${nuevoEstatus ? "activada" : "desactivada"} correctamente`,
        "success"
      );
    } catch (error) {
      showMessage(`Error al cambiar estatus: ${error.message}`, "danger");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaToEdit(null);
  };

  const saveCategoria = async (categoriaData, isEditing) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      if (isEditing) {
        await updateCategoria(categoriaData.idCategoria, categoriaData);
        showMessage(`Categoría actualizada exitosamente`, "success");
      } else {
        await createCategoria(categoriaData);
        showMessage(`Categoría creada exitosamente`, "success");
      }
      handleCloseModal();
    } catch (error) {
      showMessage(
        `Error al ${isEditing ? "actualizar" : "crear"} categoría: ${
          error.message || "Error desconocido"
        }`,
        "danger"
      );
      console.error("Error en la operación de categoría:", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const executeDelete = async () => {
    const idToDelete = confirmingId;
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await deleteCategoria(idToDelete);
      showMessage(`Categoría eliminada exitosamente`, "success");
      await getCategorias();
    } catch (error) {
      showMessage(
        `Error al eliminar categoría: ${error.message || "Error desconocido"}`,
        "danger"
      );
      console.error("Error en la eliminación:", error);
    } finally {
      setConfirmingId(null);
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const currentCategorias = Array.isArray(categorias) ? categorias : [];

  const filteredCategorias = currentCategorias.filter((categoria) => {
    const nombre = (categoria.nombre || "").toLowerCase();
    const descripcion = (categoria.descripcion || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      nombre.includes(search) || descripcion.includes(search);

    const matchesEstatus =
      filterEstatus === "all" ||
      (filterEstatus === "active" && categoria.estatus) ||
      (filterEstatus === "inactive" && !categoria.estatus);

    return matchesSearch && matchesEstatus;
  });

  const isLoading = loading.categorias && !dataLoaded;

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
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
        }
        .table-row-hover { transition: all 0.2s ease; }
        .table-row-hover:hover {
          background-color: rgba(78, 204, 163, 0.08) !important;
        }
        .btn-action {
          transition: all 0.2s ease;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-weight: 600;
        }
        .btn-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .search-input:focus {
          border-color: ${kairosTheme.primary};
          box-shadow: 0 0 0 0.25rem rgba(78, 204, 163, 0.25);
        }
        .stat-card {
          border-left: 4px solid ${kairosTheme.primary};
          transition: all 0.3s ease;
        }
        .stat-card:hover { border-left-width: 6px; }
      `}</style>

      <CategoriaModal
        show={showModal}
        handleClose={handleCloseModal}
        saveCategoria={saveCategoria}
        categoria={categoriaToEdit}
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
                <Layers size={40} className="me-3" />
                <div>
                  <h1 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
                    Gestión de Categorías
                  </h1>
                  <p className="mb-0 opacity-90">
                    Administra las categorías de productos/servicios del sistema
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  onClick={handleRefresh}
                  disabled={loading.categorias}
                  style={{
                    backgroundColor: kairosTheme.info,
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                  }}
                  className="btn-action"
                >
                  <RefreshCw className="me-2" size={20} />
                  {loading.categorias ? "Cargando..." : "Recargar"}
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading.categorias}
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
                  <Plus className="me-2" size={20} />
                  Nueva Categoría
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

        {/* Stats Cards */}
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
                  <p className="text-muted mb-1 fw-semibold">
                    Total Categorías
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.categorias ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentCategorias.length
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
                  <Layers size={32} style={{ color: kairosTheme.primary }} />
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
                  <p className="text-muted mb-1 fw-semibold">
                    Categorías Activas
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.categorias ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentCategorias.filter((c) => c.estatus).length
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
                    Categorías Inactivas
                  </p>
                  <h3 className="mb-0 fw-bold">
                    {loading.categorias ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      currentCategorias.filter((c) => !c.estatus).length
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
                    placeholder="Buscar por nombre o descripción..."
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
                    <option value="active">Solo activas</option>
                    <option value="inactive">Solo inactivas</option>
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
                    ¿Estás seguro de eliminar la categoría ID:{" "}
                    <b>{confirmingId}</b>? Esta acción no se puede deshacer.
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
                <p className="text-muted">Cargando categorías...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <XCircle
                  size={64}
                  style={{ color: kairosTheme.danger, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-danger">Error al cargar categorías</h5>
                <p className="text-muted">{error}</p>
                <Button variant="primary" onClick={handleRefresh}>
                  <RefreshCw className="me-2" size={16} />
                  Reintentar
                </Button>
              </div>
            ) : filteredCategorias.length === 0 ? (
              <div className="text-center py-5">
                <Layers
                  size={64}
                  style={{ color: kairosTheme.secondary, opacity: 0.4 }}
                  className="mb-3"
                />
                <h5 className="text-muted">No se encontraron categorías</h5>
                <p className="text-muted">
                  {searchTerm || filterEstatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando una nueva categoría"}
                </p>
                <Button variant="primary" onClick={handleCreate}>
                  <Plus className="me-2" size={16} />
                  Crear Primera Categoría
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
                      <Tag size={16} className="me-1" /> Nombre
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        fontWeight: 700,
                        color: kairosTheme.dark,
                      }}
                    >
                      <Layers size={16} className="me-1" /> Descripción
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
                  {filteredCategorias.map((c) => (
                    <tr
                      key={`categoria-${c.idCategoria}`}
                      className="table-row-hover"
                    >
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
                          #{c.idCategoria}
                        </Badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="fw-bold">
                          {c.nombre || "Sin nombre"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div className="text-muted">
                          {c.descripcion
                            ? c.descripcion.length > 60
                              ? `${c.descripcion.substring(0, 60)}...`
                              : c.descripcion
                            : "Sin descripción"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: c.estatus
                              ? `${kairosTheme.success}15`
                              : `${kairosTheme.danger}15`,
                            color: c.estatus
                              ? kairosTheme.success
                              : kairosTheme.danger,
                          }}
                        >
                          {c.estatus ? (
                            <>
                              <CheckCircle size={16} /> Activa
                            </>
                          ) : (
                            <>
                              <XCircle size={16} /> Inactiva
                            </>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }} className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(c)}
                            disabled={loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: c.estatus
                                ? kairosTheme.white
                                : kairosTheme.success,
                              borderColor: c.estatus
                                ? kairosTheme.secondary
                                : kairosTheme.success,
                              color: c.estatus
                                ? kairosTheme.secondary
                                : kairosTheme.white,
                            }}
                            title={
                              c.estatus
                                ? "Desactivar categoría"
                                : "Activar categoría"
                            }
                          >
                            <Power size={16} />
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleEdit(c.idCategoria)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.info,
                              color: kairosTheme.white,
                            }}
                            title="Editar categoría"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setConfirmingId(c.idCategoria)}
                            disabled={!!confirmingId || loading.action}
                            className="btn-action"
                            style={{
                              backgroundColor: kairosTheme.danger,
                              color: kairosTheme.white,
                            }}
                            title="Eliminar categoría"
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
          {filteredCategorias.length > 0 && (
            <Card.Footer
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: kairosTheme.light,
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <small className="text-muted fw-semibold">
                Mostrando {filteredCategorias.length} de{" "}
                {currentCategorias.length} categorías
              </small>
              <small className="text-muted">
                {searchTerm && (
                  <span className="me-3">
                    <Search size={14} className="me-1" />
                    Búsqueda activa
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

const GestionCategorias = () => {
  return (
    <CategoriasState>
      <GestionCategoriasContent />
    </CategoriasState>
  );
};

export default GestionCategorias;
