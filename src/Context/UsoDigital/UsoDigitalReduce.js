import { GET_USO_DIGITAL_BY_USER, CREATE_USO_DIGITAL } from "../types";

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
        case GET_USO_DIGITAL_BY_USER: {
            return {
                ...state,
                usoDigital: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case CREATE_USO_DIGITAL: {
            return {
                ...state,
                usoDigital: [dataToUse, ...state.usoDigital]
            };
        }
        default:
            return state;
    }
};