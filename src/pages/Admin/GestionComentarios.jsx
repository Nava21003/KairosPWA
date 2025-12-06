import React, { useState, useContext, useEffect } from "react";
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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Trash2,
  Filter,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import ReseniasContext from "../../Context/Resenias/ReseniasContext";
import ReseniasState from "../../Context/Resenias/ReseniasState";

const kairosTheme = {
  primary: "#1e4d2b",
  headerGradient: "linear-gradient(135deg, #1e4d2b 0%, #2d7a3e 100%)",
  bodyBg: "#f4f6f9",
};

const GestionComentariosContent = () => {
  const { resenas, getResenas, updateResena, deleteResena } =
    useContext(ReseniasContext);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [error, setError] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (getResenas) await getResenas();
    } catch (err) {
      console.error(err);
      setError("Error al cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const nuevoEstatus = !item.estatus;
      await updateResena(item.idResena, { ...item, estatus: nuevoEstatus });
    } catch (err) {
      setError("No se pudo actualizar el estatus de la reseña.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar esta reseña permanentemente?")
    ) {
      try {
        await deleteResena(id);
      } catch (err) {
        setError("Error al eliminar la reseña.");
      }
    }
  };

  const safeResenas = Array.isArray(resenas) ? resenas : [];

  const filteredData = safeResenas.filter((item) => {
    const term = searchTerm.toLowerCase();
    const nombre = (item.usuarioNombre || "").toLowerCase();
    const comentario = (item.comentario || "").toLowerCase();

    const matchesSearch = nombre.includes(term) || comentario.includes(term);

    let matchesStatus = true;
    if (statusFilter === "activos") matchesStatus = item.estatus === true;
    if (statusFilter === "ocultos") matchesStatus = item.estatus === false;

    return matchesSearch && matchesStatus;
  });

  const totalResenas = safeResenas.length;
  const totalOcultas = safeResenas.filter((r) => r.estatus === false).length;

  const promedioEstrellas =
    totalResenas > 0
      ? (
          safeResenas.reduce((acc, curr) => acc + (curr.estrellas || 0), 0) /
          totalResenas
        ).toFixed(1)
      : "0.0";

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < count ? "#ffc107" : "none"}
        color={i < count ? "#ffc107" : "#dee2e6"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
        .table-hover tbody tr:hover { background-color: rgba(30, 77, 43, 0.05); }
        .card-hover { transition: transform 0.2s; }
        .card-hover:hover { transform: translateY(-3px); }
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .badge-soft-success { background-color: #d4edda; color: #155724; }
        .badge-soft-secondary { background-color: #e2e3e5; color: #383d41; }
      `}</style>

      <Container fluid className="p-4">
        {/* HEADER */}
        <div
          style={{
            background: kairosTheme.headerGradient,
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 24px rgba(30, 77, 43, 0.25)",
            color: "white",
          }}
        >
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                  <MessageCircle size={32} color="white" />
                </div>
                <div>
                  <h1 className="mb-1 fw-bold h2">Gestión de Comentarios</h1>
                  <p className="mb-0 opacity-75">
                    Modera las reseñas y testimonios de la comunidad Kairos.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button
                variant="light"
                className="shadow-sm fw-bold text-success"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  size={18}
                  className={`me-2 ${loading ? "spin-anim" : ""}`}
                />
                Actualizar
              </Button>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* CARDS DE ESTADISTICAS */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-light me-3 text-primary">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Reseñas</h6>
                  <h3 className="fw-bold mb-0">{totalResenas}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-light me-3 text-warning">
                  <Star size={24} fill="#ffc107" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Calificación Promedio</h6>
                  <h3 className="fw-bold mb-0 text-warning">
                    {promedioEstrellas}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="p-3 rounded-circle me-3"
                  style={{ backgroundColor: "#e2e3e5" }}
                >
                  <EyeOff size={24} className="text-secondary" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Ocultas / Inactivas</h6>
                  <h3 className="fw-bold mb-0 text-secondary">
                    {totalOcultas}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* TABLA Y FILTROS */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por usuario o contenido..."
                    className="bg-light border-start-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Filter size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Select
                    className="bg-light border-start-0"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="activos">Visibles (Activos)</option>
                    <option value="ocultos">Ocultos (Inactivos)</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0 mt-3">
            <div className="table-responsive">
              <Table
                className="align-middle mb-0 table-hover"
                style={{ minWidth: "1000px" }}
              >
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-secondary small text-uppercase">
                      Usuario
                    </th>
                    <th className="py-3 text-secondary small text-uppercase">
                      Comentario
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Calificación
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Estatus
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Fecha
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-end pe-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center p-5">
                        <Spinner animation="border" variant="success" />
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-5 text-muted">
                        No se encontraron reseñas.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.idResena || item.id}>
                        {/* COLUMNA USUARIO */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-3 text-secondary">
                              <User size={20} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark">
                                {item.usuarioNombre}
                              </div>
                              <div className="small text-muted">
                                {item.rol || "Usuario"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* COLUMNA COMENTARIO */}
                        <td className="py-3" style={{ maxWidth: "300px" }}>
                          <div
                            className="text-muted small text-truncate"
                            title={item.comentario}
                          >
                            "{item.comentario}"
                          </div>
                        </td>

                        {/* COLUMNA ESTRELLAS */}
                        <td className="py-3 text-center">
                          <div className="d-flex justify-content-center">
                            {renderStars(item.estrellas)}
                          </div>
                        </td>

                        {/* COLUMNA ESTATUS */}
                        <td className="py-3 text-center">
                          {item.estatus ? (
                            <Badge
                              bg=""
                              className="badge-soft-success border border-success px-3 py-2 rounded-pill"
                            >
                              <CheckCircle size={12} className="me-1" /> Visible
                            </Badge>
                          ) : (
                            <Badge
                              bg=""
                              className="badge-soft-secondary border border-secondary px-3 py-2 rounded-pill"
                            >
                              <EyeOff size={12} className="me-1" /> Oculto
                            </Badge>
                          )}
                        </td>

                        {/* COLUMNA FECHA */}
                        <td className="py-3 text-center text-muted small">
                          {formatDate(item.fechaRegistro)}
                        </td>

                        {/* COLUMNA ACCIONES */}
                        <td className="py-3 text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            {/* Toggle Visibilidad */}
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  {item.estatus
                                    ? "Ocultar reseña"
                                    : "Mostrar reseña"}
                                </Tooltip>
                              }
                            >
                              <Button
                                variant={
                                  item.estatus
                                    ? "outline-secondary"
                                    : "outline-success"
                                }
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleToggleStatus(item)}
                              >
                                {item.estatus ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </Button>
                            </OverlayTrigger>

                            {/* Eliminar */}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Eliminar reseña</Tooltip>}
                            >
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleDelete(item.idResena)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </OverlayTrigger>
                          </div>
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

const GestionComentarios = () => (
  <ReseniasState>
    <GestionComentariosContent />
  </ReseniasState>
);

export default GestionComentarios;
