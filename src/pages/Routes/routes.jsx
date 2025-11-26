import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../Error/NotFound";
import Login from "../Login/Login";
import Explorar from "../Home/Explorar";
import LayoutPublic from "../../layout/LayoutPublic";
import LayoutAdmin from "../../layout/LayoutAdmin";
import RequireAdmin from "../../components/RequireAdmin";
import Home from "../Home/Home";
import NotFoundAdmin from "../Error/NotFoundAdmind";
import Registro from "../Login/Registro";
import Usuarios from "../Admin/GestionUsuarios";
import Roles from "../Admin/GestionRoles";
import GestionCategorias from "../Admin/GestionCategorias";
import GestionSocios from "../Admin/GestionSocios";
import GestionLugares from "../Admin/GestionLugares";
import GestionPromociones from "../Admin/GestionPromociones";
import GestionRutas from "../Admin/GestionRutas";
import GestionPOIs from "../Admin/GestionPOIs";
import GestionIntereses from "../Admin/GestionIntereses";
import GestionNotificaciones from "../Admin/GestionNotificaciones";
import MonitorActividad from "../Admin/MonitorActividad";
import Dashboard from "../Admin/Dashboard";
import Contactanos from "../Home/Contactanos";
import Faq from "../Home/FAQ";
import AdminMensajes from "../Admin/AdminMensajes";
import AdminFaq from "../Admin/AdminFaq";

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
        path: "/contacto",
        element: <Contactanos />,
      },
      {
        path: "/faq",
        element: <Faq />,
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
        path: "mensajes",
        element: <AdminMensajes />,
      },
      {
        path: "faq",
        element: <AdminFaq />,
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
