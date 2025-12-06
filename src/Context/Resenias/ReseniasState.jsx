import React, { useReducer } from "react";
import axios from "axios";
import ReseniasContext from "./ReseniasContext";
import ReseniasReducer from "./ReseniasReduce";
import {
  GET_RESENAS,
  CREATE_RESENA,
  UPDATE_RESENA,
  DELETE_RESENA,
} from "../types";

const API_RESENAS_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Resenas";

const ReseniasState = ({ children }) => {
  const initialState = {
    resenas: [],
  };

  const [state, dispatch] = useReducer(ReseniasReducer, initialState);

  // Obtener Reseñas (GET)
  const getResenas = async () => {
    try {
      const res = await axios.get(API_RESENAS_URL);
      dispatch({
        type: GET_RESENAS,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener Reseñas:", error);
      dispatch({ type: GET_RESENAS, payload: [] });
    }
  };

  // Crear Reseña (POST)
  const createResena = async (data) => {
    try {
      const res = await axios.post(API_RESENAS_URL, data);
      dispatch({
        type: CREATE_RESENA,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear Reseña:", error);
      throw error;
    }
  };

  // Editar Reseña (PUT)
  const updateResena = async (id, data) => {
    try {
      const dataToSend = { ...data, idResena: id };

      const res = await axios.put(`${API_RESENAS_URL}/${id}`, dataToSend);

      const payload = res.data ? res.data : dataToSend;

      dispatch({
        type: UPDATE_RESENA,
        payload: payload,
      });
    } catch (error) {
      console.error("Error al actualizar Reseña:", error);
      throw error;
    }
  };

  // Eliminar Reseña (DELETE)
  const deleteResena = async (id) => {
    try {
      await axios.delete(`${API_RESENAS_URL}/${id}`);
      dispatch({
        type: DELETE_RESENA,
        payload: id,
      });
    } catch (error) {
      console.error("Error al eliminar Reseña:", error);
    }
  };

  return (
    <ReseniasContext.Provider
      value={{
        resenas: state.resenas,
        getResenas,
        createResena,
        updateResena,
        deleteResena,
      }}
    >
      {children}
    </ReseniasContext.Provider>
  );
};

export default ReseniasState;
