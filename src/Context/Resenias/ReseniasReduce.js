import {
    GET_RESENAS,
    CREATE_RESENA,
    UPDATE_RESENA,
    DELETE_RESENA
} from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) return payload.$values;
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {

        case GET_RESENAS: {
            const data = extractData(payload);
            return {
                ...state,
                resenas: Array.isArray(data) ? data : []
            };
        }

        case CREATE_RESENA: {
            return {
                ...state,
                resenas: [extractData(payload), ...state.resenas]
            };
        }

        case UPDATE_RESENA: {
            const updatedResena = extractData(payload);
            return {
                ...state,
                resenas: state.resenas.map(resena =>
                    resena.idResena === updatedResena.idResena ? updatedResena : resena
                )
            };
        }

        case DELETE_RESENA: {
            return {
                ...state,
                resenas: state.resenas.filter(resena => resena.idResena !== payload)
            };
        }

        default:
            return state;
    }
};