import axios from "@/axios";
import LoginUser from "@/helpers/requests/accounts/loginUser";
import logoutUser from "@/helpers/requests/accounts/logoutUser";
import RefreshToken from "@/helpers/requests/accounts/refreshToken";
import { trackingHelper } from "@/main";
import router from "@/router";
import { useApplicationStore } from '@/stores/application';
import { useNotificationStore } from '@/stores/notifications';
import { Notification } from "@/types/Notification";
import { ArticlesLayout, User } from "@/types/User";
import { UserLogin } from "@/types/UserLogin";
import { defineStore } from 'pinia';

// https://github.com/vuejs/pinia/discussions/969  => Must read to simplify the code
// https://github.com/vuejs/pinia/issues/625


export const useAccountStore = defineStore({
    id: 'account',
    state: () => ({
        status: {
            loading: false,
        },
        user: {
            id: 0,
            email: null,
            role: null,
            permissions: null,
            telemetry: true,
            jwtToken: null,
            name: null,
            color: null,
            articles_layout: null
        } as User,
    }),
    getters: {

        isLoading: (state) => state.status.loading,
        getCurrentUser: (state) => state.user,

    },
    actions: {
        setAccountData(user: User) {
            this.user = user;
        },
        loginSuccess(user: User) {
            this.status = {
                loading: false,
            };
            this.user = user;
            console.log(this.user);
        },

        login(user: UserLogin) {
            const notificationStore = useNotificationStore();
            const applicationStore = useApplicationStore();
            this.setLoadingStatus(true);

            LoginUser(user.email, user.password)
                .then((r: { data: any; }) => {
                    trackingHelper.trackUser(r.data);
                    const userData = r.data;
                    console.log(userData.color)
                    this.loginSuccess({
                        id: userData.id,
                        email: userData.email,
                        role: userData.role,
                        permissions: userData.permissions,
                        telemetry: userData.telemetry,
                        jwtToken: userData.access,
                        name: userData.name,
                        color: userData.color,
                        articles_layout: userData.articles_layout
                    } as User);
                    axios.defaults.headers.common = { 'Authorization': `Bearer ${userData.access}` };
                    router.push({ name: 'Articles' });
                })
                .then(() => {
                    notificationStore.clearNotifications();
                })
                .catch((err: { response: { data: any; }; }) => {
                    this.setLoadingStatus(false);
                    notificationStore.addNotification({ message: err.response.data, type: 'danger' });
                    applicationStore.setApplicationLoadingState(false);
                });
        },

        logout() {
            logoutUser()
                .then(r => {
                    const applicationStore = useApplicationStore();
                    applicationStore.setApplicationLoadingState(true);
                    this.logoutSuccess();

                    // Removes all cookies from the Browser for the current domain
                    const cookies = document.cookie.split(";");
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }

                    window.localStorage.clear();
                    trackingHelper.resetUser();
                    applicationStore.setApplicationLoadingState(false);
                    localStorage.removeItem('current_page');
                    return router.push('/login');
                })

                .catch(err => {
                    // Removes all cookies from the Browser for the current domain
                    const cookies = document.cookie.split(";");
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }

                    window.localStorage.clear();
                    const applicationStore = useApplicationStore();
                    trackingHelper.resetUser();
                    applicationStore.setApplicationLoadingState(false);
                    localStorage.removeItem('current_page');
                    return router.push('/login');
                });
        },

        refreshToken() {
            RefreshToken()
                // .then((r: { data: { token: string; } }) => {
                .then((r) => {
                    // commit('SET_USER_TOKEN', r.data.token);
                    this.setUserToken("r")
                })
                .catch(() => {
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification({
                        message: "You're unauthenticated! Login to continue",
                        type: "danger"
                    } as Notification);
                    localStorage.removeItem('current_page');
                    return router.push('/login');
                });
        },

        setLoadingStatus(value: boolean) {
            this.status = { loading: value };
        },

        setAccountDetails(payload: User) {
            this.user = payload;
        },

        setUserToken(payload: string) {
            this.user.jwtToken = payload;
        },

        setUserLayout(layout: ArticlesLayout) {
            this.user.articles_layout = layout;
        },

        logoutSuccess() {
            this.user = {
                id: 0,
                email: null,
                role: null,
                permissions: null,
                telemetry: true,
                jwtToken: null,
                name: null,
                color: null,
                articles_layout: null
            } as User;
        },

    }

})

