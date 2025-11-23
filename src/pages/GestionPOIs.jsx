import React, { useState, useContext, useEffect } from "react";
import { Container, Card, Button, Table, Spinner } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import LugaresContext from "../Context/Lugares/LugaresContext";
import CategoriasContext from "../Context/Categorias/CategoriasContext";

// Tema
const kairosTheme = {
  primaryColor: "#f8f9fa",
  secondaryColor: "#ffffff",
  accentColor: "#4ecca3",
  editButtonColor: "#17a2b8",
  dangerColor: "#dc3545",
  textDark: "#343a40",
};

const MessageBox = ({ message }) => {
  if (!message) return null;

  const baseStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    color: "#fff",
    fontWeight: 600,
    transition: "opacity 0.3s",
  };

  const bgColor =
    message.type === "success"
      ? "#28a745"
      : message.type === "danger"
        ? kairosTheme.dangerColor
        : message.type === "warning"
          ? "#ffc107"
          : kairosTheme.editButtonColor;

  return (
    <div style={{ ...baseStyle, backgroundColor: bgColor }}>{message.text}</div>
  );
};

const GestionPOIs = () => {
  // CONTEXTOS
  const { lugares, getLugares, deleteLugar } = useContext(LugaresContext);
  const { categorias, getCategorias } = useContext(CategoriasContext);

  // ESTADOS
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  // Sidebar (si no existe, usa función mock)
  const context = useOutletContext();
  const toggleSidebar =
    context?.toggleSidebar || (() => console.log("Sidebar toggle simulated."));

  // Cargar datos al inicio
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([getLugares(), getCategorias()]);
      } catch (error) {
        showMessage("Error al cargar datos iniciales.", "danger");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const getCategoryName = (idCategoria) => {
    const categoria = categorias.find((c) => c.idCategoria === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  // --- MÉTODOS ---

  const handleEdit = (id) => {
    showMessage(`Abriendo modal para editar POI ID: ${id}`, "info");
  };

  const confirmDelete = (id) => {
    const poi = lugares.find((p) => p.idLugar === id);
    const action = poi?.estatus ? "desactivar" : "eliminar";
    setConfirmingId({ id, action });
  };

  const executeDelete = async () => {
    const { id, action } = confirmingId;
    setConfirmingId(null);

    setLoading(true);
    try {
      await deleteLugar(id);
      showMessage(
        `POI ID ${id} ha sido ${action === "desactivar" ? "desactivado" : "eliminado"}.`,
        "success"
      );
    } catch (error) {
      showMessage(`Error al ${action} el POI.`, "danger");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    showMessage("Acción cancelada", "info");
    setConfirmingId(null);
  };

  const handleViewMap = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      showMessage("No hay ubicación disponible.", "warning");
    }
  };

  const handleCreate = () => {
    showMessage("Abriendo modal para crear nuevo POI", "success");
  };

  // POI actual en confirmación
  const currentConfirmingPoi = confirmingId
    ? lugares.find((p) => p.idLugar === confirmingId.id)
    : null;

  const confirmationMessage = currentConfirmingPoi
    ? `¿Seguro que deseas ${confirmingId.action} el POI "${currentConfirmingPoi.nombre}" (ID: ${currentConfirmingPoi.idLugar})?`
    : "";

  // LOADING UI
  if (loading) {
    return (
      <Container fluid className="p-4 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando Puntos de Interés...</p>
      </Container>
    );
  }

  return (
    <Container fluid style={{ padding: "0px" }}>
      <MessageBox message={message} />

      {/* ESTILOS */}
      <style>{`
        body {
          background-color: ${kairosTheme.primaryColor};
          color: ${kairosTheme.textDark};
          font-family: 'Inter', sans-serif;
        }

        .header-pois {
          background: linear-gradient(145deg, ${kairosTheme.secondaryColor}, ${kairosTheme.primaryColor});
          padding: 35px;
          border-radius: 14px;
          margin-bottom: 30px;
          color: ${kairosTheme.textDark};
          display: flex;
          justify-content: space-between;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          border: 1px solid #dee2e6;
        }

        .table-container {
          background-color: ${kairosTheme.secondaryColor};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .btn-accent {
          background-color: ${kairosTheme.accentColor};
          border-color: ${kairosTheme.accentColor};
          color: ${kairosTheme.textDark};
          font-weight: 600;
        }
      `}</style>

      <Container fluid className="p-4 p-sm-5">
        {/* ENCABEZADO */}
        <div className="header-pois">
          <div className="d-flex align-items-center">
            <Button variant="outline-dark" onClick={toggleSidebar}>
              <i className="bi bi-list" />
            </Button>
            <span className="ms-3 fs-3 fw-bold">
              <i className="bi bi-geo-alt-fill text-info me-2" />
              Gestión de Puntos de Interés
            </span>
          </div>

          <Button className="btn-accent" onClick={handleCreate}>
            <i className="bi bi-plus-lg me-1" /> Nuevo POI
          </Button>
        </div>

        {/* CONFIRMACIÓN */}
        {confirmingId && (
          <Card className="shadow-lg mb-4 border-danger">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{confirmationMessage}</h5>
              <div>
                <Button
                  variant="danger"
                  className="me-3"
                  onClick={executeDelete}
                >
                  <i className="bi bi-trash-fill me-1" />
                  Sí,{" "}
                  {confirmingId.action === "desactivar"
                    ? "Desactivar"
                    : "Eliminar"}
                </Button>
                <Button variant="outline-secondary" onClick={cancelDelete}>
                  Cancelar
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* TABLA */}
        <Card className="table-container">
          <Card.Body className="p-0">
            <div className="table-responsive">
              {lugares?.length ? (
                <Table striped hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th className="text-center">Estado</th>
                      <th className="text-center">Ubicación</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lugares.map((p) => (
                      <tr key={p.idLugar}>
                        <td>{p.idLugar}</td>
                        <td>{p.nombre}</td>
                        <td>{getCategoryName(p.idCategoria)}</td>

                        <td className="text-center">
                          <span
                            className={`badge px-3 py-2 ${
                              p.estatus ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {p.estatus ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleViewMap(p.latitud, p.longitud)}
                          >
                            <i className="bi bi-pin-map-fill" /> Ver Mapa
                          </Button>
                        </td>

                        <td className="text-center">
                          <Button
                            size="sm"
                            className="me-2"
                            style={{
                              backgroundColor: kairosTheme.editButtonColor,
                              color: "#fff",
                            }}
                            onClick={() => handleEdit(p.idLugar)}
                          >
                            <i className="bi bi-pencil-square" />
                          </Button>

                          <Button
                            size="sm"
                            variant={p.estatus ? "danger" : "success"}
                            onClick={() => confirmDelete(p.idLugar)}
                          >
                            <i
                              className={`bi ${
                                p.estatus ? "bi-x-lg" : "bi-check-lg"
                              }`}
                            />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-secondary">
                  <i
                    className="bi bi-geo-alt"
                    style={{ fontSize: "48px", color: "#ccc" }}
                  />
                  <p className="lead mt-3">
                    No hay Puntos de Interés registrados.
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default GestionPOIs;
