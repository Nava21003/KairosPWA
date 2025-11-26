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
  MessageSquare,
  Mail,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  Filter,
  User,
} from "lucide-react";

import MensajesContext from "../../Context/Mensajes/MensajesContext";
import MensajesState from "../../Context/Mensajes/MensajesState";

const kairosTheme = {
  primary: "#1e4d2b",
  secondary: "#6c757d",
  success: "#28a745",
  warning: "#ffc107",
  light: "#f8f9fa",
  dark: "#343a40",
  headerGradient: "linear-gradient(135deg, #1e4d2b 0%, #2d7a3e 100%)",
  bodyBg: "#f4f6f9",
};

const AdminMensajesContent = () => {
  const { mensajes, getMensajes, updateMensaje, deleteMensaje } =
    useContext(MensajesContext);

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
      if (getMensajes) await getMensajes();
    } catch (err) {
      console.error(err);
      setError("Error al cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (msg) => {
    try {
      const nuevoEstatus =
        msg.estatus === "Pendiente" ? "Respondido" : "Pendiente";
      await updateMensaje(msg.idMensaje, { ...msg, estatus: nuevoEstatus });
    } catch (err) {
      alert("No se pudo actualizar el estatus");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este mensaje?")) {
      await deleteMensaje(id);
    }
  };

  const safeMensajes = Array.isArray(mensajes) ? mensajes : [];

  const filteredData = safeMensajes.filter((item) => {
    const term = searchTerm.toLowerCase();
    const nombre = (item.nombre || "").toLowerCase();
    const correo = (item.correo || "").toLowerCase();
    const asunto = (item.asunto || "").toLowerCase();
    const matchesSearch =
      nombre.includes(term) || correo.includes(term) || asunto.includes(term);

    const matchesStatus =
      statusFilter === "todos"
        ? true
        : (item.estatus || "Pendiente") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalMensajes = safeMensajes.length;
  const totalPendientes = safeMensajes.filter(
    (m) => (m.estatus || "Pendiente") === "Pendiente"
  ).length;
  const totalRespondidos = safeMensajes.filter(
    (m) => m.estatus === "Respondido"
  ).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
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
        .table-hover tbody tr:hover { background-color: rgba(30, 77, 43, 0.05); }
        .card-hover { transition: transform 0.2s; }
        .card-hover:hover { transform: translateY(-3px); }
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .badge-soft-warning { background-color: #fff3cd; color: #856404; }
        .badge-soft-success { background-color: #d4edda; color: #155724; }
      `}</style>

      <Container fluid className="p-4">
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
                  <MessageSquare size={32} color="white" />
                </div>
                <div>
                  <h1 className="mb-1 fw-bold h2">Centro de Soporte</h1>
                  <p className="mb-0 opacity-75">
                    Gestiona las dudas y mensajes de contacto de los usuarios.
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

        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-light me-3 text-primary">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Mensajes</h6>
                  <h3 className="fw-bold mb-0">{totalMensajes}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="p-3 rounded-circle me-3"
                  style={{ backgroundColor: "#fff3cd" }}
                >
                  <Clock size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Pendientes</h6>
                  <h3 className="fw-bold mb-0 text-warning">
                    {totalPendientes}
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
                  style={{ backgroundColor: "#d4edda" }}
                >
                  <CheckCircle size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Atendidos</h6>
                  <h3 className="fw-bold mb-0 text-success">
                    {totalRespondidos}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                    placeholder="Buscar por nombre, correo o asunto..."
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
                    <option value="todos">Todos los estatus</option>
                    <option value="Pendiente">Solo Pendientes</option>
                    <option value="Respondido">Solo Respondidos</option>
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
                      Asunto / Mensaje
                    </th>
                    <th className="py-3 text-secondary small text-uppercase">
                      Fecha
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Estatus
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-end pe-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center p-5">
                        <Spinner animation="border" variant="success" />
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-5 text-muted">
                        No se encontraron mensajes.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.idMensaje}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-3 text-secondary">
                              <User size={20} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark">
                                {item.nombre}
                              </div>
                              <div className="small text-muted">
                                {item.correo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3" style={{ maxWidth: "350px" }}>
                          <div className="fw-bold text-dark mb-1">
                            {item.asunto || "Sin Asunto"}
                          </div>
                          <div
                            className="text-muted small text-truncate"
                            title={item.mensaje}
                          >
                            {item.mensaje}
                          </div>
                        </td>
                        <td className="py-3 text-nowrap text-muted small">
                          {formatDate(item.fechaEnvio)}
                        </td>
                        <td className="py-3 text-center">
                          {item.estatus === "Respondido" ? (
                            <Badge
                              bg=""
                              className="badge-soft-success border border-success px-3 py-2 rounded-pill"
                            >
                              <CheckCircle size={12} className="me-1" />{" "}
                              Atendido
                            </Badge>
                          ) : (
                            <Badge
                              bg=""
                              className="badge-soft-warning border border-warning px-3 py-2 rounded-pill"
                            >
                              <Clock size={12} className="me-1" /> Pendiente
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Responder por correo</Tooltip>}
                            >
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                href={`mailto:${item.correo}?subject=Respuesta a: ${item.asunto}&body=Hola ${item.nombre}, respecto a tu mensaje sobre "${item.mensaje}"...`}
                              >
                                <Mail size={14} />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  {item.estatus === "Pendiente"
                                    ? "Marcar como Atendido"
                                    : "Marcar como Pendiente"}
                                </Tooltip>
                              }
                            >
                              <Button
                                variant={
                                  item.estatus === "Pendiente"
                                    ? "outline-success"
                                    : "outline-warning"
                                }
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleToggleStatus(item)}
                              >
                                {item.estatus === "Pendiente" ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <Clock size={14} />
                                )}
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Eliminar mensaje</Tooltip>}
                            >
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleDelete(item.idMensaje)}
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

const AdminMensajes = () => (
  <MensajesState>
    <AdminMensajesContent />
  </MensajesState>
);

export default AdminMensajes;
