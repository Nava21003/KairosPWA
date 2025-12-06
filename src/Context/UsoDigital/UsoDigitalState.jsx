import React, { useReducer } from "react";
import axios from "axios";
import UsoDigitalContext from "./UsoDigitalContext";
import UsoDigitalReduce from "./UsoDigitalReduce";
import { GET_USO_DIGITAL_BY_USER, CREATE_USO_DIGITAL } from "../types";

const API_USO_DIGITAL_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/UsoDigital";

const UsoDigitalState = ({ children }) => {
  const initialState = {
    usoDigital: [],
  };

  const [state, dispatch] = useReducer(UsoDigitalReduce, initialState);

  /**
   * Obtiene registros de uso digital por ID de usuario (GET /api/UsoDigital/{idUsuario})
   */
  const getUsoDigitalByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_USO_DIGITAL_URL}/${idUsuario}`);
      dispatch({ type: GET_USO_DIGITAL_BY_USER, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener uso digital:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Registra un nuevo uso digital (POST /api/UsoDigital)
   */
  const createUsoDigital = async (usoDigitalData) => {
    try {
      const response = await axios.post(API_USO_DIGITAL_URL, usoDigitalData);
      dispatch({ type: CREATE_USO_DIGITAL, payload: response.data });
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Uso Digital):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  return (
    <UsoDigitalContext.Provider
      value={{
        usoDigital: state.usoDigital,
        getUsoDigitalByUsuario,
        createUsoDigital,
      }}
    >
      {children}
    </UsoDigitalContext.Provider>
  );
};

export default UsoDigitalState;
