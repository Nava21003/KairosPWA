import React, { useReducer } from "react";
import axios from "axios";
import FaqContext from "./FaqContext";
import FaqReducer from "./FaqReducer";
import { GET_FAQS, CREATE_FAQ, UPDATE_FAQ, DELETE_FAQ } from "../types";

const API_FAQ_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/PreguntasFrecuentes";

const FaqState = ({ children }) => {
  const initialState = {
    faqs: [],
  };

  const [state, dispatch] = useReducer(FaqReducer, initialState);

  // Obtener FAQ
  const getFaqs = async () => {
    try {
      const res = await axios.get(API_FAQ_URL);
      dispatch({
        type: GET_FAQS,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener FAQ:", error);
      dispatch({ type: GET_FAQS, payload: [] });
    }
  };

  // Crear FAQ
  const createFaq = async (data) => {
    try {
      const res = await axios.post(API_FAQ_URL, data);
      dispatch({
        type: CREATE_FAQ,
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear FAQ:", error);
      throw error;
    }
  };

  // Editar FAQ
  const updateFaq = async (id, data) => {
    try {
      const dataToSend = { ...data, idPregunta: id };
      const res = await axios.put(`${API_FAQ_URL}/${id}`, dataToSend);

      // Manejo por si la API retorna NoContent (204)
      const payload = res.data ? res.data : dataToSend;

      dispatch({
        type: UPDATE_FAQ,
        payload: payload,
      });
    } catch (error) {
      console.error("Error al actualizar FAQ:", error);
      throw error;
    }
  };

  // Eliminar FAQ
  const deleteFaq = async (id) => {
    try {
      await axios.delete(`${API_FAQ_URL}/${id}`);
      dispatch({
        type: DELETE_FAQ,
        payload: id,
      });
    } catch (error) {
      console.error("Error al eliminar FAQ:", error);
    }
  };

  return (
    <FaqContext.Provider
      value={{
        faqs: state.faqs,
        getFaqs,
        createFaq,
        updateFaq,
        deleteFaq,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};

export default FaqState;
