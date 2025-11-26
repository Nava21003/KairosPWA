import {
    GET_MENSAJES,
    CREATE_MENSAJE,
    UPDATE_MENSAJE,
    DELETE_MENSAJE
} from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) return payload.$values;
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {

        case GET_MENSAJES: {
            const data = extractData(payload);
            return {
                ...state,
                mensajes: Array.isArray(data) ? data : []
            };
        }

        case CREATE_MENSAJE: {
            return {
                ...state,
                mensajes: [...state.mensajes, extractData(payload)]
            };
        }

        case UPDATE_MENSAJE: {
            const updatedMsg = extractData(payload);
            return {
                ...state,
                mensajes: state.mensajes.map(msg =>
                    msg.idMensaje === updatedMsg.idMensaje
                        ? updatedMsg
                        : msg
                )
            };
        }

        case DELETE_MENSAJE: {
            return {
                ...state,
                mensajes: state.mensajes.filter(msg => msg.idMensaje !== payload)
            };
        }

        default:
            return state;
    }
};
