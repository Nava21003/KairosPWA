import { Container, Card, Button } from "react-bootstrap";
import {
  FaMapMarkedAlt,
  FaPlus,
  FaRegEdit,
  FaTrashAlt,
  FaLocationArrow,
  FaBars,
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const kairosTheme = {
  primaryColor: "#111418",
  secondaryColor: "#1f1f24",
  accentColor: "#4ecca3",
  editButtonColor: "#17a2b8",
  textLight: "#f1f1f1",
};

const mockData = [
  {
    id: 1,
    name: "Parque Central",
    category: "Naturaleza",
    active: true,
    lat: 21.1211,
    lng: -101.6825,
  },
  {
    id: 2,
    name: "Cafetería La Nube",
    category: "Comercio",
    active: true,
    lat: 21.1231,
    lng: -101.684,
  },
  {
    id: 3,
    name: "Mirador del Sol",
    category: "Turismo",
    active: false,
    lat: 21.1199,
    lng: -101.6799,
  },
];

const GestionPOIs = () => {
  const { toggleSidebar } = useOutletContext();

  const handleEdit = (id) => alert(`Editar POI ${id}`);
  const handleDelete = (id) =>
    window.confirm("¿Seguro?") && alert(`Eliminado ${id}`);
  const handleViewMap = (lat, lng) =>
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");

  return (
    <Container fluid className="p-4">
      <style>{`
        .header-pois {
          background: linear-gradient(145deg, ${kairosTheme.primaryColor}, ${kairosTheme.secondaryColor});
          padding: 35px;
          border-radius: 14px;
          margin-bottom: 45px;
          color: ${kairosTheme.textLight};
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        }

        .header-pois-title {
          font-size: 2.4rem;
          font-weight: 800;
          margin-left: 15px;
        }

        table {
          font-size: 1.25rem !important;
        }

        table th {
          font-weight: 700 !important;
          padding: 18px !important;
        }

        table td {
          padding: 18px !important;
        }

        .table-action-btn {
          margin-right: 14px !important;
          font-size: 1.1rem !important;
        }

        .table-action-btn:last-child {
          margin-right: 0 !important;
        }
      `}</style>

      {/* HEADER similar al Dashboard */}
      <div className="header-pois">
        <div className="d-flex align-items-center">
          <Button variant="outline-light" onClick={toggleSidebar}>
            <FaBars />
          </Button>
          <span className="header-pois-title">
            <FaMapMarkedAlt className="me-2" /> Gestión de Puntos de Interés
          </span>
        </div>

        <Button
          style={{
            background: kairosTheme.accentColor,
            border: "none",
            fontSize: "1.2rem",
          }}
        >
          <FaPlus className="me-1" /> Nuevo POI
        </Button>
      </div>

      {/* TABLA MEJORADA */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      <span
                        className={`badge ${p.active ? "bg-success" : "bg-danger"} px-3 py-2`}
                      >
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewMap(p.lat, p.lng)}
                      >
                        <FaLocationArrow />
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        className="table-action-btn"
                        style={{
                          background: kairosTheme.editButtonColor,
                          border: "none",
                        }}
                        onClick={() => handleEdit(p.id)}
                      >
                        <FaRegEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="table-action-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionPOIs;
