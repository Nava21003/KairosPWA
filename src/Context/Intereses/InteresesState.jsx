import React, { useReducer } from "react";
import axios from "axios";
import InteresesContext from "./InteresesContext";
import InteresesReducer from "./InteresesReducer";
import {
  GET_INTERESES,
  CREATE_INTERES,
  UPDATE_INTERES,
  DELETE_INTERES,
} from "../types";

const API_INTERESES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Intereses";

const InteresesState = ({ children }) => {
  const initialState = {
    intereses: [],
  };

  const [state, dispatch] = useReducer(InteresesReducer, initialState);

  // Obtener Intereses
  const getIntereses = async () => {
    try {
      const res = await axios.get(API_INTERESES_URL);
      dispatch({ type: GET_INTERESES, payload: res.data });
    } catch (error) {
      console.error("Error al obtener intereses:", error);
    }
  };

  // Crear Interés
  const createInteres = async (interesData) => {
    try {
      const dataToSend = {
        nombre: interesData.nombre,
        descripcion: interesData.descripcion || "",
      };

      const res = await axios.post(API_INTERESES_URL, dataToSend);

      dispatch({ type: CREATE_INTERES, payload: res.data });
    } catch (error) {
      console.error("Error al crear interés:", error);
      throw error;
    }
  };

  // Actualizar Interés
  const updateInteres = async (id, interesData) => {
    try {
      const dataToSend = {
        idInteres: id,
        nombre: interesData.nombre,
        descripcion: interesData.descripcion || "",
      };

      await axios.put(`${API_INTERESES_URL}/${id}`, dataToSend);
      await getIntereses();
    } catch (error) {
      console.error("Error al actualizar interés:", error);
      throw error;
    }
  };

  // Eliminar Interés
  const deleteInteres = async (id) => {
    try {
      await axios.delete(`${API_INTERESES_URL}/${id}`);
      dispatch({ type: DELETE_INTERES, payload: id });
    } catch (error) {
      console.error("Error al eliminar interés:", error);
      throw error;
    }
  };

  return (
    <InteresesContext.Provider
      value={{
        intereses: state.intereses,
        getIntereses,
        createInteres,
        updateInteres,
        deleteInteres,
      }}
    >
      {children}
    </InteresesContext.Provider>
  );
};

export default InteresesState;
