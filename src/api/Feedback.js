import axios from "../axios";
import axiosMain from "axios";

const cancelTokenSource = axiosMain.CancelToken.source();

export default {
    methods: {
        getAllFeedbacks: async () => {
            return axios.get('/feedback/', { withCredentials: true });
        },
        getArticleFeedbacks: async (articleId) => {
            return axios.get('/feedback/feedbacks/' + articleId, { withCredentials: true });
        },
        getFeedback(id) {
            return axios.get('/feedback/' + id, { withCredentials: true })
        },
        postFeedback(data) {
            return axios.post('/feedback/', data, { withCredentials: true })
        },
        updateFeedback(id, data) {
            return axios.put('/feedback/' + id + '/', data, { withCredentials: true })
        },
        postFeedbackMessage(data) {
            return axios.post('/feedback/message/', data, { withCredentials: true })
        },
    }
}
