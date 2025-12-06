import React, { useContext } from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../Context/Auth/AuthContext";

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
  MessageCircle,
} from "lucide-react";
import { BiMoney } from "react-icons/bi";

const MENU_STRUCTURE = [
  {
    header: null,
    items: [{ path: "/admin", icon: Home, label: "Dashboard", end: true }],
  },
  {
    header: "Gestión de Contenido",
    items: [
      { path: "/admin/categorias", icon: Layers, label: "Categorías" },
      { path: "/admin/intereses", icon: Heart, label: "Intereses" },
      { path: "/admin/lugares", icon: Store, label: "Lugares" },
      { path: "/admin/rutas", icon: Map, label: "Rutas" },
      { path: "/admin/pois", icon: MapPin, label: "Puntos de Interés" },
      { path: "/admin/promociones", icon: Tags, label: "Promociones" },
    ],
  },
  {
    header: "Administración",
    items: [
      { path: "/admin/socios", icon: Handshake, label: "Socios Afiliados" },
      { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
      { path: "/admin/roles", icon: ShieldCheck, label: "Roles y Permisos" },
    ],
  },
  {
    header: "Comunicación & Monitoreo",
    items: [
      { path: "/admin/comentarios", icon: MessageCircle, label: "Comentarios" },
      { path: "/admin/mensajes", icon: Mail, label: "Mensajes" },
      { path: "/admin/faq", icon: HelpCircle, label: "FAQ" },
      { path: "/admin/notificaciones", icon: Bell, label: "Notificaciones" },
      { path: "/admin/actividad", icon: TrendingUp, label: "Actividad Global" },
    ],
  },
  {
    header: "Sistema",
    items: [{ path: "/admin/ganancias", icon: BiMoney, label: "Ganancias" }],
  },
];

const NavbarAdmin = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  const SidebarLink = ({ to, icon: Icon, label, end = false }) => {
    const isActive = end
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <div
        onClick={() => navigate(to)}
        className={`nav-link-kairos ${isActive ? "active" : ""}`}
        role="button"
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
          white-space: nowrap;
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
          user-select: none;
          cursor: pointer;
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
          {MENU_STRUCTURE.map((section, index) => (
            <React.Fragment key={index}>
              {section.header && (
                <div className="sidebar-divider">{section.header}</div>
              )}

              {section.items.map((item, subIndex) => (
                <SidebarLink
                  key={subIndex}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  end={item.end}
                />
              ))}
            </React.Fragment>
          ))}
        </Nav>
      </div>

      <br />
      <div className="px-3 mb-4">
        <Button className="logout-btn" onClick={handleLogout}>
          <LogOut className="me-2" size={18} /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
