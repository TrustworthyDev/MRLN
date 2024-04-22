import axios from "../axios";

export default {
    methods: {
        getArticleTypeList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/articletypes/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getArticleType(id) {
            return axios.get('/articles/articletypes/' + id, { withCredentials: true })
        },
        deleteArticleType(id) {
            return axios.delete('/articles/articletypes/' + id, { withCredentials: true })
        },
        postArticleType(data) {
            return axios.post('/articles/articletypes/', data, { withCredentials: true })
        },
        putArticleType(id, data) {
            return axios.put('/articles/articletypes/' + id + '/', data, { withCredentials: true })
        },

    }
}
