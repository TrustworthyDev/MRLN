import axios from "../axios";

export default {
    methods: {
        getHigherLevelAlertClassificationList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/higherlevelalertclassifications/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getHigherLevelAlertClassification(id) {
            return axios.get('/articles/higherlevelalertclassifications/' + id, { withCredentials: true })
        },
        deleteHigherLevelAlertClassification(id) {
            return axios.delete('/articles/higherlevelalertclassifications/' + id, { withCredentials: true })
        },
        postHigherLevelAlertClassification(data) {
            return axios.post('/articles/higherlevelalertclassifications/', data, { withCredentials: true })
        },
        putHigherLevelAlertClassification(id, data) {
            return axios.put('/articles/higherlevelalertclassifications/' + id + '/', data, { withCredentials: true })
        },

    }
}
