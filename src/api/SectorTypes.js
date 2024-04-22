import axios from "../axios";

export default {
    methods: {
        getSectorTypesList(currentPage, filter) {
            return axios.get('/articles/sectortypes/?page=' + currentPage + '&search=' + filter, { withCredentials: true })
        },
        getSectorType(id) {
            return axios.get('/articles/sectortypes/' + id, { withCredentials: true })
        },
        deleteSectorType(id) {
            return axios.delete('/articles/sectortypes/' + id, { withCredentials: true })
        },
        postSectorType(data) {
            return axios.post('/articles/sectortypes/', data, { withCredentials: true })
        },
        putSectorType(id, data) {
            return axios.put('/articles/sectortypes/' + id + '/', data, { withCredentials: true })
        },

    }
}
