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

const API_CATEGORIAS_URL =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Categorias";

const CategoriasState = ({ children }) => {
  const initialState = {
    categorias: [],
  };

  const [state, dispatch] = useReducer(CategoriasReduce, initialState);

  // Obtener categorías
  const getCategorias = async () => {
    try {
      const res = await axios.get(API_CATEGORIAS_URL);
      dispatch({ type: GET_CATEGORIAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Crear categoría
  const createCategoria = async (categoriaData) => {
    try {
      const dataToSend = {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || "",
        estatus: categoriaData.estatus === true,
      };

      const res = await axios.post(API_CATEGORIAS_URL, dataToSend);
      dispatch({ type: CREATE_CATEGORIA, payload: res.data });
      await getCategorias();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  };

  // Actualizar categoría
  const updateCategoria = async (id, categoriaData) => {
    try {
      const dataToSend = {
        idCategoria: id,
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || "",
        estatus: categoriaData.estatus === true,
      };

      await axios.put(`${API_CATEGORIAS_URL}/${id}`, dataToSend);
      await getCategorias();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      throw error;
    }
  };

  // Eliminar categoría
  const deleteCategoria = async (id) => {
    try {
      await axios.delete(`${API_CATEGORIAS_URL}/${id}`);
      dispatch({ type: DELETE_CATEGORIA, payload: id });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
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
