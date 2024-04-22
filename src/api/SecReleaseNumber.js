import axios from "../axios";

export default {
    methods: {
        getSecReleaseNumberList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/secreleasenumbers/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getSecReleaseNumber(id) {
            return axios.get('/articles/secreleasenumbers/' + id, { withCredentials: true })
        },
        deleteSecReleaseNumber(id) {
            return axios.delete('/articles/secreleasenumbers/' + id, { withCredentials: true })
        },
        postSecReleaseNumber(data) {
            return axios.post('/articles/secreleasenumbers/', data, { withCredentials: true })
        },
        putSecReleaseNumber(id, data) {
            return axios.put('/articles/secreleasenumbers/' + id + '/', data, { withCredentials: true })
        },

    }
}
