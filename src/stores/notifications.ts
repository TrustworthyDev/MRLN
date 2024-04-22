import { User } from "@/types/User";
import { Notification, NotificationWithId } from "@/types/Notification";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore({
    id: 'notifications',
    state: () => ({
        notifications: [] as NotificationWithId[],
        user: {} as User,
    }),
    getters: {
        // No need for any getters that return state under the same name (eg. firstName: (state) => state.firstName), 
        // these are not necessary as you can access any state directly from the store instance
    },
    actions: {
        setAccountData(payload: User) {
            this.user = payload
        },

        addNotification(payload: Notification) {
            const newNotification: NotificationWithId = {
                id: uuidv4(),
                message: payload.message,
                type: payload.type
            }

            this.notifications.unshift(newNotification);

            setTimeout(() => {
                this.removeFromNotifications(newNotification);
            }, 3000) // Auto-removes after 3 seconds

        },

        removeFromNotifications(payload: NotificationWithId) {
            const idx = this.notifications.findIndex(x => x.id === payload.id);
            this.notifications.splice(idx, 1);
        },

        clearNotifications() {
            this.notifications = []
        },
    }
})

