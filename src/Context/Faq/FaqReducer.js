import {
    GET_FAQS,
    CREATE_FAQ,
    UPDATE_FAQ,
    DELETE_FAQ
} from "../types";

const extractData = (payload) => {
    if (payload && payload.$values) return payload.$values;
    return payload;
};

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {

        case GET_FAQS: {
            const data = extractData(payload);
            return {
                ...state,
                faqs: Array.isArray(data) ? data : []
            };
        }

        case CREATE_FAQ: {
            return {
                ...state,
                faqs: [...state.faqs, extractData(payload)]
            };
        }

        case UPDATE_FAQ: {
            const updatedFaq = extractData(payload);
            return {
                ...state,
                faqs: state.faqs.map(faq =>
                    faq.idPregunta === updatedFaq.idPregunta ? updatedFaq : faq
                )
            };
        }

        case DELETE_FAQ: {
            return {
                ...state,
                faqs: state.faqs.filter(faq => faq.idPregunta !== payload)
            };
        }

        default:
            return state;
    }
};
