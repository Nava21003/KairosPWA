import React, { useReducer } from "react";
import axios from "axios";
import RoleContext from "./RoleContext";
import { GET_ROLES } from "../types";
import RoleReduce from "./RoleReduce";

const API_ROLE_URL = "http://localhost:5219/api/Roles";

const RoleState = ({ children }) => {
  const initialState = {
    roles: [],
  };

  const [state, dispatch] = useReducer(RoleReduce, initialState);

  /**
   * Obtiene la lista completa de roles (GET /api/Roles)
   */
  const getRoles = async () => {
    try {
      const res = await axios.get(API_ROLE_URL);
      dispatch({
        type: GET_ROLES,
        payload: res.data,
      });
    } catch (error) {
      console.error(
        "Error al obtener roles:",
        error.response?.data || error.message
      );
    }
  };

  /**
   * Crea un nuevo rol (POST /api/Roles)
   * @param {object} roleData
   */
  const createRole = async (roleData) => {
    try {
      const response = await axios.post(API_ROLE_URL, roleData);
      await getRoles();
      return response.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Crear Rol):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Actualiza un rol existente (PUT /api/Roles/{id})
   * @param {number} id
   * @param {object} roleData
   */
  const updateRole = async (id, roleData) => {
    try {
      const dataToSend = { ...roleData, idRol: id };

      const res = await axios.put(`${API_ROLE_URL}/${id}`, dataToSend);
      await getRoles();
      return res.data;
    } catch (error) {
      console.error(
        "ERROR DETALLADO (Actualizar Rol):",
        error.response?.data?.errors || error.message
      );
      throw error;
    }
  };

  /**
   * Elimina un rol (DELETE /api/Roles/{id})
   * @param {number} id
   */
  const deleteRole = async (id) => {
    try {
      await axios.delete(`${API_ROLE_URL}/${id}`);
      await getRoles();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.errors || error.message;
      if (error.response && error.response.status === 409) {
        console.error(
          "ERROR DETALLADO (Eliminar Rol): No se puede eliminar rol ya que pertenece a un usuario."
        );
        throw new Error(
          "No se puede eliminar rol ya que pertenece a un usuario."
        );
      } else {
        console.error("ERROR DETALLADO (Eliminar Rol):", errorMessage);
        throw error;
      }
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles: state.roles,
        getRoles,
        createRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleState;
