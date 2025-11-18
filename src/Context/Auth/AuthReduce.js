import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from "../types";

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: payload.user,
                token: payload.token,
                isAuthenticated: true,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};