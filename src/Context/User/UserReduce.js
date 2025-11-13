import { GET_PROFILE, GET_USERS, CAMBIAR_ESTATUS } from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) {
        return payload.$values;
    }
    if (payload && payload.$id && Object.keys(payload).length > 1) {
        return payload;
    }
    return payload;
};


export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_USERS: {
            const dataToUse = extractData(payload);
            const userArray = Array.isArray(dataToUse) ? dataToUse : [];
            return {
                ...state,
                users: userArray
            }
        }

        case GET_PROFILE: {
            let userData = extractData(payload);
            const selectedUserPayload = Array.isArray(userData) ? userData[0] : userData;

            return {
                ...state,
                selectedUser: selectedUserPayload
            }
        }

        case CAMBIAR_ESTATUS: {
            const updatedUser = extractData(payload);
            if (state.selectedUser && updatedUser && state.selectedUser.idUsuario === updatedUser.idUsuario) {
                return {
                    ...state,
                    selectedUser: updatedUser
                }
            }
            return {
                ...state
            }
        }

        default:
            return state
    }
}