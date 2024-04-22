import axios from "../axios";

export default {
    methods: {
        getAllClassifications(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/classifications/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getClassification(id) {
            return axios.get('/articles/classifications/' + id, { withCredentials: true })
        },
        deleteClassification(id) {
            return axios.delete('/articles/classifications/' + id, { withCredentials: true })
        },
        postClassification(data) {
            return axios.post('/articles/classifications/', data, { withCredentials: true })
        },
        putClassification(id, data) {
            return axios.put('/articles/classifications/' + id + '/', data, { withCredentials: true })
        }
    }
}
