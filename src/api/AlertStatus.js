import axios from "../axios";

export default {
    methods: {
        getAlertStatusesList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/publishedstatuses/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true })
        },
        getAlertStatus(id) {
            return axios.get('/articles/publishedstatuses/' + id, { withCredentials: true })
        },
        deleteAlertStatus(id) {
            return axios.delete('/articles/publishedstatuses/' + id, { withCredentials: true })
        },
        postAlertStatus(data) {
            return axios.post('/articles/publishedstatuses/', data, { withCredentials: true })
        },
        putAlertStatus(id, data) {
            return axios.put('/articles/publishedstatuses/' + id + '/', data, { withCredentials: true })
        }
    }
}
