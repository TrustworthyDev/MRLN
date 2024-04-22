import axios from "../axios";

export default {
    methods: {
        getFilingTypeList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/filingtypes/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getFilingType(id) {
            return axios.get('/articles/filingtypes/' + id, { withCredentials: true })
        },
        deleteFilingType(id) {
            return axios.delete('/articles/filingtypes/' + id, { withCredentials: true })
        },
        postFilingType(data) {
            return axios.post('/articles/filingtypes/', data, { withCredentials: true })
        },
        putFilingType(id, data) {
            return axios.put('/articles/filingtypes/' + id + '/', data, { withCredentials: true })
        },

    }
}
