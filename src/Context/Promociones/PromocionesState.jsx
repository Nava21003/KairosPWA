import React, { useReducer } from "react";
import axios from "axios";
import PromocionesContext from "./PromocionesContext";
import {
  GET_PROMOCIONES,
  CREATE_PROMOCION,
  UPDATE_PROMOCION,
  DELETE_PROMOCION,
  GET_PROMOCIONES_BY_LUGAR,
  GET_PROMOCIONES_BY_SOCIO,
} from "../types";
import PromocionesReduce from "./PromocionesReduce";

const API_PROMOCIONES_URL = "http://localhost:5219/api/Promociones";

const PromocionesState = ({ children }) => {
  const initialState = {
    promociones: [],
    promocionesByLugar: [],
    promocionesBySocio: [],
  };

  const [state, dispatch] = useReducer(PromocionesReduce, initialState);

  /**
   * Obtiene la lista completa de promociones (GET /api/Promociones)
   */
  const getPromociones = async () => {
    try {
      console.log("🔍 Obteniendo promociones desde:", API_PROMOCIONES_URL);
      const res = await axios.get(API_PROMOCIONES_URL);
      console.log("✅ Promociones obtenidas:", res.data);

      dispatch({
        type: GET_PROMOCIONES,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener promociones:",
        error.response?.data || error.message
      );
      dispatch({
        type: GET_PROMOCIONES,
        payload: [],
      });
      throw error;
    }
  };

  /**
   * Crea una nueva promoción (POST /api/Promociones)
   * @param {object} promocionData
   */
  const createPromocion = async (promocionData) => {
    try {
      const response = await axios.post(API_PROMOCIONES_URL, promocionData);
      dispatch({
        type: CREATE_PROMOCION,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Crear Promoción):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza una promoción existente (PUT /api/Promociones/{id})
   * @param {number} id
   * @param {object} promocionData
   */
  const updatePromocion = async (id, promocionData) => {
    try {
      const dataToSend = { ...promocionData, idPromocion: id };
      const res = await axios.put(`${API_PROMOCIONES_URL}/${id}`, dataToSend);
      dispatch({
        type: UPDATE_PROMOCION,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Actualizar Promoción):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina una promoción (DELETE /api/Promociones/{id})
   * @param {number} id
   */
  const deletePromocion = async (id) => {
    try {
      await axios.delete(`${API_PROMOCIONES_URL}/${id}`);
      dispatch({
        type: DELETE_PROMOCION,
        payload: id,
      });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.errors || error.message;
      if (error.response && error.response.status === 409) {
        console.error(
          "ERROR DETALLADO (Eliminar Promoción): No se puede eliminar la promoción porque tiene registros asociados."
        );
        throw new Error(
          "No se puede eliminar la promoción porque tiene registros asociados."
        );
      } else {
        console.error("ERROR DETALLADO (Eliminar Promoción):", errorMessage);
        throw error;
      }
    }
  };

  /**
   * Obtiene promociones por lugar (GET /api/Promociones/lugar/{idLugar})
   * @param {number} idLugar
   */
  const getPromocionesByLugar = async (idLugar) => {
    try {
      const res = await axios.get(`${API_PROMOCIONES_URL}/lugar/${idLugar}`);
      dispatch({
        type: GET_PROMOCIONES_BY_LUGAR,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener promociones por lugar:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Obtiene promociones por socio (GET /api/Promociones/socio/{idSocio})
   * @param {number} idSocio
   */
  const getPromocionesBySocio = async (idSocio) => {
    try {
      const res = await axios.get(`${API_PROMOCIONES_URL}/socio/${idSocio}`);
      dispatch({
        type: GET_PROMOCIONES_BY_SOCIO,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener promociones por socio:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Registra un clic en una promoción (POST /api/Promociones/{id}/clic)
   * @param {number} idPromocion
   * @param {number} idUsuario
   */
  const registrarClic = async (idPromocion, idUsuario) => {
    try {
      const response = await axios.post(
        `${API_PROMOCIONES_URL}/${idPromocion}/clic`,
        {
          idUsuario: idUsuario,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error al registrar clic:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return (
    <PromocionesContext.Provider
      value={{
        promociones: state.promociones,
        promocionesByLugar: state.promocionesByLugar,
        promocionesBySocio: state.promocionesBySocio,
        getPromociones,
        createPromocion,
        updatePromocion,
        deletePromocion,
        getPromocionesByLugar,
        getPromocionesBySocio,
        registrarClic,
      }}
    >
      {children}
    </PromocionesContext.Provider>
  );
};

export default PromocionesState;
