import { Agency, AlertType, Article, Classification, FilingType, Sector, Status } from "@/types/Article";
import axios from "@/axios";
import { useArticleStore } from "@/stores/articles";
import { Notification } from "@/types/Notification";
import { LogChanges } from "@/helpers/requests/logChanges";
import { LoggingAction } from "@/types/logging/LoggingActions";
import { TableOptions } from "@/types/logging/TableOptions";
import { defineStore } from 'pinia';
import { useNotificationStore } from "@/stores//notifications";

export const useEditArticleStore = defineStore({
    id: 'editArticle',
    state: () => ({
        article: {} as Article,
        isEditing: false
    }),
    getters: {
        getCurrentArticle: (state) => state.article,
        getIsEditing: (state) => state.isEditing,
    },
    actions: {
        setArticleData(payload: Article) {
            this.article = payload;
            this.setIsEditing(true);
        },

        setIsEditing(payload: boolean) {
            this.isEditing = payload;
        },

        updateTitle(payload: string) {
            this.article.title = payload;
        },

        updateSummary(payload: string) {
            this.article.summary = payload;
        },

        updateUrl(payload: string) {
            this.article.url = payload;
        },

        addAgencies(payload: Array<Agency>) {
            this.article.agency = payload;
        },

        addAlertTypes(payload: AlertType) {
            this.article.alert_type = payload;
        },

        addFilingTypes(payload: FilingType) {
            this.article.filing_type = payload;
        },

        addClassifications(payload: Classification) {
            this.article.classification = payload;
        },

        addStatus(payload: Status) {
            this.article.status = payload;
        },

        addSector(payload: Sector) {
            this.article.sector = payload;
        },

        updateLatestUpdate(payload: string) {
            this.article.latest_update = payload;
        },

        removeArticle() {
            this.article = {} as Article;
            this.isEditing = false;
        },

        hideEditingPage() {
            this.setIsEditing(false);
        },

        saveChanges(article: Article) {
            axios.post('/articles/update/', {
                ...article
            }, { withCredentials: true }).then(() => {
                const articleStore = useArticleStore();
                articleStore.updateArticleById(article);
                const notification: Notification = {
                    message: 'Updated the article successfully!',
                    type: 'primary'
                }
                const notificationStore = useNotificationStore()
                notificationStore.addNotification(notification);
                LogChanges(LoggingAction.UPDATED, TableOptions.ARTICLE, article.id);
            }).catch(() => {
                const notification: Notification = {
                    message: 'There was an error updating the Article! Please try again.',
                    type: 'danger'
                }
                const notificationStore = useNotificationStore()
                notificationStore.addNotification(notification);
            });
        },

        /*
        * Removes an assigned Article to the current user
        * */
        removeAssignedArticle(article: Article) {
            axios.post('/articles/assigned-articles/', {
                article_id: article.id
            }, { withCredentials: true })
                .then(r => {
                    this.removeArticle();
                    const articleStore = useArticleStore();
                    articleStore.removeArticle(article);
                })
                .catch(err => {
                    const notification: Notification = {
                        message: 'There was an error removing the assigned Article! Please try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore()
                    notificationStore.addNotification(notification);
                })
        }


    }
})

