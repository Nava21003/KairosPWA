import React, { useReducer } from "react";
import axios from "axios";
import RutasContext from "./RutasContext";
import RutasReduce from "./RutasReduce";
import { GET_RUTAS, CREATE_RUTA, UPDATE_RUTA, DELETE_RUTA } from "../types";

const API_RUTAS_URL = "http://localhost:5219/api/Rutas";

const RutasState = ({ children }) => {
  const initialState = {
    rutas: [],
  };

  const [state, dispatch] = useReducer(RutasReduce, initialState);

  // ----------------------------------
  // Métodos para RutasController
  // ----------------------------------

  /**
   * Obtiene todas las rutas (GET /api/Rutas)
   */
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

  /**
   * Crea una nueva ruta (POST /api/Rutas)
   */
  const createRuta = async (rutaData) => {
    try {
      const response = await axios.post(API_RUTAS_URL, rutaData);
      await getRutas();
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Ruta):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza una ruta (PUT /api/Rutas/{id})
   */
  const updateRuta = async (id, rutaData) => {
    try {
      const dataToSend = { ...rutaData, idRuta: id };
      await axios.put(`${API_RUTAS_URL}/${id}`, dataToSend);
      await getRutas();
      return true;
    } catch (error) {
      console.error(
        "ERROR (Actualizar Ruta):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina una ruta (DELETE /api/Rutas/{id})
   */
  const deleteRuta = async (id) => {
    try {
      await axios.delete(`${API_RUTAS_URL}/${id}`);
      await getRutas();
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Ruta):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  return (
    <RutasContext.Provider
      value={{
        rutas: state.rutas,
        getRutas,
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
