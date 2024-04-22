import axios from "../axios";

export default {
    methods: {
        getSubtypeClassificationList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/subtypeclassifications/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getSubtypeClassification(id) {
            return axios.get('/articles/subtypeclassifications/' + id, { withCredentials: true })
        },
        deleteSubtypeClassification(id) {
            return axios.delete('/articles/subtypeclassifications/' + id, { withCredentials: true })
        },
        postSubtypeClassification(data) {
            return axios.post('/articles/subtypeclassifications/', data, { withCredentials: true })
        },
        putSubtypeClassification(id, data) {
            return axios.put('/articles/subtypeclassifications/' + id + '/', data, { withCredentials: true })
        },

    }
}
