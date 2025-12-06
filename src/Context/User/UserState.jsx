import React, { useReducer } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { GET_PROFILE, GET_USERS, CAMBIAR_ESTATUS } from "../types";
import UserReduce from "./UserReduce";

const API_URL_BASE =
  "https://kairos-api-deleon-cwffh5augvctfyb7.westus-01.azurewebsites.net/api/Usuarios";

const UserState = ({ children }) => {
  const initialState = {
    users: [],
    selectedUser: null,
  };

  const [state, dispatch] = useReducer(UserReduce, initialState);

  /**
   * Obtiene la lista completa de usuarios (GET /api/Usuarios)
   */
  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL_BASE);
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    } catch (error) {
      console.error(
        "Error al obtener usuarios:",
        error.response?.data || error.message
      );
    }
  };

  /**
   * Obtiene el perfil de un usuario por ID (GET /api/Usuarios/{id})
   */
  const getProfile = async (id) => {
    try {
      const res = await axios.get(`${API_URL_BASE}/${id}`);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    } catch (error) {
      console.error(
        `Error al obtener perfil de usuario ${id}:`,
        error.response?.data || error.message
      );
    }
  };

  /**
   * Crea un nuevo usuario (POST /api/Usuarios)
   */
  const createUser = async (userData) => {
    try {
      console.log("Datos enviados al crear usuario:", userData);
      const response = await axios.post(API_URL_BASE, userData);

      console.log("Respuesta del servidor:", response.data);
      getUsers();
      return response.data;
    } catch (error) {
      console.error("ERROR DETALLADO (Crear Usuario):", {
        status: error.response?.status,
        data: error.response?.data,
        errors: error.response?.data?.errors,
        url: error.config?.url,
      });
      throw error;
    }
  };

  /**
   * Actualiza un usuario (PUT /api/Usuarios/{id})
   */
  const updateUser = async (id, userData) => {
    try {
      const dataToSend = { ...userData, idUsuario: id };
      const res = await axios.put(`${API_URL_BASE}/${id}`, dataToSend);

      if (res.data) {
        dispatch({ type: GET_PROFILE, payload: res.data });
      } else {
        await getProfile(id);
      }

      await getUsers();
      return true;
    } catch (error) {
      console.error(
        "ERROR PUT (Actualizar Usuario):",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Cambia el estatus de un usuario (PATCH /api/Usuarios/{id}/estatus)
   */
  const toggleUserStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_URL_BASE}/${id}/estatus`);

      dispatch({
        type: CAMBIAR_ESTATUS,
        payload: res.data,
      });

      await getUsers();
      return res.data;
    } catch (error) {
      console.error(
        "ERROR PATCH (Cambiar Estatus):",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina un usuario físicamente (DELETE /api/Usuarios/{id})
   */
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL_BASE}/${id}`);
      dispatch({ type: GET_PROFILE, payload: null });
      await getUsers();
      return true;
    } catch (error) {
      console.error(
        "ERROR DELETE (Eliminar Usuario):",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        selectedUser: state.selectedUser,
        getUsers,
        getProfile,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
