import React, { useContext } from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"; // Agregamos useLocation
import AuthContext from "../Context/Auth/AuthContext";

// Iconos
import {
  Home,
  Layers,
  Heart,
  Handshake,
  Store,
  Map,
  MapPin,
  Tags,
  Users,
  ShieldCheck,
  Bell,
  TrendingUp,
  Settings,
  LogOut,
  Mail,
  HelpCircle,
} from "lucide-react";

const NavbarAdmin = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual manualmente
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  // --- COMPONENTE AUXILIAR PARA LOS ENLACES ---
  // Esto hace que el código sea más limpio y evita repetir el onClick
  const SidebarLink = ({ to, icon: Icon, label, end = false }) => {
    // Verificamos si el link está activo
    // Si 'end' es true, la ruta debe ser exacta. Si no, verifica si empieza con ella.
    const isActive = end
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <div
        onClick={() => navigate(to)}
        className={`nav-link-kairos ${isActive ? "active" : ""}`}
        style={{ cursor: "pointer" }} // Importante para la UX
      >
        <Icon className="me-3" size={18} /> {label}
      </div>
    );
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <style>{`
        .sidebar { 
          width: 260px; 
          background: linear-gradient(180deg, #1b1b1d, #2b2b2e, #141414);
          color: #dcdcdc; 
          transition: width .3s, transform .3s; 
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          box-shadow: 4px 0 15px rgba(0,0,0,0.45);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Scrollbar personalizado */
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
        }

        .sidebar-collapsed { 
          width: 0; padding: 0; overflow: hidden; 
        }

        .sidebar-header {
          text-align: center; color: #ffffff; font-weight: 700;
          letter-spacing: 1px; background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(6px); border-radius: 0 0 6px 6px;
        }

        .sidebar-divider {
            font-size: 0.70rem; text-transform: uppercase;
            letter-spacing: 1.5px; color: #6c757d;
            margin: 20px 0 8px 10px; font-weight: 700; opacity: 0.8;
        }

        .nav-link-kairos { 
          color: #dcdcdc !important;
          margin-bottom: 4px;
          padding: 10px 14px !important;
          border-radius: 8px;
          display: flex; align-items: center;
          transition: all .25s;
          font-weight: 500; font-size: 0.95rem;
          user-select: none; /* Evita que se seleccione el texto al hacer click rápido */
        }

        .nav-link-kairos:hover { 
          background: rgba(255, 255, 255, 0.1);
          color: white !important;
          transform: translateX(4px); 
        }

        .nav-link-kairos.active { 
          background: linear-gradient(90deg, #3e3e3e, #545454);
          color: #4ecca3 !important;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        }

        .logout-btn {
          background: rgba(192, 57, 43, 0.1) !important;
          color: #e74c3c !important;
          border: 1px solid #e74c3c !important;
          width: 100%; font-weight: 600; padding: 10px;
          border-radius: 8px; display: flex;
          align-items: center; justify-content: center; transition: .25s;
        }

        .logout-btn:hover {
          background: #c0392b !important;
          color: white !important;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
        }
      `}</style>

      <div>
        <div className="sidebar-header mb-3 p-3">🏛️ Kairos Admin</div>

        <Nav className="flex-column px-3">
          {/* Dashboard (end=true para coincidencia exacta) */}
          <SidebarLink to="/admin" icon={Home} label="Dashboard" end={true} />

          <div className="sidebar-divider">Gestión de Contenido</div>

          <SidebarLink
            to="/admin/categorias"
            icon={Layers}
            label="Categorías"
          />
          <SidebarLink to="/admin/intereses" icon={Heart} label="Intereses" />
          <SidebarLink to="/admin/lugares" icon={Store} label="Lugares" />
          <SidebarLink to="/admin/rutas" icon={Map} label="Rutas" />
          <SidebarLink
            to="/admin/pois"
            icon={MapPin}
            label="Puntos de Interés"
          />
          <SidebarLink
            to="/admin/promociones"
            icon={Tags}
            label="Promociones"
          />

          {/* === SECCIÓN: ADMINISTRACIÓN === */}
          <div className="sidebar-divider">Administración</div>

          <SidebarLink
            to="/admin/socios"
            icon={Handshake}
            label="Socios Afiliados"
          />
          <SidebarLink to="/admin/usuarios" icon={Users} label="Usuarios" />
          <SidebarLink
            to="/admin/roles"
            icon={ShieldCheck}
            label="Roles y Permisos"
          />

          {/* === SECCIÓN: COMUNICACIÓN & DATOS === */}
          <div className="sidebar-divider">Comunicación & Monitoreo</div>

          <SidebarLink to="/admin/mensajes" icon={Mail} label="Mensajes" />
          <SidebarLink to="/admin/faq" icon={HelpCircle} label="FAQ" />
          <SidebarLink
            to="/admin/notificaciones"
            icon={Bell}
            label="Notificaciones"
          />
          <SidebarLink
            to="/admin/actividad"
            icon={TrendingUp}
            label="Actividad Global"
          />

          {/* === SECCIÓN: SISTEMA === */}
          <div className="sidebar-divider">Sistema</div>

          <SidebarLink
            to="/admin/configuracion"
            icon={Settings}
            label="Configuración"
          />
        </Nav>
      </div>

      <div className="px-3 mb-4">
        <Button className="logout-btn" onClick={handleLogout}>
          <LogOut className="me-2" size={18} /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
