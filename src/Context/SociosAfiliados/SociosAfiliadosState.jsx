import React, { useReducer } from "react";
import axios from "axios";
import SociosAfiliadosContext from "./SociosAfiliadosContext";
import {
  GET_SOCIOS,
  CREATE_SOCIO,
  UPDATE_SOCIO,
  DELETE_SOCIO,
  GET_SOCIO_BY_ID,
} from "../types";
import SociosAfiliadosReduce from "./SociosAfiliadosReduce";

// URL base de tu API para SociosAfiliados
const API_SOCIOS_URL = "http://localhost:5219/api/SociosAfiliados";

const SociosAfiliadosState = ({ children }) => {
  const initialState = {
    socios: [],
    selectedSocio: null,
  };

  const [state, dispatch] = useReducer(SociosAfiliadosReduce, initialState);

  /**
   * Obtiene la lista completa de socios afiliados (GET /api/SociosAfiliados)
   */
  const getSocios = async () => {
    try {
      console.log("🔍 Obteniendo socios desde:", API_SOCIOS_URL);
      const res = await axios.get(API_SOCIOS_URL);
      console.log("✅ Socios obtenidos:", res.data);

      dispatch({
        type: GET_SOCIOS,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener socios:",
        error.response?.data || error.message
      );
      dispatch({
        type: GET_SOCIOS,
        payload: [],
      });
      throw error;
    }
  };

  /**
   * Obtiene un socio por su ID (GET /api/SociosAfiliados/{id})
   * @param {number} id
   */
  const getSocioById = async (id) => {
    try {
      const res = await axios.get(`${API_SOCIOS_URL}/${id}`);
      dispatch({
        type: GET_SOCIO_BY_ID,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error(
        `Error al obtener socio ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Crea un nuevo socio afiliado (POST /api/SociosAfiliados)
   * @param {object} socioData
   */
  const createSocio = async (socioData) => {
    try {
      const response = await axios.post(API_SOCIOS_URL, socioData);
      dispatch({
        type: CREATE_SOCIO,
        payload: response.data,
      });
      // Opcional: Recargar la lista después de crear
      // await getSocios();
      return response.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Crear Socio):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza un socio existente (PUT /api/SociosAfiliados/{id})
   * @param {number} id
   * @param {object} socioData
   */
  const updateSocio = async (id, socioData) => {
    try {
      // Aseguramos que el ID vaya en el cuerpo también si el backend lo requiere
      const dataToSend = { ...socioData, idSocio: id };

      // Nota: Usualmente PUT no devuelve el objeto, pero si tu API lo hace, úsalo.
      // Si tu API devuelve NoContent (204), quizás debas usar dataToSend para el dispatch.
      const res = await axios.put(`${API_SOCIOS_URL}/${id}`, dataToSend);

      dispatch({
        type: UPDATE_SOCIO,
        // Si res.data está vacío (204 No Content), usamos los datos enviados para actualizar el estado local
        payload: res.data || dataToSend,
      });
      return res.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Actualizar Socio):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina un socio (DELETE /api/SociosAfiliados/{id})
   * @param {number} id
   */
  const deleteSocio = async (id) => {
    try {
      await axios.delete(`${API_SOCIOS_URL}/${id}`);
      dispatch({
        type: DELETE_SOCIO,
        payload: id,
      });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.errors || error.message;
      // Manejo específico si hay conflicto de claves foráneas (ej. tiene promociones asociadas)
      if (error.response && error.response.status === 409) {
        // Conflict
        console.error(
          "ERROR: No se puede eliminar el socio porque tiene promociones o registros asociados."
        );
        throw new Error(
          "No se puede eliminar el socio porque tiene registros asociados."
        );
      } else if (error.response && error.response.status === 500) {
        // A veces SQL Server lanza error 500 por FK constraints dependiendo de la config
        console.error(
          "ERROR DE SERVIDOR (Posible FK Constraint):",
          errorMessage
        );
        throw error;
      } else {
        console.error("ERROR DETALLADO (Eliminar Socio):", errorMessage);
        throw error;
      }
    }
  };

  return (
    <SociosAfiliadosContext.Provider
      value={{
        socios: state.socios,
        selectedSocio: state.selectedSocio,
        getSocios,
        getSocioById,
        createSocio,
        updateSocio,
        deleteSocio,
      }}
    >
      {children}
    </SociosAfiliadosContext.Provider>
  );
};

export default SociosAfiliadosState;
