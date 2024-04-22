import axios from "../axios";

export default {
    methods: {
        getRuleHistory(id) {
            return axios.get('/history/rule-history/' + id, { withCredentials: true })
        },
        revertRuleHistory(id, data) {
            return axios.post('/history/rule-history/' + id, data, { withCredentials: true })
        },
        applyRule_(id, data) {
            return axios.post('/collections/rule/search/' + id + '/', data, { withCredentials: true })
        },
        checkTaskStatus(taskId) {
            return axios.get(`/collections/apply-rule-status?task_id=${taskId}`, { withCredentials: true })
        }
    }
}
