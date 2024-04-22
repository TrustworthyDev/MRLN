import axios from "../axios";

export default {
    methods: {
        getStateList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/states/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getState(id) {
            return axios.get('/articles/states/' + id, { withCredentials: true })
        },
        deleteState(id) {
            return axios.delete('/articles/states/' + id, { withCredentials: true })
        },
        postState(data) {
            return axios.post('/articles/states/', data, { withCredentials: true })
        },
        putState(id, data) {
            return axios.put('/articles/states/' + id + '/', data, { withCredentials: true })
        },

    }
}
