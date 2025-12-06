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

const API_PROMOCIONES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/promociones";

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
      const res = await axios.get(API_PROMOCIONES_URL);
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
      dispatch({ type: GET_PROMOCIONES, payload: [] });
    }
  };

  /**
   * Crea una nueva promoción (POST /api/Promociones)
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
        "Error creando promoción:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza una promoción existente (PUT /api/Promociones/{id})
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
        "Error actualizando promoción:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina una promoción (DELETE /api/Promociones/{id})
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
      if (error.response && error.response.status === 409) {
        throw new Error(
          "No se puede eliminar la promoción porque tiene registros de clics o asociados."
        );
      } else {
        throw error;
      }
    }
  };

  /**
   * Obtiene promociones por lugar
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
      console.error(error);
    }
  };

  /**
   * Obtiene promociones por socio
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
      console.error(error);
    }
  };

  const registrarClic = async (idPromocion, idUsuario) => {
    try {
      const payload = {
        idPromocion: parseInt(idPromocion),
        idUsuario: idUsuario ? parseInt(idUsuario) : null,
      };

      const response = await axios.post(
        `${API_PROMOCIONES_URL}/registrar-clic`,
        payload
      );

      console.log("💰 Ganancia registrada en BD:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error al registrar clic:",
        error.response?.data || error.message
      );
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
