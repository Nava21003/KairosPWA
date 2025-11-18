import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import AuthReduce from "./AuthReduce";
import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from "../types";

const API_AUTH_URL = "http://localhost:5219/api/Auth";

// Nota: Inicializa el estado con valores de localStorage si existen para persistencia
const AuthState = ({ children }) => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  const [state, dispatch] = useReducer(AuthReduce, initialState);

  // ----------------------------------
  // Métodos para AuthController
  // ----------------------------------

  /**
   * Inicia sesión (POST /api/Auth/login)
   * @param {object} credenciales - { correo, contrasena }
   */
  const login = async (credenciales) => {
    try {
      const res = await axios.post(`${API_AUTH_URL}/login`, credenciales);

      // Opcional: Almacenar token en localStorage para persistencia
      // localStorage.setItem('token', res.data.token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data, // { success, message, token, user }
      });
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
   * @param {object} userData - { nombre, apellido, correo, contrasena, fotoPerfil }
   */
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_AUTH_URL}/register`, userData);

      // Opcional: Almacenar token en localStorage para persistencia
      // localStorage.setItem('token', res.data.token);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data, // { success, message, token, user }
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
    // localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
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
