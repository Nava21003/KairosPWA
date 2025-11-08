import React, { useState } from "react";
import { Container, Card, Button, Table } from "react-bootstrap";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Menu,
  Mail,
  Key,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

const kairosTheme = {
  primaryColor: "#f8f9fa",
  secondaryColor: "#ffffff",
  accentColor: "#4ecca3",
  editButtonColor: "#17a2b8",
  dangerColor: "#dc3545",
  textDark: "#343a40",
};

const mockUsuarios = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    email: "juan.perez@kairos.com",
    rol: "Administrador",
    ultimoAcceso: "2024-11-05 10:30",
    estatus: true,
  },
  {
    id: 2,
    nombre: "María López Fernández",
    email: "maria.lopez@kairos.com",
    rol: "Editor de Contenido",
    ultimoAcceso: "2024-11-04 15:45",
    estatus: true,
  },
  {
    id: 3,
    nombre: "Carlos Gómez Ruiz",
    email: "carlos.gomez@kairos.com",
    rol: "Usuario Estándar",
    ultimoAcceso: "2024-10-20 08:00",
    estatus: false,
  },
  {
    id: 4,
    nombre: "Laura Torres Rivas",
    email: "laura.torres@kairos.com",
    rol: "Moderador",
    ultimoAcceso: "2024-11-05 11:00",
    estatus: true,
  },
];

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

  let bgColor = kairosTheme.editButtonColor;
  if (message.type === "success") bgColor = "#28a745";
  if (message.type === "danger") bgColor = kairosTheme.dangerColor;

  return (
    <div style={{ ...baseStyle, backgroundColor: bgColor }}>{message.text}</div>
  );
};

