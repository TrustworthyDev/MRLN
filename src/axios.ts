import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useAccountStore } from '@/stores/account';
import { useNotificationStore } from '@/stores/notifications';
import { useApplicationStore } from '@/stores/application';
import router from "@/router";
import { trackingHelper } from "@/main";

let api_url;



if (process.env.VUE_APP_API_ENVIRONMENT == "PRODUCTION" ||
    process.env.VUE_APP_API_ENVIRONMENT == "STAGING") {
    api_url = process.env.VUE_APP_API_SERVER_URL;
} else {
    api_url = "http://127.0.0.1:8000";
}

const config: AxiosRequestConfig = {
    baseURL: api_url
}

const client: AxiosInstance = axios.create(config);

/*
* Handles automatically refreshing the token
* Catches 401 and 403 errors
* */


const refreshAuthLogic = (failedRequest: any) => client.post('/auth/refresh',
    {}, { withCredentials: true }).then(r => {
        const token = r.data.access;
        const accountStore = useAccountStore();
        accountStore.setUserToken(token);
        failedRequest.response.config.headers.common = { 'Authorization': `Bearer ${token}` };
        client.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
        return Promise.resolve();
    }).catch(() => {
        router.push({ name: 'Login' });
        const notificationStore = useNotificationStore();
        const applicationStore = useApplicationStore();
        notificationStore.addNotification({
            message: 'You\'re not authenticated! Please login to continue.',
            type: 'danger'
        });
        applicationStore.setApplicationLoadingState(false);
    });

createAuthRefreshInterceptor(client, refreshAuthLogic, {
    statusCodes: [401, 403],
    pauseInstanceWhileRefreshing: true
});

client.interceptors.response.use(
    (response) => {
        if (response.status === 400 || response.status === 401) {
            window.localStorage.clear();
            trackingHelper.resetUser();
            const applicationStore = useApplicationStore();
            applicationStore.setApplicationLoadingState(false);
            localStorage.removeItem('current_page');
            router.push('/login');
        }

        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
