import React, { useReducer } from "react";
import axios from "axios";
import CategoriasContext from "./CategoriasContext";
import CategoriasReduce from "./CategoriasReduce";
import {
  GET_CATEGORIAS,
  CREATE_CATEGORIA,
  UPDATE_CATEGORIA,
  DELETE_CATEGORIA,
} from "../types";

const API_CATEGORIAS_URL = "http://localhost:5219/api/Categorias";

const CategoriasState = ({ children }) => {
  const initialState = {
    categorias: [],
  };

  const [state, dispatch] = useReducer(CategoriasReduce, initialState);

  // ----------------------------------
  // Métodos para CategoriasController
  // ----------------------------------

  /**
   * Obtiene todas las categorías (GET /api/Categorias)
   */
  const getCategorias = async () => {
    try {
      const res = await axios.get(API_CATEGORIAS_URL);
      dispatch({ type: GET_CATEGORIAS, payload: res.data });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener categorías:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Crea una nueva categoría (POST /api/Categorias)
   */
  const createCategoria = async (categoriaData) => {
    try {
      const response = await axios.post(API_CATEGORIAS_URL, categoriaData);
      await getCategorias(); // Recargar la lista para consistencia
      return response.data;
    } catch (error) {
      console.error(
        "ERROR (Crear Categoría):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza una categoría (PUT /api/Categorias/{id})
   */
  const updateCategoria = async (id, categoriaData) => {
    try {
      const dataToSend = { ...categoriaData, idCategoria: id };
      await axios.put(`${API_CATEGORIAS_URL}/${id}`, dataToSend); // Devuelve 204 NoContent
      await getCategorias(); // Recargar la lista para consistencia
      return true;
    } catch (error) {
      console.error(
        "ERROR (Actualizar Categoría):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina una categoría (DELETE /api/Categorias/{id})
   */
  const deleteCategoria = async (id) => {
    try {
      await axios.delete(`${API_CATEGORIAS_URL}/${id}`); // Devuelve 204 NoContent
      await getCategorias(); // Recargar la lista para consistencia
      // Opcional: si quieres actualizar el estado sin recargar la lista:
      // dispatch({ type: DELETE_CATEGORIA, payload: id });
      return true;
    } catch (error) {
      console.error(
        "ERROR (Eliminar Categoría):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  return (
    <CategoriasContext.Provider
      value={{
        categorias: state.categorias,
        getCategorias,
        createCategoria,
        updateCategoria,
        deleteCategoria,
      }}
    >
      {children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasState;
