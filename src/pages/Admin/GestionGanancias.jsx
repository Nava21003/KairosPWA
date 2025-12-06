import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  Search,
  RefreshCw,
  Filter,
  Download,
  Calendar,
  MousePointer,
} from "lucide-react";

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

const API_BASE_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net";

const GestionGanancias = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("todos");
  const [error, setError] = useState(null);

  const [totalGanancia, setTotalGanancia] = useState(0);
  const [totalClics, setTotalClics] = useState(0);
  const [promedioCPC, setPromedioCPC] = useState(0);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Promociones/con-ganancias`
      );

      if (!response.ok) {
        throw new Error("No se pudo conectar con el servidor de métricas.");
      }

      const rawData = await response.json();
      const realData = extractData(rawData);

      const processedData = realData.map((item) => {
        const ganancia = item.totalClics * item.tarifaCPC;

        return {
          id: item.idPromocion,
          titulo: item.titulo,
          imagen: item.imagen,
          socio: item.nombreSocio,
          tarifaCPC: item.tarifaCPC,
          clics: item.totalClics,
          gananciaTotal: ganancia,
          fechaInicio: item.fechaInicio,
        };
      });

      setData(processedData);
      calculateKPIs(processedData);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el reporte financiero real.");
    } finally {
      setLoading(false);
    }
  };

  const extractData = (payload) => {
    if (payload && payload.$values) return payload.$values;
    if (Array.isArray(payload)) return payload;
    return [];
  };

  const calculateKPIs = (dataset) => {
    const totalG = dataset.reduce((acc, curr) => acc + curr.gananciaTotal, 0);
    const totalC = dataset.reduce((acc, curr) => acc + curr.clics, 0);
    const avgCPC =
      dataset.length > 0
        ? dataset.reduce((acc, curr) => acc + curr.tarifaCPC, 0) /
          dataset.length
        : 0;

    setTotalGanancia(totalG);
    setTotalClics(totalC);
    setPromedioCPC(avgCPC);
  };

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (item.titulo || "").toLowerCase().includes(term) ||
      (item.socio || "").toLowerCase().includes(term);

    const matchesPartner =
      partnerFilter === "todos" ? true : item.socio === partnerFilter;

    return matchesSearch && matchesPartner;
  });

  const uniquePartners = [...new Set(data.map((item) => item.socio))];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=IMG";
    return path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;
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
        .text-gradient { background: ${kairosTheme.headerGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
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
                  <TrendingUp size={32} color="white" />
                </div>
                <div>
                  <h1 className="mb-1 fw-bold h2">
                    Reporte de Ganancias (Datos Reales)
                  </h1>
                  <p className="mb-0 opacity-75">
                    Monitoreo en tiempo real de ingresos por clics y rendimiento
                    de socios.
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
                Actualizar Datos
              </Button>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* TARJETAS KPI */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3 text-success">
                  <DollarSign size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-1 text-uppercase small fw-bold">
                    Ganancia Total
                  </h6>
                  <h3 className="fw-bold mb-0 text-success">
                    {formatCurrency(totalGanancia)}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3 text-primary">
                  <MousePointer size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-1 text-uppercase small fw-bold">
                    Total Clics (Tráfico)
                  </h6>
                  <h3 className="fw-bold mb-0 text-primary">
                    {totalClics.toLocaleString()}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm card-hover h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3 text-warning">
                  <BarChart2 size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-1 text-uppercase small fw-bold">
                    CPC Promedio
                  </h6>
                  <h3 className="fw-bold mb-0 text-warning">
                    {formatCurrency(promedioCPC)}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FILTROS Y TABLA */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <Row className="g-3">
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar promoción o socio..."
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
                    value={partnerFilter}
                    onChange={(e) => setPartnerFilter(e.target.value)}
                  >
                    <option value="todos">Todos los Socios</option>
                    {uniquePartners.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={4} className="text-end">
                <Button
                  variant="outline-secondary"
                  className="d-inline-flex align-items-center"
                >
                  <Download size={18} className="me-2" /> Exportar CSV
                </Button>
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
                      Promoción
                    </th>
                    <th className="py-3 text-secondary small text-uppercase">
                      Socio Afiliado
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Tarifa (CPC)
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-center">
                      Clics Reales
                    </th>
                    <th className="py-3 text-secondary small text-uppercase text-end pe-4">
                      Ganancia Total
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
                        No hay registros de ganancias que coincidan con la
                        búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                marginRight: "15px",
                                border: "1px solid #eee",
                              }}
                            >
                              <img
                                src={getImageUrl(item.imagen)}
                                alt="promo"
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
                            <div>
                              <div className="fw-bold text-dark">
                                {item.titulo}
                              </div>
                              <div className="small text-muted d-flex align-items-center">
                                <Calendar size={12} className="me-1" />
                                {new Date(
                                  item.fechaInicio
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge
                            bg="light"
                            text="dark"
                            className="border px-3 py-2 fw-normal"
                          >
                            {item.socio}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-muted">
                            {formatCurrency(item.tarifaCPC)}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <Badge bg="info" className="px-3 py-2 rounded-pill">
                            {item.clics} clics
                          </Badge>
                        </td>
                        <td className="py-3 text-end pe-4">
                          <h5 className="mb-0 fw-bold text-success">
                            {formatCurrency(item.gananciaTotal)}
                          </h5>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
          <Card.Footer className="bg-white border-0 py-3 text-center">
            <small className="text-muted">
              Mostrando {filteredData.length} registros | Ganancia filtrada:
              <span className="text-success fw-bold ms-1">
                {formatCurrency(
                  filteredData.reduce(
                    (acc, curr) => acc + curr.gananciaTotal,
                    0
                  )
                )}
              </span>
            </small>
          </Card.Footer>
        </Card>
      </Container>
    </Container>
  );
};

export default GestionGanancias;
