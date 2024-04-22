import { useNotificationStore } from "@/stores/notifications";
import { useArticleStore } from "@/stores/articles";
import { Notification } from "@/types/Notification";
import { EditorDetails, User, UserResponse } from "@/types/User";
import { AssignEditorArticles, GetAllEditors, GetEditorInformation } from "@/helpers/requests/allUsers";
import { Article } from "@/types/Article";


import { defineStore } from 'pinia';

export const useAllUserStore = defineStore({
    id: 'allUser',
    state: () => ({
        allUsers: [] as Array<User>,
        currentUser: {} as EditorDetails
    }),
    getters: {
        getAllUsers: (state) => state.allUsers,
        getCurrentUser: (state) => state.currentUser
    },
    actions: {
        setAllUsers(payload: Array<User>) {
            this.allUsers = payload;
        },

        setCurrentUser(payload: EditorDetails) {
            this.currentUser = payload;
        },

        fetchAllEditors() {
            GetAllEditors()
                .then(r => {
                    const allUsers: Array<User> = [];
                    // r.data.users.forEach((x: UserResponse) => {
                    //     const newUser: User = {
                    //         id: x.id,
                    //         email: x.email,
                    //         username: x.username,
                    //         firstName: x.first_name,
                    //         lastName: x.last_name,
                    //         group: x.group
                    //     }
                    //     allUsers.push(newUser);
                    // });
                    this.setAllUsers(allUsers);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: "There was an issue fetching all editors. Please try again!",
                        type: "danger"
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        assignEditorArticles(user: User) {
            const articleStore = useArticleStore();
            const allArticles: Array<Article> = articleStore.getSelectedArticles;
            AssignEditorArticles(user, allArticles)
                .then(() => {
                    const notification: Notification = {
                        message: "Successfully assigned articles to the user!",
                        type: 'primary'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: "There was an error assigning the articles to the user!",
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        getEditorDetails(userId: number) {
            GetEditorInformation(userId)
                .then(r => {
                    // this.setCurrentUser(r.data);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: "There was an error fetching the users information!",
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        }
    }
})

