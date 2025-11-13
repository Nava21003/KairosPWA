import {
    GET_PROMOCIONES,
    CREATE_PROMOCION,
    UPDATE_PROMOCION,
    DELETE_PROMOCION,
    GET_PROMOCIONES_BY_LUGAR,
    GET_PROMOCIONES_BY_SOCIO
} from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) {
        return payload.$values;
    }
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_PROMOCIONES: {
            const dataToUse = extractData(payload);
            const promocionesArray = Array.isArray(dataToUse) ? dataToUse : [];

            return {
                ...state,
                promociones: promocionesArray
            };
        }

        case CREATE_PROMOCION: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                promociones: [...state.promociones, dataToUse]
            };
        }

        case UPDATE_PROMOCION: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                promociones: state.promociones.map(promo =>
                    promo.idPromocion === dataToUse.idPromocion ? dataToUse : promo
                )
            };
        }

        case DELETE_PROMOCION: {
            const idToDelete = payload;
            return {
                ...state,
                promociones: state.promociones.filter(promo => promo.idPromocion !== idToDelete)
            };
        }

        case GET_PROMOCIONES_BY_LUGAR: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                promocionesByLugar: Array.isArray(dataToUse) ? dataToUse : []
            };
        }

        case GET_PROMOCIONES_BY_SOCIO: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                promocionesBySocio: Array.isArray(dataToUse) ? dataToUse : []
            };
        }

        default:
            return state;
    }
};