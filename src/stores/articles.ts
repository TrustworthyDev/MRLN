import {
    Agency,
    AlertType,
    Article,
    FederalRegisterPublication,
    FilingType,
    Status,
    UpdateArticlesWithModels
} from "@/types/Article";
import axios from "@/axios";
import { useNotificationStore } from '@/stores/notifications';
import { Notification } from "@/types/Notification";
import { Model, ModelTypes } from "@/types/ModelTypes";
import { TableOptions } from "@/types/logging/TableOptions";
import { BulkLogChanges } from "@/helpers/requests/logChanges";
import { LoggingAction } from "@/types/logging/LoggingActions";
import { defineStore } from 'pinia'



export const useArticleStore = defineStore({
    id: 'articles',

    state: () => ({
        articles: [] as Article[],
        selectingAllArticles: false as boolean,
        totalResults: 0,
    }),

    getters: {
        getCurrentArticles: (state) => state.articles,
        isSelectingAllArticles: (state) => state.selectingAllArticles,
        getTotalResults: (state) => state.totalResults,
        getSelectedArticles: (state) => {
            const tempArticles = [...state.articles];
            return tempArticles.filter(obj => {
                return obj.selected;
            });
        },
        getSelectedArticlesId: (state) => {
            const tempArticles = [...state.articles];
            const result = tempArticles.filter(obj => {
                return obj.selected;
            });
            const arr: number[] = [];
            result.forEach(item => {
                arr.push(item.id);
            });
            return arr;
        }
    },

    actions: {
        setAllArticles(payload: Array<Article>) {
            this.articles = payload;
        },
        selectAnArticle(payload: number) {
            const itemIndex = this.articles.findIndex(x => x.id === payload);
            this.articles[itemIndex].selected = !this.articles[itemIndex].selected;
        },
        selectAllArticles() {
            this.articles.forEach(item => {
                item.selected = true;
            });
            this.selectingAllArticles = true;
        },
        deselectAllArticles() {
            this.articles.forEach(item => {
                item.selected = false;
            });
            this.selectingAllArticles = false;
        },

        updateArticleById(payload: Article) {
            const allArticles = [...this.articles];
            const itemIndex = allArticles.findIndex(x => x.id === payload.id);
            allArticles[itemIndex] = payload;
            this.articles = allArticles;
        },

        removeArticle(payload: Article) {
            const allArticles: Article[] = [...this.articles];
            const idx = allArticles.findIndex(x => x.id === payload.id);
            allArticles.splice(idx, 1);
            this.articles = allArticles;
        },
        getAllArticles() {
            axios.get('/articles/all/', { withCredentials: true })
                .then(response => {
                    const allArticles: Array<Article> = [];
                    response.data.all_articles.forEach(item => {
                        const newArticle: Article = {
                            id: item.id,
                            sector: item.sector,
                            title: item.title,
                            summary: item.summary,
                            agency: item.agency as Array<Agency>,
                            url: item.url,
                            status: item.status as Status,
                            tags: item.tags as Array<string>,
                            classification: item.classification,
                            federal_register_publication: item.federal_register_publication as FederalRegisterPublication,
                            federal_register_number: item.federal_register_number,
                            proposed_rule_comments_due_date: item.proposed_rule_comments_due_date,
                            original_publication_date: item.original_publication_date,
                            federal_register_publication_date: item.federal_register_publication_date,
                            rule_effective_date: item.rule_effective_date,
                            latest_update: item.latest_update,
                            filing_type: item.filing_type as FilingType,
                            alert_type: item.alert_type as AlertType,
                            sec_release_number: item.sec_release_number,
                            order_notice_id: item.order_notice_id,
                            docket_file_number: item.docket_file_number,
                            fine_amount_total: item.fine_amount_total,
                            event_start_date: item.event_start_date,
                            event_end_date: item.event_end_date,
                            event_location: item.event_location,
                            regalytics_alert_id: item.regalytics_alert_id,
                            selected: false
                        };
                        allArticles.push(newArticle)
                    });
                    this.setAllArticles(allArticles);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching the Articles. Please refresh and try again!',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                })
        },

        getAssignedArticles() {
            axios.get('/articles/assigned-articles/', { withCredentials: true })
                .then(response => {
                    const allArticles: Array<Article> = [];

                    response.data.articles.forEach(item => {
                        const newArticle: Article = {
                            id: item.id,
                            sector: item.sector,
                            title: item.title,
                            summary: item.summary,
                            agency: item.agency as Array<Agency>,
                            url: item.url,
                            status: item.status as Status,
                            tags: item.tags as Array<string>,
                            classification: item.classification,
                            federal_register_publication: item.federal_register_publication as FederalRegisterPublication,
                            federal_register_number: item.federal_register_number,
                            proposed_rule_comments_due_date: item.proposed_rule_comments_due_date,
                            original_publication_date: item.original_publication_date,
                            federal_register_publication_date: item.federal_register_publication_date,
                            rule_effective_date: item.rule_effective_date,
                            latest_update: item.latest_update,
                            filing_type: item.filing_type as FilingType,
                            alert_type: item.alert_type as AlertType,
                            sec_release_number: item.sec_release_number,
                            order_notice_id: item.order_notice_id,
                            docket_file_number: item.docket_file_number,
                            fine_amount_total: item.fine_amount_total,
                            event_start_date: item.event_start_date,
                            event_end_date: item.event_end_date,
                            event_location: item.event_location,
                            regalytics_alert_id: item.regalytics_alert_id,
                            selected: false
                        };
                        allArticles.push(newArticle)
                    });
                    this.setAllArticles(allArticles);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching the Articles. Please refresh and try again!',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                })
        },
        massUpdateArticles(articleIdArray: number[]) {
            axios.post('/articles/bulk-update/', {
                articles: articleIdArray
            }).then(r => {
                const notification: Notification = {
                    message: 'Updated the selected articles successfully!',
                    type: 'primary'
                }
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
            }).catch(err => {
                const notification: Notification = {
                    message: 'There was an error updating the selected Articles! Please try again.',
                    type: 'danger'
                }
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
            });
        },
        massUpdateWithModels(payload: UpdateArticlesWithModels) {

            const currentArticles: Article[] = [...payload.articles];
            const allIds: number[] = [];

            if (payload.many) {
                switch (payload.type) {
                    case ModelTypes.agency:
                        currentArticles.forEach((x: Article) => {
                            x.agency = payload.models as Model[]
                        });
                        break;
                    case ModelTypes.tag:
                        currentArticles.forEach((x: Article) => {
                            x.tags = payload.models as unknown as string[]
                        });
                        break;
                    default:
                        break;
                }
            } else {
                switch (payload.type) {
                    case ModelTypes.sector:
                        currentArticles.forEach((x: Article) => {
                            x.sector = payload.models as Model
                        });
                        break;
                    case ModelTypes.status:
                        currentArticles.forEach((x: Article) => {
                            x.status = payload.models as Model
                        });
                        break;
                    case ModelTypes.classification:
                        currentArticles.forEach((x: Article) => {
                            x.classification = payload.models as Model
                        });
                        break;
                    case ModelTypes.federal_register_publication:
                        currentArticles.forEach((x: Article) => {
                            x.federal_register_publication = payload.models as Model
                        });
                        break;
                    case ModelTypes.filing_type:
                        currentArticles.forEach((x: Article) => {
                            x.filing_type = payload.models as Model
                        });
                        break;
                    case ModelTypes.alert_type:
                        currentArticles.forEach((x: Article) => {
                            x.alert_type = payload.models as Model
                        });
                        break;
                    default:
                        break;
                }
            }

            currentArticles.forEach((x: Article) => {
                allIds.push(x.id);
            });

            axios.post('/articles/update-models/', {
                "articles": currentArticles,
                "ids": allIds,
                "updated_field": payload.type
            }, { withCredentials: true })
                .then(r => {

                    const modelsTable = TableOptions.ARTICLE;
                    BulkLogChanges(LoggingAction.UPDATED, modelsTable, allIds)
                        .then(r => {
                            console.log('Done!');
                        })

                    // TODO: Update Articles in state based on new values
                })
                .catch(err => {
                    console.log(err)
                    // TODO: Add notifications and error handling
                });
        },
    }
})

