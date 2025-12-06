import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import AuthReduce from "./AuthReduce";
import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from "../types";

const API_AUTH_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Auth";

const AuthState = ({ children }) => {
  const loadPersisted = () => {
    try {
      const raw =
        localStorage.getItem("auth") || sessionStorage.getItem("auth");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("Error parsing persisted auth:", err);
      return null;
    }
  };

  const persisted = loadPersisted();

  const initialState = {
    user: persisted?.user || null,
    token: persisted?.token || null,
    isAuthenticated: !!persisted?.token,
  };

  const [state, dispatch] = useReducer(AuthReduce, initialState);

  /**
   * Inicia sesión (POST /api/Auth/login)
   * @param {object} credenciales
   */
  const login = async (credenciales) => {
    try {
      const res = await axios.post(`${API_AUTH_URL}/login`, credenciales);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      const remember = credenciales?.remember !== false;
      try {
        const serialized = JSON.stringify(res.data);
        if (remember) {
          localStorage.setItem("auth", serialized);
          sessionStorage.removeItem("auth");
        } else {
          sessionStorage.setItem("auth", serialized);
          localStorage.removeItem("auth");
        }
      } catch (err) {
        console.warn("No se pudo persistir el auth:", err);
      }

      return res.data;
    } catch (error) {
      console.error(
        "Error de Login:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  /**
   * Registra un nuevo usuario (POST /api/Auth/register)
   * @param {object} userData
   */
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_AUTH_URL}/register`, userData);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error de Registro:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  /**
   * Cierra la sesión
   */
  const logout = () => {
    dispatch({ type: LOGOUT });
    try {
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    } catch (err) {
      console.warn("Error clearing persisted auth:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
