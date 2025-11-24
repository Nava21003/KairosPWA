import {
    GET_INTERESES,
    CREATE_INTERES,
    UPDATE_INTERES,
    DELETE_INTERES
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
        case GET_INTERESES:
            return {
                ...state,
                intereses: Array.isArray(dataToUse) ? dataToUse : []
            };

        case CREATE_INTERES:
            return {
                ...state,
                intereses: [...state.intereses, dataToUse]
            };

        case UPDATE_INTERES:
            return state;

        case DELETE_INTERES:
            return {
                ...state,
                intereses: state.intereses.filter(interes => interes.idInteres !== payload)
            };

        default:
            return state;
    }
};