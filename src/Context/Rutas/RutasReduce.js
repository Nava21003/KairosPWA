import { GET_RUTAS, CREATE_RUTA, UPDATE_RUTA, DELETE_RUTA } from "../types";

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
        case GET_RUTAS: {
            return {
                ...state,
                rutas: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case CREATE_RUTA: {
            return {
                ...state,
                rutas: [...state.rutas, dataToUse]
            };
        }
        case UPDATE_RUTA: {
            return state;
        }
        case DELETE_RUTA: {
            const idToDelete = payload;
            return {
                ...state,
                rutas: state.rutas.filter(ruta => ruta.idRuta !== idToDelete)
            };
        }
        default:
            return state;
    }
};