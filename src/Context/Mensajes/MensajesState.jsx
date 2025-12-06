import React, { useReducer } from "react";
import axios from "axios";
import MensajesContext from "./MensajesContext";
import MensajesReduce from "./MensajesReduce";

import {
  GET_MENSAJES,
  CREATE_MENSAJE,
  UPDATE_MENSAJE,
  DELETE_MENSAJE,
} from "../types";

const API_MENSAJES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/MensajesContacto";

const MensajesState = ({ children }) => {
  const initialState = {
    mensajes: [],
  };

  const [state, dispatch] = useReducer(MensajesReduce, initialState);

  // Obtener todos los mensajes (Admin)
  const getMensajes = async () => {
    try {
      const res = await axios.get(API_MENSAJES_URL);
      dispatch({
        type: GET_MENSAJES,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      dispatch({ type: GET_MENSAJES, payload: [] });
    }
  };

  // Crear mensaje (Formulario Público)
  const createMensaje = async (data) => {
    try {
      const res = await axios.post(API_MENSAJES_URL, data);
      dispatch({
        type: CREATE_MENSAJE,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      throw error;
    }
  };

  // Actualizar estatus (Admin - marcar como respondido)
  const updateMensaje = async (id, data) => {
    try {
      const dataToSend = { ...data, idMensaje: id };
      const res = await axios.put(`${API_MENSAJES_URL}/${id}`, dataToSend);
      dispatch({
        type: UPDATE_MENSAJE,
        payload: res.data || dataToSend,
      });
      if (res.status === 204) {
        dispatch({ type: UPDATE_MENSAJE, payload: dataToSend });
      }
    } catch (error) {
      console.error("Error al actualizar mensaje:", error);
      throw error;
    }
  };

  // Eliminar mensaje
  const deleteMensaje = async (id) => {
    try {
      await axios.delete(`${API_MENSAJES_URL}/${id}`);
      dispatch({
        type: DELETE_MENSAJE,
        payload: id,
      });
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
    }
  };

  return (
    <MensajesContext.Provider
      value={{
        mensajes: state.mensajes,
        getMensajes,
        createMensaje,
        updateMensaje,
        deleteMensaje,
      }}
    >
      {children}
    </MensajesContext.Provider>
  );
};

export default MensajesState;
