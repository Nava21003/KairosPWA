import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import AuthReduce from "./AuthReduce";
import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from "../types";

const API_AUTH_URL = "http://localhost:5219/api/Auth";

const AuthState = ({ children }) => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  const [state, dispatch] = useReducer(AuthReduce, initialState);

  /**
   * Inicia sesión (POST /api/Auth/login)
   * @param {object} credenciales
   */
  const login = async (credenciales) => {
    try {
      const res = await axios.post(`${API_AUTH_URL}/login`, credenciales);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
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
