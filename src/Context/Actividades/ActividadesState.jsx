import React, { useReducer } from "react";
import axios from "axios";
import ActividadesContext from "./ActividadesContext";
import ActividadesReduce from "./ActividadesReduce";
import { GET_ACTIVIDADES_BY_USER, CREATE_ACTIVIDAD } from "../types";

const API_ACTIVIDADES_URL = "http://localhost:5219/api/Actividades";

const ActividadesState = ({ children }) => {
  const initialState = {
    actividades: [],
  };

  const [state, dispatch] = useReducer(ActividadesReduce, initialState);

  /**
   * Obtiene actividades por ID de usuario (GET /api/Actividades/{idUsuario})
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
      throw error;
    }
  };

  /**
   * Registra una nueva actividad (POST /api/Actividades)
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

  return (
    <ActividadesContext.Provider
      value={{
        actividades: state.actividades,
        getActividadesByUsuario,
        createActividad,
      }}
    >
      {children}
    </ActividadesContext.Provider>
  );
};

export default ActividadesState;
