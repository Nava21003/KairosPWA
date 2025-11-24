import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "./NotFound";
import Login from "./Login";
import Explorar from "./Explorar";
import LayoutPublic from "../layout/LayoutPublic";
import LayoutAdmin from "../layout/LayoutAdmin";
import RequireAdmin from "../components/RequireAdmin";
import Dashboard from "./Dashboard";
import Home from "./Home";
import NotFoundAdmin from "./NotFoundAdmind";
import Registro from "./Registro";

// Importaciones de Gestión (Admin)
import Usuarios from "./GestionUsuarios";
import Roles from "./GestionRoles";
import GestionCategorias from "./GestionCategorias";
import GestionSocios from "./GestionSocios";
import GestionLugares from "./GestionLugares";
import GestionPromociones from "./GestionPromociones";
import GestionRutas from "./GestionRutas";
import GestionPOIs from "./GestionPOIs";
import GestionIntereses from "./GestionIntereses";
import GestionNotificaciones from "./GestionNotificaciones";
import MonitorActividad from "./MonitorActividad";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublic />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registro",
        element: <Registro />,
      },
      {
        path: "/explorar",
        element: <Explorar />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <LayoutAdmin />
      </RequireAdmin>
    ),
    errorElement: <NotFoundAdmin />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // --- GESTIÓN DE CONTENIDO ---
      {
        path: "categorias",
        element: <GestionCategorias />,
      },
      {
        path: "intereses",
        element: <GestionIntereses />,
      },
      {
        path: "lugares",
        element: <GestionLugares />,
      },
      {
        path: "rutas",
        element: <GestionRutas />,
      },
      {
        path: "pois",
        element: <GestionPOIs />,
      },
      {
        path: "promociones",
        element: <GestionPromociones />,
      },

      // --- ADMINISTRACIÓN ---
      {
        path: "socios",
        element: <GestionSocios />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "usuarios",
        element: <Usuarios />,
      },
      {
        path: "notificaciones",
        element: <GestionNotificaciones />,
      },
      {
        path: "actividad",
        element: <MonitorActividad />,
      },
      {
        path: "configuracion",
        element: (
          <div className="p-5 text-center">Configuración en construcción</div>
        ),
      },
    ],
  },
]);