const GestionUsuarios = () => {
  const toggleSidebar = () => console.log("Sidebar toggle simulated.");

  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleEdit = (id) => {
    showMessage(`Abriendo modal de edición para Usuario ID: ${id}`, "info");
  };

  const handleCreate = () => {
    showMessage(`Abriendo modal para crear Nuevo Usuario`, "success");
  };

  const confirmDelete = (id) => {
    setConfirmingId(id);
  };

  const executeDelete = () => {
    const idToDelete = confirmingId;
    setUsuarios(usuarios.filter((u) => u.id !== idToDelete));
    showMessage(`Usuario ID: ${idToDelete} eliminado con éxito.`, "danger");
    setConfirmingId(null);
  };

  const cancelDelete = () => {
    showMessage(
      `Eliminación de Usuario ID: ${confirmingId} cancelada.`,
      "info"
    );
    setConfirmingId(null);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString.replace(" ", "T"));
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <Container fluid style={{ padding: "0px" }}>
      <style>{`
        /* Estilos de Contenedor General */
        body {
          background-color: ${kairosTheme.primaryColor}; /* Fondo muy claro */
          color: ${kairosTheme.textDark}; /* Texto oscuro */
          font-family: 'Inter', sans-serif;
        }

        /* El texto claro ahora se invierte para ser oscuro donde se necesite en un tema claro */
        .text-dark-contrast {
          color: ${kairosTheme.textDark} !important;
        }

        /* Estilos del Header */
        .header-usuarios {
          background: linear-gradient(145deg, ${kairosTheme.secondaryColor}, ${kairosTheme.primaryColor});
          padding: 35px;
          border-radius: 14px;
          margin-bottom: 30px;
          color: ${kairosTheme.textDark}; /* Texto oscuro en el header */
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1); /* Sombra más sutil */
          border: 1px solid #dee2e6;
        }

        .header-usuarios-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-left: 15px;
          display: flex;
          align-items: center;
        }
        
        /* Estilos de la Tabla */
        .table-container {
            background-color: ${kairosTheme.secondaryColor};
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        /* Estilos para el encabezado de la tabla (simulando table-light) */
        .table thead th {
          background-color: ${kairosTheme.primaryColor};
          color: ${kairosTheme.textDark} !important;
          font-weight: 700 !important;
          padding: 18px !important;
          font-size: 1.05rem;
          border-bottom: 2px solid #dee2e6;
        }
        
        /* Estilos para las filas de la tabla */
        .table tbody td {
          padding: 14px 18px !important;
          font-size: 1rem;
          color: ${kairosTheme.textDark} !important; /* Asegura el texto oscuro en las celdas */
        }
        
        /* Filas rayadas y hover para tema claro */
        .table-striped > tbody > tr:nth-of-type(odd) > * {
            background-color: rgba(0, 0, 0, 0.03); 
        }
        
        .table-hover > tbody > tr:hover > * {
            background-color: rgba(0, 0, 0, 0.08);
        }


        .table-action-btn {
          margin-right: 8px !important;
          font-size: 0.95rem !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: 0.5rem;
        }

        /* Estilos de botones específicos */
        .btn-accent {
            background-color: ${kairosTheme.accentColor};
            border-color: ${kairosTheme.accentColor};
            color: #fff; /* Texto blanco en botón de acento */
            font-weight: 600;
        }
        .btn-accent:hover {
            background-color: #3cae8a;
            border-color: #3cae8a;
            color: #fff;
        }
      `}</style>

      <MessageBox message={message} />

      <Container fluid className="p-4 p-sm-5">
        <div className="header-usuarios">
          <div className="d-flex align-items-center">
            <Button
              variant="outline-dark"
              onClick={toggleSidebar}
              style={{ borderRadius: "0.5rem" }}
            >
              <Menu />
            </Button>
            <span className="header-usuarios-title">
              <Users className="me-2 text-info" /> Gestión de Usuarios
            </span>
          </div>

          <Button
            className="btn-accent"
            onClick={handleCreate}
            style={{ fontSize: "1.1rem" }}
          >
            <UserPlus className="me-1" /> Nuevo Usuario
          </Button>
        </div>

        {confirmingId && (
          <Card
            className="shadow-lg mb-4 border-danger"
            style={{ backgroundColor: kairosTheme.secondaryColor }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center text-dark-contrast">
              <h5 className="mb-0">
                ¿Estás seguro de que quieres eliminar al Usuario ID:{" "}
                {confirmingId}? Esta acción es irreversible.
              </h5>
              <div>
                <Button
                  variant="danger"
                  onClick={executeDelete}
                  className="me-2"
                >
                  <Trash2 className="me-1" size={16} /> Sí, Eliminar
                </Button>
                <Button variant="outline-secondary" onClick={cancelDelete}>
                  <X className="me-1" size={16} /> Cancelar
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        <Card className="shadow-sm border-0 table-container">
          <Card.Body className="p-0">
            <div className="table-responsive">
              {usuarios.length > 0 ? (
                <Table striped hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre Completo</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Último Acceso</th>
                      <th className="text-center">Estatus</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>
                          <strong>{u.nombre}</strong>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Mail className="me-2 text-info" size={16} />
                            {u.email}
                          </div>
                        </td>
                        <td>{u.rol}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Key className="me-2 text-muted" size={16} />
                            {formatDateTime(u.ultimoAcceso)}
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge px-3 py-2 rounded-pill ${u.estatus ? "bg-success" : "bg-danger"}`}
                          >
                            {u.estatus ? (
                              <>
                                <CheckCircle size={14} className="me-1" />{" "}
                                Activo
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="me-1" /> Inactivo
                              </>
                            )}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            className="table-action-btn"
                            style={{
                              backgroundColor: kairosTheme.editButtonColor,
                              borderColor: kairosTheme.editButtonColor,
                            }}
                            onClick={() => handleEdit(u.id)}
                            disabled={!!confirmingId}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="table-action-btn"
                            onClick={() => confirmDelete(u.id)}
                            disabled={!!confirmingId}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-secondary">
                  <Users size={48} className="mb-3" />
                  <p className="lead">
                    No hay usuarios registrados en el sistema.
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

export default GestionUsuarios;
