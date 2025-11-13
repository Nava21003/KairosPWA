import { GET_ROLES } from "../types";
const extractData = (payload) => {
    if (payload && payload.$values) {
        return payload.$values;
    }
    return payload;
};


export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_ROLES: {
            const dataToUse = extractData(payload);
            const rolesArray = Array.isArray(dataToUse) ? dataToUse : [];

            return {
                ...state,
                roles: rolesArray
            }
        }
        default:
            return state
    }
}