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
  Modal,
} from "react-bootstrap";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Tag,
  Save,
  X,
} from "lucide-react";

import FaqContext from "../../Context/Faq/FaqContext";
import FaqState from "../../Context/Faq/FaqState";

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

const AdminFaqContent = () => {
  const { faqs, getFaqs, createFaq, updateFaq, deleteFaq } =
    useContext(FaqContext);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    idPregunta: 0,
    pregunta: "",
    respuesta: "",
    categoria: "General",
    orden: 0,
    estatus: true,
  });

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (getFaqs) await getFaqs();
    } catch (err) {
      console.error(err);
      setError("Error al cargar las preguntas frecuentes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setIsEditing(true);
      setCurrentFaq(faq);
    } else {
      setIsEditing(false);
      setCurrentFaq({
        idPregunta: 0,
        pregunta: "",
        respuesta: "",
        categoria: "General",
        orden: 0,
        estatus: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentFaq.pregunta || !currentFaq.respuesta) {
      alert("La pregunta y la respuesta son obligatorias.");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await updateFaq(currentFaq.idPregunta, currentFaq);
      } else {
        const { idPregunta, ...newFaq } = currentFaq;
        await createFaq(newFaq);
      }
      handleCloseModal();
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer."
      )
    ) {
      try {
        setLoading(true);
        await deleteFaq(id);
        handleRefresh();
      } catch (err) {
        alert("No se pudo eliminar el registro.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (faq) => {
    try {
      await updateFaq(faq.idPregunta, { ...faq, estatus: !faq.estatus });
      handleRefresh();
    } catch (error) {
      alert("Error al cambiar el estatus.");
    }
  };

  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  const filteredData = safeFaqs.filter((item) => {
    const term = searchTerm.toLowerCase();
    const pregunta = (item.pregunta || "").toLowerCase();
    const respuesta = (item.respuesta || "").toLowerCase();
    const categoria = (item.categoria || "").toLowerCase();

    return (
      pregunta.includes(term) ||
      respuesta.includes(term) ||
      categoria.includes(term)
    );
  });

  const categorias = [
    "General",
    "Suscripción",
    "Seguridad",
    "Técnico",
    "Privacidad",
    "Plataforma",
    "Rutas",
  ];

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
                  <HelpCircle size={32} color="white" />
                </div>
                <div>
                  <h1 className="mb-1 fw-bold h2">Gestión de FAQ</h1>
                  <p className="mb-0 opacity-75">
                    Administra las preguntas frecuentes visibles para los
                    usuarios.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button
                variant="light"
                className="shadow-sm fw-bold text-success me-2"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  size={18}
                  className={`me-2 ${loading ? "spin-anim" : ""}`}
                />
                Actualizar
              </Button>
              <Button
                variant="warning"
                className="shadow-sm fw-bold text-dark"
                onClick={() => handleOpenModal()}
              >
                <Plus size={18} className="me-2" />
                Nueva Pregunta
              </Button>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por pregunta, respuesta o categoría..."
                    className="bg-light border-start-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <Badge bg="light" text="dark" className="p-2 border">
                  Total Registros: {filteredData.length}
                </Badge>
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
                    <th
                      className="ps-4 py-3 text-secondary small text-uppercase"
                      style={{ width: "50px" }}
                    >
                      #
                    </th>
                    <th className="py-3 text-secondary small text-uppercase">
                      Pregunta
                    </th>
                    <th className="py-3 text-secondary small text-uppercase">
                      Categoría
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Orden
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
                  {loading && filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-5">
                        <Spinner animation="border" variant="success" />
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-5 text-muted">
                        No se encontraron preguntas frecuentes.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={item.idPregunta || index}>
                        <td className="ps-4 fw-bold text-muted">{index + 1}</td>

                        <td className="py-3" style={{ maxWidth: "400px" }}>
                          <div
                            className="fw-bold text-dark mb-1 text-truncate"
                            title={item.pregunta}
                          >
                            {item.pregunta}
                          </div>
                          <div
                            className="text-muted small text-truncate"
                            title={item.respuesta}
                          >
                            {item.respuesta}
                          </div>
                        </td>

                        <td className="py-3">
                          <Badge
                            bg="light"
                            text="dark"
                            className="border fw-normal px-2 py-1"
                          >
                            <Tag size={10} className="me-1" />
                            {item.categoria || "General"}
                          </Badge>
                        </td>

                        <td className="py-3 text-center fw-bold text-muted">
                          {item.orden || 0}
                        </td>

                        <td className="py-3 text-center">
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={() => handleToggleStatus(item)}
                          >
                            {item.estatus ? (
                              <Badge
                                bg=""
                                className="bg-success bg-opacity-10 text-success border border-success px-3 py-1 rounded-pill"
                              >
                                Visible
                              </Badge>
                            ) : (
                              <Badge
                                bg=""
                                className="bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-1 rounded-pill"
                              >
                                Oculto
                              </Badge>
                            )}
                          </Button>
                        </td>

                        <td className="py-3 text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Editar</Tooltip>}
                            >
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleOpenModal(item)}
                              >
                                <Edit2 size={14} />
                              </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Eliminar</Tooltip>}
                            >
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => handleDelete(item.idPregunta)}
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

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          backdrop="static"
        >
          <Modal.Header className="border-0 pb-0">
            <Modal.Title className="fw-bold">
              {isEditing ? "Editar Pregunta" : "Nueva Pregunta"}
            </Modal.Title>
            <Button
              variant="link"
              className="text-dark"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">
                  Pregunta
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribe la pregunta..."
                  value={currentFaq.pregunta}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, pregunta: e.target.value })
                  }
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">
                  Respuesta
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Escribe la respuesta detallada..."
                  value={currentFaq.respuesta}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, respuesta: e.target.value })
                  }
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">
                      Categoría
                    </Form.Label>
                    <Form.Select
                      value={currentFaq.categoria}
                      onChange={(e) =>
                        setCurrentFaq({
                          ...currentFaq,
                          categoria: e.target.value,
                        })
                      }
                    >
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">
                      Orden de Visualización
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={currentFaq.orden}
                      onChange={(e) =>
                        setCurrentFaq({
                          ...currentFaq,
                          orden: parseInt(e.target.value),
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="estatus-switch"
                  label="Visible para usuarios"
                  checked={currentFaq.estatus}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, estatus: e.target.checked })
                  }
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="light" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      <Save size={18} className="me-2" /> Guardar
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Container>
  );
};

const AdminFaq = () => (
  <FaqState>
    <AdminFaqContent />
  </FaqState>
);

export default AdminFaq;
