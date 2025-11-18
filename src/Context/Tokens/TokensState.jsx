import React, { useReducer } from "react";
import axios from "axios";
import TokensContext from "./TokensContext";
import TokensReduce from "./TokensReduce";
import {
  GET_TOKENS,
  GET_TOKENS_BY_USER,
  CREATE_TOKEN,
  DELETE_TOKEN,
} from "../types";

const API_TOKENS_URL = "http://localhost:5219/api/Tokens";

const TokensState = ({ children }) => {
  const initialState = {
    tokens: [], // Todos los tokens
    userTokens: [], // Tokens de un usuario específico
  };

  const [state, dispatch] = useReducer(TokensReduce, initialState);

  // ----------------------------------
  // Métodos para TokensController
  // ----------------------------------

  /**
   * Obtiene todos los tokens (GET /api/Tokens)
   */
  const getTokens = async () => {
    try {
      const res = await axios.get(API_TOKENS_URL);
      dispatch({ type: GET_TOKENS, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener tokens:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Obtiene tokens por ID de usuario (GET /api/Tokens/usuario/{idUsuario})
   */
  const getTokensByUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${API_TOKENS_URL}/usuario/${idUsuario}`);
      dispatch({ type: GET_TOKENS_BY_USER, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener tokens por usuario:",
        error.response?.data || error.message
      );
      // Si devuelve 404, devuelve un array vacío
      if (error.response?.status === 404) {
        dispatch({ type: GET_TOKENS_BY_USER, payload: [] });
        return [];
      }
      throw error;
    }
  };

  /**
   * Crea un nuevo token (POST /api/Tokens)
   */
  const createToken = async (tokenData) => {
    try {
      const response = await axios.post(API_TOKENS_URL, tokenData);
      dispatch({ type: CREATE_TOKEN, payload: response.data });
      // Recargar la lista global si fuera necesario, o solo la del usuario: await getTokensByUsuario(tokenData.idUsuario);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Token):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina un token (DELETE /api/Tokens/{id})
   */
  const deleteToken = async (id) => {
    try {
      await axios.delete(`${API_TOKENS_URL}/${id}`);
      dispatch({ type: DELETE_TOKEN, payload: id });
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Token):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  // El PUT no se incluye en el Reduce/State ya que es un caso de uso menos común para tokens

  return (
    <TokensContext.Provider
      value={{
        tokens: state.tokens,
        userTokens: state.userTokens,
        getTokens,
        getTokensByUsuario,
        createToken,
        deleteToken,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export default TokensState;
