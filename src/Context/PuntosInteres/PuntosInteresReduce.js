import {
    GET_POIS,
    GET_LUGARES_FOR_SELECT,
    CREATE_POI,
    UPDATE_POI,
    DELETE_POI,
} from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) return payload.$values;
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_POIS:
            return {
                ...state,
                pois: Array.isArray(extractData(payload)) ? extractData(payload) : [],
            };
        case GET_LUGARES_FOR_SELECT:
            return {
                ...state,
                lugares: Array.isArray(extractData(payload)) ? extractData(payload) : [],
            };
        case CREATE_POI:
            return state;
        case UPDATE_POI:
            return state;
        case DELETE_POI:
            return {
                ...state,
                pois: state.pois.filter((p) => p.idPunto !== payload),
            };
        default:
            return state;
    }
};