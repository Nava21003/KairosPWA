import { GET_ACTIVIDADES_BY_USER, CREATE_ACTIVIDAD } from "../types";

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
        default:
            return state;
    }
};