import React, { useReducer } from "react";
import axios from "axios";
import {
  GET_POIS,
  GET_LUGARES_FOR_SELECT,
  CREATE_POI,
  UPDATE_POI,
  DELETE_POI,
} from "../types";
import PuntosInteresReduce from "./PuntosInteresReduce";
import PuntosInteresContext from "./PuntosInteresContext";

const API_POIS_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/PuntosInteres";
const API_LUGARES_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Lugares";

const PuntosInteresState = ({ children }) => {
  const initialState = {
    pois: [],
    lugares: [],
  };

  const [state, dispatch] = useReducer(PuntosInteresReduce, initialState);

  // Obtener todos los puntos de interés
  const getPOIs = async () => {
    try {
      const res = await axios.get(API_POIS_URL);
      dispatch({ type: GET_POIS, payload: res.data });
    } catch (error) {
      console.error("Error getting POIs:", error);
      throw error;
    }
  };

  // Obtener lugares para el select
  const getLugaresForSelect = async () => {
    try {
      const res = await axios.get(API_LUGARES_URL);
      dispatch({ type: GET_LUGARES_FOR_SELECT, payload: res.data });
    } catch (error) {
      console.error("Error getting Lugares:", error);
    }
  };

  // Crear nuevo punto
  const createPOI = async (data) => {
    try {
      const res = await axios.post(API_POIS_URL, data);
      dispatch({ type: CREATE_POI, payload: res.data });
      return res.data;
    } catch (error) {
      console.error("Error create POI:", error);
      throw error;
    }
  };

  // Actualizar punto existente
  const updatePOI = async (id, data) => {
    try {
      const dataToSend = { ...data, idPunto: id };
      await axios.put(`${API_POIS_URL}/${id}`, dataToSend);
      dispatch({ type: UPDATE_POI, payload: dataToSend });
    } catch (error) {
      console.error("Error update POI:", error);
      throw error;
    }
  };

  // Eliminar punto
  const deletePOI = async (id) => {
    try {
      await axios.delete(`${API_POIS_URL}/${id}`);
      dispatch({ type: DELETE_POI, payload: id });
    } catch (error) {
      console.error("Error delete POI:", error);
      throw error;
    }
  };

  return (
    <PuntosInteresContext.Provider
      value={{
        pois: state.pois,
        lugaresDisponibles: state.lugares,
        getPOIs,
        getLugaresForSelect,
        createPOI,
        updatePOI,
        deletePOI,
      }}
    >
      {children}
    </PuntosInteresContext.Provider>
  );
};

export default PuntosInteresState;
