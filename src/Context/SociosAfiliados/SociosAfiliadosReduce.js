import {
    GET_SOCIOS,
    CREATE_SOCIO,
    UPDATE_SOCIO,
    DELETE_SOCIO,
    GET_SOCIO_BY_ID
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
        case GET_SOCIOS: {
            const dataToUse = extractData(payload);
            const sociosArray = Array.isArray(dataToUse) ? dataToUse : [];

            return {
                ...state,
                socios: sociosArray
            };
        }

        case GET_SOCIO_BY_ID: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                selectedSocio: dataToUse
            };
        }

        case CREATE_SOCIO: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                socios: [...state.socios, dataToUse]
            };
        }

        case UPDATE_SOCIO: {
            const dataToUse = extractData(payload);
            return {
                ...state,
                socios: state.socios.map(socio =>
                    socio.idSocio === dataToUse.idSocio ? dataToUse : socio
                )
            };
        }

        case DELETE_SOCIO: {
            const idToDelete = payload;
            return {
                ...state,
                socios: state.socios.filter(socio => socio.idSocio !== idToDelete)
            };
        }

        default:
            return state;
    }
};