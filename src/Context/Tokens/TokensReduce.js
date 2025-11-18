import { GET_TOKENS, GET_TOKENS_BY_USER, CREATE_TOKEN, DELETE_TOKEN } from "../types";

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
        case GET_TOKENS: {
            return {
                ...state,
                tokens: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case GET_TOKENS_BY_USER: {
            return {
                ...state,
                userTokens: Array.isArray(dataToUse) ? dataToUse : []
            };
        }
        case CREATE_TOKEN: {
            return {
                ...state,
                userTokens: state.userTokens ? [...state.userTokens, dataToUse] : [dataToUse]
            };
        }
        case DELETE_TOKEN: {
            const idToDelete = payload;
            return {
                ...state,
                tokens: state.tokens.filter(token => token.idToken !== idToDelete),
                userTokens: state.userTokens.filter(token => token.idToken !== idToDelete),
            };
        }
        default:
            return state;
    }
};