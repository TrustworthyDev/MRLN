import { defineStore } from 'pinia'
import { FindAndReplace, FindAndReplaceMethodType, FindAndReplaceRequest } from "@/types/FindAndReplace";

import axios from "@/axios";
import { useNotificationStore } from '@/stores/notifications';
import {
    Agency,
    AlertType,
    Classification,
    FederalRegisterPublication,
    FilingType,
    Sector,
    Status,
    Tag,
    Rules
} from "@/types/Article";
import { ModelTypes, RequestType, UpdateModel } from "@/types/ModelTypes";
import { NewModelResponse } from "@/types/NewModel";
import { Notification } from "@/types/Notification";
import { TableOptions } from "@/types/logging/TableOptions";
import { LogChanges } from "@/helpers/requests/logChanges";
import { LoggingAction } from "@/types/logging/LoggingActions";



export const useKeywordStore = defineStore({
    id: 'keywords',
    state: () => ({
        findAndReplace: [] as Array<FindAndReplace>,
        agencies: [] as Array<Agency>,
        allRules: [] as Array<Rules>,
        rules: [] as Array<Rules>,
        sectors: [] as Array<Sector>,
        statuses: [] as Array<Status>,
        tags: [] as Array<Tag>,
        classifications: [] as Array<Classification>,
        federalRegisterPublications: [] as Array<FederalRegisterPublication>,
        filingTypes: [] as Array<FilingType>,
        alertTypes: [] as Array<AlertType>
    }),
    getters: {
        getFindAndReplace: (state) => state.findAndReplace,
        getAgencies: (state) => state.agencies,
        getRules: (state) => state.rules,
        getSectors: (state) => state.sectors,
        getStatuses: (state) => state.statuses,
        getTags: (state) => state.tags,
        getClassifications: (state) => state.classifications,
        getFederalRegisterPublications: (state) => state.federalRegisterPublications,
        getFilingTypes: (state) => state.filingTypes,
        getAlertTypes: (state) => state.alertTypes,
    },
    actions: {
        setFindAndReplace(payload: Array<FindAndReplace>) {
            this.findAndReplace = payload;
        },

        setAgencies(payload: Array<Agency>) {
            this.agencies = payload;
        },

        setRules(payload: Array<Rules>) {
            const add_flag = payload.map((v, k) => {
                v.applyFlag = false
                return v
            })
            this.rules = add_flag;
            this.allRules = [...add_flag];
        },

        filterRules(filter: string) {
            this.rules = this.allRules.filter(rule => rule?.rule_name?.toLowerCase().includes(filter?.toLowerCase()));
        },

        resetFilterRules(filter: string) {
            this.rules = [...this.allRules];
        },

        setSectors(payload: Array<Sector>) {
            this.sectors = payload;
        },

        setStatuses(payload: Array<Status>) {
            this.statuses = payload;
        },

        setTags(payload: Array<Tag>) {
            this.tags = payload;
        },

        setClassifications(payload: Array<Classification>) {
            this.classifications = payload;
        },

        SetFederalRegisterPublications(payload: Array<FederalRegisterPublication>) {
            this.federalRegisterPublications = payload;
        },

        setFilingTypes(payload: Array<FilingType>) {
            this.filingTypes = payload;
        },

        setAlertTypes(payload: Array<AlertType>) {
            this.alertTypes = payload;
        },

        updateAgency(payload: Agency) {
            const itemIndex = this.agencies.findIndex(x => x.id === payload.id);
            this.agencies[itemIndex].name = payload.name;
        },

        updateRuleFlag(payload: any) {
            const itemIndex = this.rules.findIndex(x => x.id === payload.id);
            this.rules[itemIndex].applyFlag = payload.flag;

            const itemIndexAll = this.allRules.findIndex(x => x.id === payload.id);
            this.allRules[itemIndexAll].applyFlag = payload.flag;
        },

        updateSectors(payload: Sector) {
            const itemIndex = this.sectors.findIndex(x => x.id === payload.id);
            this.sectors[itemIndex].name = payload.name;
        },

        updateStatuses(payload: Status) {
            const itemIndex = this.statuses.findIndex(x => x.id === payload.id);
            this.statuses[itemIndex].name = payload.name;
        },

        updateTags(payload: Tag) {
            const itemIndex = this.tags.findIndex(x => x.id === payload.id);
            this.tags[itemIndex].name = payload.name;
        },

        updateClassifications(payload: Classification) {
            const itemIndex = this.classifications.findIndex(x => x.id === payload.id);
            this.classifications[itemIndex].name = payload.name;
        },

        updateFederalRegisterClassifications(payload: FederalRegisterPublication) {
            const itemIndex = this.federalRegisterPublications.findIndex(x => x.id === payload.id);
            this.federalRegisterPublications[itemIndex].name = payload.name;
        },

        updateFilingTypes(payload: FilingType) {
            const itemIndex = this.filingTypes.findIndex(x => x.id === payload.id);
            this.filingTypes[itemIndex].name = payload.name;
        },

        updateAlertTypes(payload: AlertType) {
            const itemIndex = this.alertTypes.findIndex(x => x.id === payload.id);
            this.alertTypes[itemIndex].name = payload.name;
        },

        updateFindAndReplaceKeywords(payload: FindAndReplace) {
            const itemIndex = this.findAndReplace.findIndex(x => x.id === payload.id);
            this.findAndReplace[itemIndex].find_keyword = payload.find_keyword;
            this.findAndReplace[itemIndex].replace_keyword = payload.replace_keyword;
        },

        removeFindAndReplaceKeywords(payload: FindAndReplace) {
            const itemIndex = this.findAndReplace.findIndex(x => x.id === payload.id);
            this.findAndReplace.splice(itemIndex, 1);
        },

        addFindAndReplaceKeywords(payload: FindAndReplace) {
            this.findAndReplace = [...this.findAndReplace, payload];
        },

        AddToModel(payload: NewModelResponse) {
            switch (payload.model) {
                case ModelTypes.agency:
                    this.agencies = [...this.agencies, {
                        id: payload.id,
                        name: payload.name
                    } as Agency];
                    break;
                case ModelTypes.status:
                    this.statuses = [...this.statuses, {
                        id: payload.id,
                        name: payload.name
                    } as Status];
                    break;
                case ModelTypes.alert_type:
                    this.alertTypes = [...this.alertTypes, {
                        id: payload.id,
                        name: payload.name
                    } as AlertType];
                    break;
                case ModelTypes.classification:
                    this.classifications = [...this.classifications, {
                        id: payload.id,
                        name: payload.name
                    } as Classification];
                    break;
                case ModelTypes.federal_register_publication:
                    this.federalRegisterPublications = [...this.federalRegisterPublications, {
                        id: payload.id,
                        name: payload.name
                    } as FederalRegisterPublication];
                    break;
                case ModelTypes.filing_type:
                    this.filingTypes = [...this.filingTypes, {
                        id: payload.id,
                        name: payload.name
                    } as FilingType];
                    break;
                case ModelTypes.sector:
                    this.sectors = [...this.sectors, {
                        id: payload.id,
                        name: payload.name
                    } as Sector];
                    break;
                case ModelTypes.tag:
                    this.tags = [...this.tags, {
                        id: payload.id,
                        name: payload.name
                    } as Tag];
                    break;
                default:
                    break;
            }
        },

        fetchFindAndReplace() {
            axios.get('/articles/all-keywords/', { withCredentials: true })
                .then(response => {
                    this.setFindAndReplace(response.data.all_keywords);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all find and replace keywords! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllAgencies() {
            axios.get('/articles/all-agencies/', { withCredentials: true })
                .then(response => {
                    this.setAgencies(response.data.all_agencies);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all agencies! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllRules() {
            axios.get('/collections/get-user-rules?type=all', { withCredentials: true })
                .then(response => {
                    this.setRules(response.data.rules);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all rules! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllSectors() {
            axios.get('/articles/all-sectors/', { withCredentials: true })
                .then(response => {
                    this.setSectors(response.data.all_sectors);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all sectors! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllStatuses() {
            axios.get('/articles/all-statuses/', { withCredentials: true })
                .then(response => {
                    this.setStatuses(response.data.all_statuses);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all statuses! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllTags() {
            axios.get('/articles/all-tags/', { withCredentials: true })
                .then(response => {
                    this.setTags(response.data.all_tags);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all tags! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllClassifications() {
            axios.get('/articles/all-classifications/', { withCredentials: true })
                .then(response => {
                    this.setClassifications(response.data.all_classifications);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all classifications! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllFederalRegisterPublications() {
            axios.get('/articles/all-federal-register-publications/', { withCredentials: true })
                .then(response => {
                    this.SetFederalRegisterPublications(response.data.all_federal_register_publications);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all federal register publications! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllFilingTypes() {
            axios.get('/articles/all-filing-types/', { withCredentials: true })
                .then(response => {
                    this.setFilingTypes(response.data.all_filing_types);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all filing types! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        fetchAllAlertTypes() {
            axios.get('/articles/all-alert-types/', { withCredentials: true })
                .then(response => {
                    this.setAlertTypes(response.data.all_alert_types);
                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error fetching all alert types! Please refresh and try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        deleteModel() {
            /* TODO: Be careful with this as deleting a model
            when linked to an Article can cause the articles to also cascade
            * */
        },

        updateModel(payload: UpdateModel) {
            axios.post('/articles/all-data/update/', {
                id: payload.id,
                type: RequestType.update,
                name: payload.name,
                model: payload.model
            }).then(response => {

                // Determine the Table user
                let modelsTable: TableOptions | null = null;

                if (payload.model === ModelTypes.agency) {
                    const agencyData: Agency = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateAgency(agencyData);
                    modelsTable = TableOptions.AGENCY;
                }

                if (payload.model === ModelTypes.alert_type) {
                    const itemData: AlertType = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateAlertTypes(itemData);
                    modelsTable = TableOptions.ALERT_TYPE;
                }

                if (payload.model === ModelTypes.classification) {
                    const itemData: Classification = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateClassifications(itemData);
                    modelsTable = TableOptions.CLASSIFICATION;
                }

                if (payload.model === ModelTypes.federal_register_publication) {
                    const itemData: FederalRegisterPublication = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateFederalRegisterClassifications(itemData);
                    modelsTable = TableOptions.FEDERAL_REGISTER;
                }

                if (payload.model === ModelTypes.filing_type) {
                    const itemData: FilingType = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateFilingTypes(itemData);
                    modelsTable = TableOptions.FILING_TYPE;
                }

                if (payload.model === ModelTypes.sector) {
                    const itemData: Sector = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateSectors(itemData);
                    modelsTable = TableOptions.SECTOR;
                }

                if (payload.model === ModelTypes.status) {
                    const itemData: Status = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateStatuses(itemData);
                    modelsTable = TableOptions.STATUS;
                }

                if (payload.model === ModelTypes.tag) {
                    const itemData: Tag = {
                        id: payload.id,
                        name: payload.name
                    }
                    this.updateTags(itemData);
                    modelsTable = TableOptions.TAG;
                }

                if (!modelsTable) return;

                LogChanges(LoggingAction.UPDATED, modelsTable, payload.id);

            }).catch(err => {
                const notification: Notification = {
                    message: 'There was an error updating the model! Please try again.',
                    type: 'danger'
                }
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
            })
        },

        // Update items on the backend and replace in the state
        updateFindAndReplaceKeyword(payload: FindAndReplaceRequest) {
            axios.post('/articles/all-keywords/', {
                id: payload.id,
                find_keyword: payload.find_keyword,
                replace_keyword: payload.replace_keyword,
                method_type: payload.method_type
            }, { withCredentials: true })
                .then(response => {
                    if (payload.method_type === FindAndReplaceMethodType.delete) {
                        this.removeFindAndReplaceKeywords(payload);
                        LogChanges(LoggingAction.DELETED, TableOptions.FIND_AND_REPLACE, payload.id);
                    }

                    if (payload.method_type === FindAndReplaceMethodType.update) {
                        this.updateFindAndReplaceKeywords(payload);
                        LogChanges(LoggingAction.UPDATED, TableOptions.FIND_AND_REPLACE, payload.id);
                    }

                    if (response.data.id) {
                        const newItem: FindAndReplace = {
                            id: response.data.id,
                            find_keyword: payload.find_keyword,
                            replace_keyword: payload.replace_keyword
                        }
                        this.addFindAndReplaceKeywords(newItem);
                        LogChanges(LoggingAction.CREATED, TableOptions.FIND_AND_REPLACE, response.data.id);
                    }

                })
                .catch(() => {
                    const notification: Notification = {
                        message: 'There was an error updating the find and replace keyword! Please try again.',
                        type: 'danger'
                    }
                    const notificationStore = useNotificationStore();
                    notificationStore.addNotification(notification);
                });
        },

        addNewModel(payload: NewModelResponse) {
            this.AddToModel(payload);
        },

        addRulesData(payload: any) {
            this.updateRuleFlag(payload);
        }

    }

})

