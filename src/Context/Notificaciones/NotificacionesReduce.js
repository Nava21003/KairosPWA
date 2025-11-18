import { GET_NOTIFICACIONES_BY_USER, CREATE_NOTIFICACION, DELETE_NOTIFICACION } from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) {
        return payload.$values;
    }
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;
    const dataToUse = extractData(payload);

    switch (type) {
        case GET_NOTIFICACIONES_BY_USER: {
            return {
                ...state,
                notificaciones: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case CREATE_NOTIFICACION: {
            return {
                ...state,
                notificaciones: [dataToUse, ...state.notificaciones]
            };
        }
        case DELETE_NOTIFICACION: {
            const idToDelete = payload;
            return {
                ...state,
                notificaciones: state.notificaciones.filter(notif => notif.idNotificacion !== idToDelete)
            };
        }
        default:
            return state;
    }
};