import axios from "../axios";

export default {
    methods: {
        getDocketFileNumberList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/docketfilenumbers/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getDocketFileNumber(id) {
            return axios.get('/articles/docketfilenumbers/' + id, { withCredentials: true })
        },
        deleteDocketFileNumber(id) {
            return axios.delete('/articles/docketfilenumbers/' + id, { withCredentials: true })
        },
        postDocketFileNumber(data) {
            return axios.post('/articles/docketfilenumbers/', data, { withCredentials: true })
        },
        putDocketFileNumber(id, data) {
            return axios.put('/articles/docketfilenumbers/' + id + '/', data, { withCredentials: true })
        },

    }
}
