import { GET_LUGARES } from "../types";

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
        case GET_LUGARES: {
            return {
                ...state,
                lugares: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        default:
            return state;
    }
};