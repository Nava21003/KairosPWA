import React, { useReducer } from "react";
import axios from "axios";
import LugaresContext from "./LugaresContext";
import LugaresReduce from "./LugaresReduce";
import { GET_LUGARES } from "../types";

const API_LUGARES_URL = "http://localhost:5219/api/Lugares";

const LugaresState = ({ children }) => {
  const initialState = {
    lugares: [],
    selectedLugar: null,
  };

  const [state, dispatch] = useReducer(LugaresReduce, initialState);

  // ----------------------------------
  // Métodos para LugaresController
  // ----------------------------------

  /**
   * Obtiene todos los lugares activos (GET /api/Lugares)
   */
  const getLugares = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener lugares:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Obtiene un lugar por ID (GET /api/Lugares/{id})
   */
  const getLugarById = async (id) => {
    try {
      const res = await axios.get(`${API_LUGARES_URL}/${id}`);
      // No hay dispatch explícito, se usa para obtener datos
      return res.data;
    } catch (error) {
      console.error(
        `Error al obtener lugar ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Crea un nuevo lugar (POST /api/Lugares)
   */
  const createLugar = async (lugarData) => {
    try {
      const response = await axios.post(API_LUGARES_URL, lugarData);
      await getLugares(); // Recargar la lista
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Lugar):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza un lugar existente (PUT /api/Lugares/{id})
   */
  const updateLugar = async (id, lugarData) => {
    try {
      const dataToSend = { ...lugarData, idLugar: id };
      await axios.put(`${API_LUGARES_URL}/${id}`, dataToSend);
      await getLugares();
      return true;
    } catch (error) {
      console.error(
        "ERROR (Actualizar Lugar):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina lógicamente un lugar (DELETE /api/Lugares/{id}) - Cambia estatus a false
   */
  const deleteLugar = async (id) => {
    try {
      await axios.delete(`${API_LUGARES_URL}/${id}`);
      await getLugares();
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Lugar):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  return (
    <LugaresContext.Provider
      value={{
        lugares: state.lugares,
        getLugares,
        getLugarById,
        createLugar,
        updateLugar,
        deleteLugar,
      }}
    >
      {children}
    </LugaresContext.Provider>
  );
};

export default LugaresState;
