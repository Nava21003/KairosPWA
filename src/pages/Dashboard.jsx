import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

// ASEGÚRATE QUE ESTAS RUTAS SON CORRECTAS
import PromocionesContext from "../Context/Promociones/PromocionesContext";
import LugaresContext from "../Context/Lugares/LugaresContext";
import UserContext from "../Context/User/UserContext";
import ActividadesContext from "../Context/Actividades/ActividadesContext";
import AuthContext from "../Context/Auth/AuthContext";

// 🎨 TEMA KAIROS (Light Mode con Neumorfismo sutil)
const kairosLightTheme = {
  bgBody: "#F0F2F5", // Fondo general, blanco muy suave
  bgCard: "#FFFFFF", // Fondo de las tarjetas, blanco puro
  textPrimary: "#212529", // Texto principal, gris oscuro
  textSecondary: "#6C757D", // Texto secundario, gris medio
  accentColor: "#10B981", // Verde esmeralda (tu color de acento)
  accentGlow: "rgba(16, 185, 129, 0.2)", // Sombra/brillo suave del acento
  borderColor: "#E0E0E0", // Bordes sutiles
  cardShadow: "0 8px 30px rgba(0, 0, 0, 0.08)", // Sombra para profundidad
};

// 🔥 Card de métricas (Neumorfismo sutil)
const MetricCard = ({ iconClass, value, label, isLoading }) => (
  <Card
    className="h-100 border-0 metric-card-light"
    style={{
      backgroundColor: kairosLightTheme.bgCard,
      boxShadow: kairosLightTheme.cardShadow,
      borderRadius: "16px", // Bordes redondeados
    }}
  >
    <Card.Body className="text-center p-4">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{
          width: "60px",
          height: "60px",
          backgroundColor: kairosLightTheme.bgCard,
          border: `1px solid ${kairosLightTheme.borderColor}`,
          boxShadow: `inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8), 0 0 10px ${kairosLightTheme.accentGlow}`,
        }}
      >
        <i
          className={`bi ${iconClass}`}
          style={{
            color: kairosLightTheme.accentColor,
            fontSize: "30px",
            textShadow: `0 0 8px ${kairosLightTheme.accentGlow}`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: "2.4rem",
          fontWeight: 800,
          color: kairosLightTheme.textPrimary,
        }}
      >
        {isLoading ? (
          <Spinner animation="border" size="sm" variant="success" />
        ) : (
          value
        )}
      </div>
      <div
        className="mt-2"
        style={{
          fontSize: "1rem",
          fontWeight: 500,
          color: kairosLightTheme.textSecondary,
        }}
      >
        {label}
      </div>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { toggleSidebar } = useOutletContext();

  const { promociones, getPromociones } = useContext(PromocionesContext);
  const { lugares, getLugares } = useContext(LugaresContext);
  const { users, getUsers } = useContext(UserContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  // 🔄 CARGA DE DATOS
  useEffect(() => {
    if (!getPromociones || !getLugares || !getUsers) {
      console.error(
        "Faltan funciones de carga en el contexto. Revisa tus Providers."
      );
      setLoading(false);
      return;
    }

    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([getPromociones(), getLugares(), getUsers()]);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []); // ⚠️ Evita render infinito

  // 📊 MÉTRICAS
  const dashboardData = useMemo(() => {
    const safeLugares = lugares ?? [];
    const safePromociones = promociones ?? [];
    const safeUsers = users ?? [];

    const totalPois = safeLugares.length;

    const totalAdmins = safeUsers.filter(
      (u) =>
        u.idRol === 1 ||
        u.idRolNavigation?.nombreRol?.toLowerCase() === "administrador"
    ).length;

    const rutasGeneradas = 1890;
    const clicsPromociones = 215;

    const promocionesActivas = safePromociones.filter(
      (p) => p.estatus === true
    );

    const promocionesDestacadas = promocionesActivas.slice(0, 3).map((p) => ({
      title: p.titulo,
      clicks: Math.floor(Math.random() * 200) + 50,
    }));

    const puntosPopulares = safeLugares
      .map((lugar) => ({
        name: lugar.nombre,
        visitas: Math.floor(Math.random() * 2000) + 100,
      }))
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 5);

    const actividadReciente = [
      `Total de usuarios registrados: ${safeUsers.length}`,
      ...promocionesActivas
        .slice(0, 1)
        .map((p) => `Promoción activa: ${p.titulo}`),
      ...safeLugares
        .slice(0, 1)
        .map((l) => `Último lugar registrado: ${l.nombre}`),
      `Total de Lugares activos: ${safeLugares.filter((l) => l.estatus === true).length}`,
    ];

    return {
      totalPois,
      totalAdmins,
      rutasGeneradas,
      clicsPromociones,
      promocionesDestacadas,
      puntosPopulares,
      actividadReciente,
      userName: user?.nombre || "Administrador",
    };
  }, [lugares, promociones, users, user]);

  // 📈 Gráfica
  const renderBarChart = (data) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeOpacity={0.4}
          vertical={false}
          stroke={kairosLightTheme.borderColor}
        />
        <XAxis
          dataKey="name"
          stroke={kairosLightTheme.textSecondary}
          tick={{ fill: kairosLightTheme.textSecondary, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke={kairosLightTheme.textSecondary}
          tick={{ fill: kairosLightTheme.textSecondary, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: kairosLightTheme.bgCard,
            border: `1px solid ${kairosLightTheme.accentColor}`,
            color: kairosLightTheme.textPrimary,
            borderRadius: "8px",
            boxShadow: kairosLightTheme.cardShadow,
          }}
          itemStyle={{ color: kairosLightTheme.textPrimary }}
          labelStyle={{ color: kairosLightTheme.accentColor }}
        />
        <Bar dataKey="visitas" name="Visitas" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={kairosLightTheme.accentColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <style>{`
        body {
          background-color: ${kairosLightTheme.bgBody};
          color: ${kairosLightTheme.textPrimary};
          font-family: 'Inter', sans-serif !important;
        }

        .dashboard-header {
          background: ${kairosLightTheme.bgCard};
          border-left: 5px solid ${kairosLightTheme.accentColor};
          padding: 30px 35px;
          border-radius: 18px;
          margin-bottom: 40px;
          box-shadow: ${kairosLightTheme.cardShadow};
        }

        .dashboard-header-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: ${kairosLightTheme.textPrimary};
        }

        .metric-card-light {
          transition: all 0.3s ease-in-out;
        }

        .metric-card-light:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px ${kairosLightTheme.accentGlow};
        }

        .card-general {
            background-color: ${kairosLightTheme.bgCard};
            border: 1px solid ${kairosLightTheme.borderColor};
            border-radius: 16px;
            box-shadow: ${kairosLightTheme.cardShadow};
        }

        .card-header-general {
            background-color: transparent;
            border-bottom: 1px solid ${kairosLightTheme.borderColor};
            padding: 1.2rem 1.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: ${kairosLightTheme.textPrimary};
        }

        .list-group-item {
          background-color: transparent !important;
          border-color: ${kairosLightTheme.borderColor} !important;
          color: ${kairosLightTheme.textSecondary};
          padding: 1rem 1.5rem;
        }
        .list-group-item:last-child {
          border-bottom: none !important;
        }
        .list-group-item strong {
            color: ${kairosLightTheme.textPrimary};
        }

        @media (max-width: 768px) {
          .dashboard-header-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <Container fluid className="p-4">
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={toggleSidebar}
              className="border-0 d-lg-none" // Solo visible en dispositivos pequeños
            >
              <i className="bi bi-list fs-4" />
            </Button>
            <span className="dashboard-header-title">Panel de Control</span>
          </div>
          <div
            className="fw-bold fs-5"
            style={{ color: kairosLightTheme.textPrimary }}
          >
            Bienvenido,{" "}
            <span style={{ color: kairosLightTheme.accentColor }}>
              {dashboardData.userName}
            </span>
          </div>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="success" />
            <p
              className="mt-2"
              style={{ color: kairosLightTheme.textSecondary }}
            >
              Cargando datos...
            </p>
          </div>
        )}

        {!loading && (
          <>
            {/* MÉTRICAS */}
            <Row className="mb-5 g-4">
              <Col sm={6} lg={3}>
                <MetricCard
                  iconClass="bi-tag-fill"
                  value={dashboardData.clicsPromociones}
                  label="Clics en Promociones"
                  isLoading={loading}
                />
              </Col>
              <Col sm={6} lg={3}>
                <MetricCard
                  iconClass="bi-signpost-fill"
                  value={dashboardData.rutasGeneradas}
                  label="Rutas Generadas"
                  isLoading={loading}
                />
              </Col>
              <Col sm={6} lg={3}>
                <MetricCard
                  iconClass="bi-geo-alt-fill"
                  value={dashboardData.totalPois}
                  label="POIs Registrados"
                  isLoading={loading}
                />
              </Col>
              <Col sm={6} lg={3}>
                <MetricCard
                  iconClass="bi-people-fill"
                  value={dashboardData.totalAdmins}
                  label="Administradores"
                  isLoading={loading}
                />
              </Col>
            </Row>

            {/* SECCIONES DE LISTAS */}
            <Row className="g-4 mb-5">
              {/* Actividad Reciente */}
              <Col lg={4}>
                <Card className="h-100 card-general">
                  <Card.Header className="card-header-general">
                    <i
                      className="bi bi-fire me-2"
                      style={{ color: kairosLightTheme.accentColor }}
                    />{" "}
                    Actividad Reciente
                  </Card.Header>
                  <ListGroup variant="flush">
                    {dashboardData.actividadReciente.map((item, i) => (
                      <ListGroup.Item key={i}>{item}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>

              {/* Promociones Destacadas */}
              <Col lg={4}>
                <Card className="h-100 card-general">
                  <Card.Header className="card-header-general">
                    <i
                      className="bi bi-megaphone-fill me-2"
                      style={{ color: kairosLightTheme.accentColor }}
                    />{" "}
                    Promociones Destacadas
                  </Card.Header>
                  <ListGroup variant="flush">
                    {dashboardData.promocionesDestacadas.map((promo, i) => (
                      <ListGroup.Item key={i}>
                        <strong>{promo.title}</strong>
                        <span className="float-end text-muted">
                          {promo.clicks} clics
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>

              {/* POIs Más Visitados */}
              <Col lg={4}>
                <Card className="h-100 card-general">
                  <Card.Header className="card-header-general">
                    <i
                      className="bi bi-hand-thumbs-up-fill me-2"
                      style={{ color: kairosLightTheme.accentColor }}
                    />{" "}
                    POIs Más Visitados
                  </Card.Header>
                  <ListGroup variant="flush">
                    {dashboardData.puntosPopulares.map((p, i) => (
                      <ListGroup.Item key={i}>
                        <strong>{p.name}</strong>
                        <span className="float-end text-muted">
                          {p.visitas} visitas
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            {/* GRÁFICA */}
            <Row className="mb-5">
              <Col>
                <Card className="card-general p-4">
                  <h4
                    className="mb-4 fw-bold"
                    style={{ color: kairosLightTheme.textPrimary }}
                  >
                    Comparativa de Visitas por POI
                  </h4>
                  {renderBarChart(dashboardData.puntosPopulares)}
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
