import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "./NotFound";
import Login from "./Login";
import Explorar from "./Explorar";
import LayoutPublic from "../layout/LayoutPublic";
import LayoutAdmin from "../layout/LayoutAdmin";
import Dashboard from "./Dashboard";
import Home from "./Home";
import GestionPOIs from "./GestionPOIs";

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
        path: "/explorar",
        element: <Explorar />,
      },
    ],
  },

  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/admin/gestion",
        element: <GestionPOIs />,
      },
    ],
  },
]);
