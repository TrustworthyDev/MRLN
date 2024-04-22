import axios from "../axios";

export default {
    methods: {
        getOrderNoticeList(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/ordernotices/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getOrderNotice(id) {
            return axios.get('/articles/ordernotices/' + id, { withCredentials: true })
        },
        deleteOrderNotice(id) {
            return axios.delete('/articles/ordernotices/' + id, { withCredentials: true })
        },
        postOrderNotice(data) {
            return axios.post('/articles/ordernotices/', data, { withCredentials: true })
        },
        putOrderNotice(id, data) {
            return axios.put('/articles/ordernotices/' + id + '/', data, { withCredentials: true })
        },

    }
}
