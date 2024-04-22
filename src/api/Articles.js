import axios from "../axios";

export default {
    methods: {
        getAllArticles: async (params, page, page_size) => {
            return await axios.post('/articles/all-editable?page=' + page + '&page_size=' + page_size, params, { withCredentials: true });
        },
        getAllArticlesRelatedData: async (user_id) => {
            return await axios.get('/articles/all-editable', { withCredentials: true });
        },
        update_col_def(params, user_id) {
            return axios.post('/accounts/user/update-col-def?user_id=' + user_id, params, { withCredentials: true })
                .then(response => {
                    return response;
                })
        },
        getAllArticleRules(params, page, rule_id, page_size) {
            return axios.post('/collections/rules/articles?page=' + page + '&rule=' + rule_id + '&page_size=' + page_size, params, { withCredentials: true });
        },
        getArticle(id) {
            return axios.get('/articles/article/' + id, { withCredentials: true })
        },
        updateArticleEntity(id, params) {
            return axios.post('/articles/update-entity/' + id, params, { withCredentials: true })
        },
        bulkUpdateArticles(payload) {
            return axios.post('/articles/bulk-update-articles/', payload, { withCredentials: true })
        },
        get_related_article_data() {
            return axios.get('/collections/related-data', { withCredentials: true })

        }
    }
}
