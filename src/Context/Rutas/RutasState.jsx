import React, { useReducer } from "react";
import axios from "axios";

import RutasContext from "./RutasContext";
import RutasReducer from "./RutasReducer";

import {
  GET_RUTAS,
  CREATE_RUTA,
  UPDATE_RUTA,
  DELETE_RUTA,
  GET_LUGARES_PARA_RUTAS,
} from "../types";

const API_RUTAS_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Rutas";
const API_LUGARES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Lugares";

const RutasState = ({ children }) => {
  const initialState = {
    rutas: [],
    lugaresDisponibles: [],
  };

  const [state, dispatch] = useReducer(RutasReducer, initialState);

  /* ================================
        GET - Obtener rutas
  ================================= */
  const getRutas = async () => {
    try {
      const res = await axios.get(API_RUTAS_URL);
      dispatch({ type: GET_RUTAS, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener rutas:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /* ================================
        GET - Obtener Lugares
  ================================= */
  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES_PARA_RUTAS, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error al obtener lugares:", error);
      throw error;
    }
  };

  /* ================================
        POST - Crear Ruta
  ================================= */
  const createRuta = async (rutaData) => {
    try {
      const response = await axios.post(API_RUTAS_URL, rutaData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Ruta):",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data || "Error desconocido al crear ruta."
      );
    }
  };

  /* ================================
        PUT - Actualizar Ruta
  ================================= */
  const updateRuta = async (id, rutaData) => {
    try {
      const dataToSend = { ...rutaData, idRuta: id };
      await axios.put(`${API_RUTAS_URL}/${id}`, dataToSend);
      return true;
    } catch (error) {
      console.error(
        "ERROR (Actualizar Ruta):",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data || "Error desconocido al actualizar ruta."
      );
    }
  };

  /* ================================
        DELETE - Eliminar Ruta
  ================================= */
  const deleteRuta = async (id) => {
    try {
      await axios.delete(`${API_RUTAS_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Ruta):",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data || "Error desconocido al eliminar ruta."
      );
    }
  };

  return (
    <RutasContext.Provider
      value={{
        rutas: state.rutas,
        lugaresDisponibles: state.lugaresDisponibles,
        getRutas,
        getLugares,
        createRuta,
        updateRuta,
        deleteRuta,
      }}
    >
      {children}
    </RutasContext.Provider>
  );
};

export default RutasState;
