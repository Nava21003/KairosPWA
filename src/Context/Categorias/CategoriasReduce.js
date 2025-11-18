import { GET_CATEGORIAS, CREATE_CATEGORIA, UPDATE_CATEGORIA, DELETE_CATEGORIA } from "../types";

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
        case GET_CATEGORIAS: {
            return {
                ...state,
                categorias: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case CREATE_CATEGORIA: {
            return {
                ...state,
                categorias: [...state.categorias, dataToUse]
            };
        }
        case UPDATE_CATEGORIA: {
            return state;
        }
        case DELETE_CATEGORIA: {
            const idToDelete = payload;
            return {
                ...state,
                categorias: state.categorias.filter(cat => cat.idCategoria !== idToDelete)
            };
        }
        default:
            return state;
    }
};