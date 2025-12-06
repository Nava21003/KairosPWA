import React, { useReducer } from "react";
import axios from "axios";
import ActividadesContext from "./ActividadesContext";
import ActividadesReduce from "./ActividadesReduce";
import {
  GET_ACTIVIDADES_BY_USER,
  CREATE_ACTIVIDAD,
  GET_HISTORIAL_VISITAS,
} from "../types";

const API_ACTIVIDADES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Actividades";
const API_LUGARES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Lugares";

const ActividadesState = ({ children }) => {
  const initialState = {
    actividades: [],
    historialVisitas: [],
  };

  const [state, dispatch] = useReducer(ActividadesReduce, initialState);

  /**
   * Obtiene actividades (Reportes manuales) por ID de usuario
   */
  const getActividadesByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_ACTIVIDADES_URL}/${idUsuario}`);
      dispatch({ type: GET_ACTIVIDADES_BY_USER, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener actividades:",
        error.response?.data || error.message
      );
    }
  };

  /**
   * Registra una nueva actividad manual
   */
  const createActividad = async (actividadData) => {
    try {
      const response = await axios.post(API_ACTIVIDADES_URL, actividadData);
      dispatch({ type: CREATE_ACTIVIDAD, payload: response.data });
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Actividad):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * GET /api/Lugares/historial/{idUsuario}
   */
  const getHistorialVisitas = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_LUGARES_URL}/historial/${idUsuario}`);

      dispatch({
        type: GET_HISTORIAL_VISITAS,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener historial de visitas:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <ActividadesContext.Provider
      value={{
        actividades: state.actividades,
        historialVisitas: state.historialVisitas,
        getActividadesByUsuario,
        createActividad,
        getHistorialVisitas,
      }}
    >
      {children}
    </ActividadesContext.Provider>
  );
};

export default ActividadesState;
