import { defineStore } from 'pinia'
import { ModelTypes } from "@/types/ModelTypes";
import axios from "@/axios";
import { NewModel, NewModelResponse } from "@/types/NewModel";
import { useNotificationStore } from '@/stores/notifications';
import { useKeywordStore } from '@/stores/keywords';
import { Notification } from "@/types/Notification";



export const useNewModelStore = defineStore({
    id: 'new-model',
    state: () => ({
        isOpen: false as boolean,
        modelType: ModelTypes.agency as ModelTypes,
        name: '' as string
    }),
    getters: {

        getIsOpen: (state) => state.isOpen,
        getModelType: (state) => state.modelType,
        getModelName: (state) => state.name,
    },
    actions: {
        setIsOpen(payload: boolean) {
            this.isOpen = payload;
        },
        setModelType(payload: ModelTypes) {
            this.modelType = payload;
        },
        setModelName(payload: string) {
            this.name = payload;
        },
        createNewModel(value: NewModel) {
            axios.post('/articles/new-model/', {
                ...value
            }, { withCredentials: true }).then(r => {
                const newModel: NewModelResponse = {
                    ...r.data
                };
                this.setModelName('');
                const keywordStore = useKeywordStore()
                keywordStore.addNewModel(newModel);
            }).catch(err => {
                const notification: Notification = {
                    message: 'There was an error creating the new model! Please try again.',
                    type: 'danger'
                }
                const notificationStore = useNotificationStore(); 
                notificationStore.addNotification(notification);
            })
        }
    }

})

