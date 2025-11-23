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

  // Obtener categorías
  const getCategorias = async () => {
    try {
      const res = await axios.get(API_CATEGORIAS_URL);
      // El reducer ya tiene la lógica para extraer $values si viene de .NET
      dispatch({ type: GET_CATEGORIAS, payload: res.data });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Crear categoría
  const createCategoria = async (categoriaData) => {
    try {
      // Aseguramos que estatus sea booleano y descripcion string
      const dataToSend = {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || "",
        estatus: categoriaData.estatus === true, // fuerza booleano
      };

      const res = await axios.post(API_CATEGORIAS_URL, dataToSend);

      // Actualizamos el estado local
      dispatch({ type: CREATE_CATEGORIA, payload: res.data });

      // Opcional: recargar todo para asegurar sincronización
      await getCategorias();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error; // Lanzar error para que el componente UI lo muestre
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

      // En React state, a veces es más fácil recargar la lista completa
      // para asegurar que el backend procesó todo bien.
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
