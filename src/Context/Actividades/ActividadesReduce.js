import {
    GET_ACTIVIDADES_BY_USER,
    CREATE_ACTIVIDAD,
    GET_HISTORIAL_VISITAS
} from "../types";

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
        case GET_ACTIVIDADES_BY_USER: {
            return {
                ...state,
                actividades: Array.isArray(dataToUse) ? dataToUse : []
            };
        }

        case CREATE_ACTIVIDAD: {
            return {
                ...state,
                actividades: [dataToUse, ...state.actividades]
            };
        }

        case GET_HISTORIAL_VISITAS: {
            return {
                ...state,
                historialVisitas: Array.isArray(dataToUse) ? dataToUse : []
            };
        }

        default:
            return state;
    }
};