import { defineStore } from 'pinia'


export const useApplicationStore = defineStore({
    id: 'application',
    state: () => ({
        isLoading: false as boolean,
        isMobile: false as boolean,
        windowHeight: 0 as number,
        showingSupportModal: false as boolean,
        showingAccountModal: false as boolean
    }),
    getters: {
        // No need for any getters that return state under the same name (eg. firstName: (state) => state.firstName), 
        // these are not necessary as you can access any state directly from the store instance
    },
    actions: {
        setApplicationLoadingState(value: boolean) {
            this.isLoading = value;
        },
        setSupportModal(value: boolean) {
            this.showingSupportModal = value;
        },
        setAccountModal(value: boolean) {
            this.showingAccountModal = value;
        },

        setIsMobile(value: boolean) {
            this.isMobile = value;
        },

        setWindowHeight(value: number) {
            this.windowHeight = value;
        }
    }
})



