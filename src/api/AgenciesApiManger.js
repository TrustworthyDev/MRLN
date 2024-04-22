import axios from "../axios";

export default {
    methods: {
        getAllAgencies(currentPage, filter, type = 'paginated') {
            return axios.get('/articles/agencies/?page=' + currentPage + '&search=' + filter + '&type=' + type, { withCredentials: true });
        },
        getAgency(id) {
            return axios.get('/articles/agencies/' + id, { withCredentials: true })
        },
        deleteAgency(id) {
            return axios.delete('/articles/agencies/' + id, { withCredentials: true })
        },
        getStatesAndCountries() {
            return axios.get('/articles/article-options/', { withCredentials: true })
        },
        postAgency(data) {
            return axios.post('/articles/agencies/', data, { withCredentials: true })
        },
        putAgency(id, data) {
            return axios.put('/articles/agencies/' + id + '/', data, { withCredentials: true })
        }
    }
}
