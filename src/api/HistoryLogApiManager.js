import axios from "../axios";

export default {
    methods: {
        getHistoryLog(id) {
            return axios.get('/articles/get-article-history/' + id, {withCredentials: true})
        },
        revertHistory(id){
            return axios.post('/articles/revert-article/' + id,{}, {withCredentials: true})
        }
    }
}
