import axios from "../axios";

export default {
    methods: {
        getAlertTypesList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/alerttypes/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true })
        },
        getAlertType(id) {
            return axios.get('/articles/alerttypes/' + id, { withCredentials: true })
        },
        deleteAlertType(id) {
            return axios.delete('/articles/alerttypes/' + id, { withCredentials: true })
        },
        postAlertType(data) {
            return axios.post('/articles/alerttypes/', data, { withCredentials: true })
        },
        putAlertType(id, data) {
            return axios.put('/articles/alerttypes/' + id + '/', data, { withCredentials: true })
        }
    }
}
