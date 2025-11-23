import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "./NotFound";
import Login from "./Login";
import Explorar from "./Explorar";
import LayoutPublic from "../layout/LayoutPublic";
import LayoutAdmin from "../layout/LayoutAdmin";
import Dashboard from "./Dashboard";
import Home from "./Home";
import GestionPOIs from "./GestionPOIs";
import NotFoundAdmin from "./NotFoundAdmind";
import Usuarios from "./GestionUsuarios";
import Roles from "./GestionRoles";
import Registro from "./Registro";
import GestionCategorias from "./GestionCategorias";
import GestionSocios from "./GestionSocios";
import GestionLugares from "./GestionLugares";
import GestionPromociones from "./GestionPromociones";

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
    element: <LayoutAdmin />,
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
        path: "socios",
        element: <GestionSocios />,
      },
      {
        path: "lugares",
        element: <GestionLugares />,
      },
      {
        path: "gestion",
        element: <GestionPOIs />,
      },
      {
        path: "promociones",
        element: <GestionPromociones />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "usuarios",
        element: <Usuarios />,
      },
    ],
  },
]);
