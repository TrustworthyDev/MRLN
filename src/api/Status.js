import axios from "../axios";

export default {
    methods: {
        getAllStatuses(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/statuses/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getStatus(id) {
            return axios.get('/articles/statuses/' + id, { withCredentials: true })
        },
        deleteStatus(id) {
            return axios.delete('/articles/statuses/' + id, { withCredentials: true })
        },
        postStatus(data) {
            return axios.post('/articles/statuses/', data, { withCredentials: true })
        },
        putStatus(id, data) {
            return axios.put('/articles/statuses/' + id + '/', data, { withCredentials: true })
        }
    }
}
