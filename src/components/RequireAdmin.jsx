import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../Context/Auth/AuthContext";

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleName =
    user?.idRolNavigation?.nombreRol ||
    user?.nombreRol ||
    user?.role ||
    user?.rol;

  if (!roleName || roleName.toString().toLowerCase() !== "administrador") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
