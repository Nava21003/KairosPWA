import React, { useReducer } from "react";
import axios from "axios";
import NotificacionesContext from "./NotificacionesContext";
import NotificacionesReduce from "./NotificacionesReduce";
import {
  GET_NOTIFICACIONES_BY_USER,
  CREATE_NOTIFICACION,
  DELETE_NOTIFICACION,
} from "../types";

const API_NOTIFICACIONES_URL = "http://localhost:5219/api/Notificaciones";

const NotificacionesState = ({ children }) => {
  const initialState = {
    notificaciones: [],
  };

  const [state, dispatch] = useReducer(NotificacionesReduce, initialState);

  // ----------------------------------
  // Métodos para NotificacionesController
  // ----------------------------------

  /**
   * Obtiene notificaciones por ID de usuario (GET /api/Notificaciones/{idUsuario})
   */
  const getNotificacionesByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_NOTIFICACIONES_URL}/${idUsuario}`);
      dispatch({ type: GET_NOTIFICACIONES_BY_USER, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener notificaciones:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Crea una nueva notificación (POST /api/Notificaciones)
   */
  const createNotificacion = async (notificacionData) => {
    try {
      const response = await axios.post(
        API_NOTIFICACIONES_URL,
        notificacionData
      );
      dispatch({ type: CREATE_NOTIFICACION, payload: response.data });
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Notificación):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina una notificación (DELETE /api/Notificaciones/{id})
   */
  const deleteNotificacion = async (id) => {
    try {
      await axios.delete(`${API_NOTIFICACIONES_URL}/${id}`);
      dispatch({ type: DELETE_NOTIFICACION, payload: id });
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Notificación):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  return (
    <NotificacionesContext.Provider
      value={{
        notificaciones: state.notificaciones,
        getNotificacionesByUsuario,
        createNotificacion,
        deleteNotificacion,
      }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
};

export default NotificacionesState;
