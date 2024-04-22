import axios from "../axios";

export default {
    methods: {
        getTagList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/tags/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getTag(id) {
            return axios.get('/articles/tags/' + id, { withCredentials: true })
        },
        deleteTag(id) {
            return axios.delete('/articles/tags/' + id, { withCredentials: true })
        },
        postTag(data) {
            return axios.post('/articles/tags/', data, { withCredentials: true })
        },
        putTag(id, data) {
            return axios.put('/articles/tags/' + id + '/', data, { withCredentials: true })
        },

    }
}
