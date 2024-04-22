import axios from "../axios";

export default {
    methods: {
        getUsersList(currentPage, filter) {
            return axios.get('/accounts/users?page=' + currentPage + '&search=' + filter, { withCredentials: true })
        },
        getUser(id) {
            return axios.get('/accounts/users/' + id, { withCredentials: true })
        },
        deleteUser(id) {
            return axios.delete('/accounts/users/' + id, { withCredentials: true })
        },
        getUserRoles() {
            return axios.get('/accounts/roles', { withCredentials: true })
        },
        getUserLicenses() {
            return axios.get('/accounts/licenses', { withCredentials: true })
        },
        postUser(data) {
            return axios.post('/accounts/users/', data, { withCredentials: true })
        },
        putUser(id, data) {
            return axios.put('/accounts/users/' + id, data, { withCredentials: true })
        },

    }
}
