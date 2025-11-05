import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import {
  FaMapMarkedAlt,
  FaUsers,
  FaWalking,
  FaScroll,
  FaBars,
  FaThumbsUp,
  FaFire,
  FaBullhorn,
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const kairosTheme = {
  primaryColor: "#111418",
  secondaryColor: "#1b1f23",
  accentColor: "#4ecca3",
  textLight: "#ffffff",
};

const mockDashboardInfo = {
  clicsPromociones: 215,
  rutasGeneradas: 1890,
  totalPois: 45,
  totalAdmins: 3,
  actividadReciente: [
    "Nuevo POI agregado: Plaza de la Cultura",
    "El Mirador del Sol recibió 530 nuevas visitas esta semana",
    "Se desactivó el POI 'Antigua Estación del Tren'",
    "Se creó una nueva promoción destacada para turistas",
  ],
  promocionesDestacadas: [
    { title: "2x1 Café 'La Nube'", clicks: 154 },
    { title: "Entrada libre al Museo Local", clicks: 98 },
    { title: "10% en Pastelería DulceArte", clicks: 73 },
  ],
  puntosPopulares: [
    { name: "Parque Central", visitas: 1560 },
    { name: "Cerro del Tajo", visitas: 1204 },
    { name: "Mirador del Sol", visitas: 988 },
    { name: "Catedral", visitas: 845 },
    { name: "Museo Histórico", visitas: 650 },
  ],
};

const MetricCard = ({ icon: Icon, value, label }) => (
  <Card className="neo-card glass p-4 h-100 border-0">
    <Card.Body className="text-center">
      <Icon
        size={48}
        style={{ color: kairosTheme.accentColor }}
        className="mb-3"
      />
      <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{value}</div>
      <div className="text-muted" style={{ fontSize: "1.15rem" }}>
        {label}
      </div>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <>
      <style>{`
        .dashboard-header {
          background: linear-gradient(145deg, ${kairosTheme.primaryColor}, ${kairosTheme.secondaryColor});
          color: ${kairosTheme.textLight};
          padding: 38px;
          border-radius: 20px;
          margin-bottom: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 12px 32px rgba(0,0,0,0.32);
        }

        .dashboard-header-title {
          font-size: 2.6rem;
          font-weight: 800;
        }

        .glass {
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(14px);
          border-radius: 18px !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
        }

        .neo-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .neo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }
      `}</style>

      <Container fluid>
        <div className="dashboard-header">
          <div className="d-flex align-items-center">
            <Button variant="outline-light" onClick={toggleSidebar}>
              <FaBars />
            </Button>
            <span className="dashboard-header-title ms-3">Dashboard</span>
          </div>
          <div>
            Bienvenido, <strong>Administrador</strong>
          </div>
        </div>

        {/* Métricas */}
        <Row className="mb-5 g-4">
          <Col sm={6} lg={3}>
            <MetricCard
              icon={FaScroll}
              value={mockDashboardInfo.clicsPromociones}
              label="Clics en Promociones"
            />
          </Col>
          <Col sm={6} lg={3}>
            <MetricCard
              icon={FaWalking}
              value={mockDashboardInfo.rutasGeneradas}
              label="Rutas Generadas"
            />
          </Col>
          <Col sm={6} lg={3}>
            <MetricCard
              icon={FaMapMarkedAlt}
              value={mockDashboardInfo.totalPois}
              label="POIs Registrados"
            />
          </Col>
          <Col sm={6} lg={3}>
            <MetricCard
              icon={FaUsers}
              value={mockDashboardInfo.totalAdmins}
              label="Administradores Activos"
            />
          </Col>
        </Row>

        {/* 3 Secciones */}
        <Row className="g-4">
          <Col lg={4}>
            <Card className="glass h-100">
              <Card.Header className="fw-bold">
                <FaFire /> Actividad Reciente
              </Card.Header>
              <ListGroup variant="flush">
                {mockDashboardInfo.actividadReciente.map((item, i) => (
                  <ListGroup.Item key={i}>{item}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="glass h-100">
              <Card.Header className="fw-bold">
                <FaBullhorn /> Promociones Destacadas
              </Card.Header>
              <ListGroup variant="flush">
                {mockDashboardInfo.promocionesDestacadas.map((promo, i) => (
                  <ListGroup.Item key={i}>
                    {promo.title}
                    <span className="float-end text-muted">
                      {promo.clicks} clics
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="glass h-100">
              <Card.Header className="fw-bold">
                <FaThumbsUp /> POIs más Visitados
              </Card.Header>
              <ListGroup variant="flush">
                {mockDashboardInfo.puntosPopulares.map((p, i) => (
                  <ListGroup.Item key={i}>
                    {p.name}
                    <span className="float-end text-muted">
                      {p.visitas} visitas
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        {/* NUEVA GRÁFICA */}
        <Row className="mt-5">
          <Col>
            <Card className="glass p-4 border-0 shadow-sm">
              <h4 className="mb-4 fw-bold">Comparativa de Visitas por POI</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockDashboardInfo.puntosPopulares}>
                  <CartesianGrid strokeOpacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitas" fill={kairosTheme.accentColor} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
