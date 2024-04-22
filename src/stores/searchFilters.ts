import { articleService, getAllStatesAgenciesAndAlertTypes } from "@/stores/services/articleService";
// import { findAllSelectedItems } from "@/helpers/filtersHelper";
import { trackingHelper } from "@/main";
import axiosMain from "@/axios";

import { defineStore } from 'pinia'

export const useSearchFilterStore = defineStore({
    id: 'searchFilter',
    state: () => (
        {
            searchValue: '',
            currentFilters: {

                status: {
                    new: false,
                    updated: false
                },

                classification: {
                    sro: false,
                    federal: false,
                    state: false,
                    territory: false
                },

                filingType: {
                    single: false,
                    joint: false
                },

                inFederalRegister: {
                    yes: false,
                    not_yet: false,
                    not_expected: false
                },

                regAlyticsAlertId: '',
                federalRegisterNumber: '',

                // Will use an array for Region, Agency & Alert Type
                // as a user can search with multiple different values
                state: [],
                agency: [],
                country: [],
                alertType: [],

                // Includes and excludes keywords for filtering articles
                includes: [],
                orIncludes: [],
                excludes: [],

                // Date searching for our filters
                // All have a starting-to date
                latestUpdate: {
                    start: null,
                    end: null
                },

                originallyPublished: {
                    start: null,
                    end: null
                },

                proposedCommentsDue: {
                    start: null,
                    end: null
                },

                ruleEffective: {
                    start: null,
                    end: null
                },

                publishedInFederalReserve: {
                    start: null,
                    end: null
                }

            }
        }),

    getters: {
        getSearchValue: (state) => state.searchValue,
        getAllFilters: (state) => state.currentFilters,
    },
    actions: {

    }
})







// Following will be converted to Pinia as required. Copied it from regalytics as Mrln was missing this file

// // Creates the filters for searching
// // This will also pull in all the data we require from our searches
// export const searchFilters = {
//     namespaced: true,

//     state: {
//         results: {},
//         showingModal: false,

//         loading: false,

//         // Value of the search string
//         searchValue: '',
//         savedSearchName: '',
//         currentRequest: null,

//         // Options for the States, Agencies and Alert Types input fields
//         allStates: [],
//         allCountries: [],
//         allAgencies: [],
//         allAlertTypes: [],

//         // Creates the current base filters
//         // This will be used for sending to the backend
//         currentFilters: {

//             status: {
//                 new: false,
//                 updated: false
//             },

//             classification: {
//                 sro: false,
//                 federal: false,
//                 state: false,
//                 territory: false
//             },

//             filingType: {
//                 single: false,
//                 joint: false
//             },

//             inFederalRegister: {
//                 yes: false,
//                 not_yet: false,
//                 not_expected: false
//             },

//             regAlyticsAlertId: '',
//             federalRegisterNumber: '',

//             // Will use an array for Region, Agency & Alert Type
//             // as a user can search with multiple different values
//             state: [],
//             agency: [],
//             country: [],
//             alertType: [],

//             // Includes and excludes keywords for filtering articles
//             includes: [],
//             orIncludes: [],
//             excludes: [],

//             // Date searching for our filters
//             // All have a starting-to date
//             latestUpdate: {
//                 start: null,
//                 end: null
//             },

//             originallyPublished: {
//                 start: null,
//                 end: null
//             },

//             proposedCommentsDue: {
//                 start: null,
//                 end: null
//             },

//             ruleEffective: {
//                 start: null,
//                 end: null
//             },

//             publishedInFederalReserve: {
//                 start: null,
//                 end: null
//             }

//         }
//     },

//     // Used to get the current state of items from the Vuex store
//     getters: {

//         getSearchValue: state => {
//             return state.searchValue;
//         },

//         getCurrentSearchOptions: state => {
//             return state.currentFilters;
//         },

//         getSavedSearchName: state => {
//             return state.savedSearchName;
//         },

//         getShowingModal: state => {
//             return state.showingModal;
//         },

//         getStatus: state => {
//             return state.currentFilters.status;
//         },

//         getClassifications: state => {
//             return state.currentFilters.classification;
//         },

//         getFilingType: state => {
//             return state.currentFilters.filingType;
//         },

//         getFederalRegister: state => {
//             return state.currentFilters.inFederalRegister;
//         },

//         getRegAlyticsAlertId: state => {
//             return state.currentFilters.regAlyticsAlertId;
//         },

//         getFederalRegisterNumber: state => {
//             return state.currentFilters.federalRegisterNumber;
//         },

//         getLatestUpdate: state => {
//             return state.currentFilters.latestUpdate;
//         },

//         getOriginallyPublished: state => {
//             return state.currentFilters.originallyPublished;
//         },

//         getProposedCommentsDue: state => {
//             return state.currentFilters.proposedCommentsDue;
//         },

//         getRuleEffective: state => {
//             return state.currentFilters.ruleEffective;
//         },

//         // This is a date object just like the others before
//         getPublishedInFederalReserve: state => {
//             return state.currentFilters.publishedInFederalReserve;
//         },

//         getStateTags: state => {
//             return state.currentFilters.state;
//         },

//         getCountryTags: state => {
//             return state.currentFilters.country;
//         },

//         getAgencyTags: state => {
//             return state.currentFilters.agency;
//         },

//         getAlertTypeTags: state => {
//             return state.currentFilters.alertType;
//         },

//         // Returns all results
//         getCurrentResults: state => {
//             return state.results;
//         },

//         // Returns ALL filters
//         getAllFilters: state => {
//             return state.currentFilters;
//         },

//         getAllStates: state => {
//             return state.allStates;
//         },

//         getAllCountries: state => {
//             return state.allCountries;
//         },

//         getAllAgencies: state => {
//             return state.allAgencies;
//         },

//         getAllAlertTypes: state => {
//             return state.allAlertTypes;
//         },

//         getAllIncludeKeywords: state => {
//             return state.currentFilters.includes;
//         },

//         getAllOrIncludeKeywords: state => {
//             return state.currentFilters.orIncludes;
//         },

//         getAllExcludesKeywords: state => {
//             return state.currentFilters.excludes;
//         }

//     },

//     mutations: {
//         // Updates the searchValue with the new result
//         SET_SEARCH_VALUE(state, payload) {
//             state.searchValue = payload;
//         },

//         SET_SAVED_SEARCH_NAME(state, payload) {
//           state.savedSearchName = payload;
//         },

//         // Updates if the search modal state
//         SET_MODAL_SHOWING(state, payload) {
//             state.showingModal = payload
//         },

//         // Updates the status values with the new boolean values
//         SET_STATUS_VALUES(state, payload) {
//             state.currentFilters.status.new = payload.new;
//             state.currentFilters.status.updated = payload.updated;
//         },

//         // Updates the classifications values with the new boolean values
//         SET_CLASSIFICATION_VALUES(state, payload) {
//             state.currentFilters.classification.sro = payload.sro;
//             state.currentFilters.classification.federal = payload.federal;
//             state.currentFilters.classification.state = payload.state;
//             state.currentFilters.classification.territory = payload.territory;
//         },

//         // Updates the filing type values with the new boolean values
//         SET_FILING_TYPE_VALUES(state, payload) {
//             state.currentFilters.filingType.single = payload.single;
//             state.currentFilters.filingType.joint = payload.joint;
//         },

//         // Updates the in federal register values with the new boolean values
//         SET_FEDERAL_REGISTER_VALUES(state, payload) {
//             state.currentFilters.inFederalRegister.yes = payload.yes;
//             state.currentFilters.inFederalRegister.not_yet = payload.not_yet;
//             state.currentFilters.inFederalRegister.not_expected = payload.not_expected;
//         },

//         // Sets the RegAlytics alert ID
//         SET_REGALYTICS_ALERT_ID(state, payload) {
//             state.currentFilters.regAlyticsAlertId = payload;
//         },

//         // Sets the Federal Register Number ID
//         SET_FEDERAL_REGISTER_NUMBER(state, payload) {
//             state.currentFilters.federalRegisterNumber = payload;
//         },

//         // Sets the starting date for Latest Update
//         SET_STARTING_DATE_LATEST_UPDATE(state, payload) {
//             state.currentFilters.latestUpdate.start = payload;
//         },

//         // Sets the ending date for Latest Update
//         SET_ENDING_DATE_LATEST_UPDATE(state, payload) {
//             state.currentFilters.latestUpdate.end = payload;
//         },

//         // Sets the starting date for Originally Published
//         SET_STARTING_DATE_ORIGINALLY_PUBLISHED(state, payload) {
//             state.currentFilters.originallyPublished.start = payload;
//         },

//         // Sets the ending date for Originally Published
//         SET_ENDING_DATE_ORIGINALLY_PUBLISHED(state, payload) {
//             state.currentFilters.originallyPublished.end = payload;
//         },

//         // Sets the starting date for Proposed Comments Due
//         SET_STARTING_DATE_PROPOSED_COMMENTS_DUE(state, payload) {
//             state.currentFilters.proposedCommentsDue.start = payload;
//         },

//         // Sets the ending date for Proposed Comments Due
//         SET_ENDING_DATE_PROPOSED_COMMENTS_DUE(state, payload) {
//             state.currentFilters.proposedCommentsDue.end = payload;
//         },

//         // Sets the starting date for Rule Effective
//         SET_STARTING_DATE_RULE_EFFECTIVE(state, payload) {
//             state.currentFilters.ruleEffective.start = payload;
//         },

//         // Sets the ending date for Rule Effective
//         SET_ENDING_DATE_RULE_EFFECTIVE(state, payload) {
//             state.currentFilters.ruleEffective.end = payload;
//         },

//         // Sets the starting date for Published in Federal Reserve
//         SET_STARTING_DATE_PUBLISHED_IN_FEDERAL_RESERVE(state, payload) {
//             state.currentFilters.publishedInFederalReserve.start = payload;
//         },

//         // Sets the ending date for Published in Federal Reserve
//         SET_ENDING_DATE_PUBLISHED_IN_FEDERAL_RESERVE(state, payload) {
//             state.currentFilters.publishedInFederalReserve.end = payload;
//         },

//         // Adds items to the Regions
//         ADD_ITEM_TO_STATES(state, payload) {
//             state.currentFilters.state = payload;
//         },

//         ADD_ITEM_TO_COUNTRIES(state, payload) {
//             state.currentFilters.country = payload;
//         },

//         // Adds items to the Agency
//         ADD_ITEM_TO_AGENCIES(state, payload) {
//             state.currentFilters.agency = payload;
//         },

//         // Adds items to Alert Type
//         ADD_ITEM_TO_ALERT_TYPES(state, payload) {
//             state.currentFilters.alertType = payload;
//         },

//         // Sets the results
//         SET_SEARCH_RESULTS(state, payload) {
//             state.results = payload;
//         },

//         SET_LOADING_STATUS(state, payload) {
//             state.loading = payload;
//         },

//         RESET_SEARCH_FILTERS(state, payload) {
//             state.currentFilters = payload;
//             state.searchValue = '';
//         },

//         SET_ALL_SEARCH_OPTIONS_VIA_BLOB(state, payload) {
//             state.currentFilters = payload;
//         },

//         SET_ALL_STATES(state, payload) {
//             state.allStates = payload;
//         },

//         SET_ALL_COUNTRIES(state, payload) {
//             state.allCountries = payload;
//         },

//         SET_ALL_AGENCIES(state, payload) {
//             state.allAgencies = payload;
//         },

//         SET_ALL_ALERT_TYPES(state, payload) {
//             state.allAlertTypes = payload;
//         },

//         SET_INCLUDE_KEYWORDS(state, payload) {
//             state.currentFilters.includes = payload;
//         },

//         SET_OR_INCLUDE_KEYWORDS(state, payload) {
//             state.currentFilters.orIncludes = payload;
//         },

//         SET_EXCLUDE_KEYWORDS(state, payload) {
//             state.currentFilters.excludes = payload;
//         },

//         SET_CURRENT_REQUEST(state, payload) {
//             state.currentRequest = payload;
//         },

//     },

//     actions: {

//         // Used for updating all search options
//         // Typically used for setting parameters from the URI
//         updateAllSearchOptions({commit}, value) {
//             commit('SET_ALL_SEARCH_OPTIONS_VIA_BLOB', value);
//         },

//         setSavedSearchName({commit}, value) {
//             commit('SET_SAVED_SEARCH_NAME', value);
//         },

//         updateModalShowingState({commit}, value) {
//             commit('SET_MODAL_SHOWING', value)
//         },

//         // Updates the searchValue with the new result
//         updateSearchValue({commit}, value) {
//             commit('SET_SEARCH_VALUE', value);
//         },

//         // Updates the status values with the new boolean values
//         updateStatusValues({commit}, value) {
//             commit('SET_STATUS_VALUES', value);
//         },

//         // Updates the classifications values with the new boolean values
//         updateClassificationValues({commit}, value) {
//             commit('SET_CLASSIFICATION_VALUES', value);
//         },

//         // Updates the filing types values with the new boolean values
//         updateFilingTypeValues({commit}, value) {
//             commit('SET_FILING_TYPE_VALUES', value);
//         },

//         // Updates the filing types values with the new boolean values
//         updateInFederalRegisterValue({commit}, value) {
//             commit('SET_FEDERAL_REGISTER_VALUES', value);
//         },

//         // Updates the filing types values with the new boolean values
//         updateRegAlyticsAlertId({commit}, value) {
//             commit('SET_REGALYTICS_ALERT_ID', value);
//         },

//         // Updates the Federal Register Number with new string value
//         updateFederalRegisterNumber({commit}, value) {
//             commit('SET_FEDERAL_REGISTER_NUMBER', value);
//         },

//         // Updates the Latest Update with starting date
//         updateLatestUpdateDateStart({commit}, value) {
//             commit('SET_STARTING_DATE_LATEST_UPDATE', value);
//         },

//         // Updates the Latest Update with ending date
//         updateLatestUpdateDateEnd({commit}, value) {
//             commit('SET_ENDING_DATE_LATEST_UPDATE', value);
//         },

//         // Updates the Originally Published with starting date
//         updateOriginallyPublishedDateStart({commit}, value) {
//             commit('SET_STARTING_DATE_ORIGINALLY_PUBLISHED', value);
//         },

//         // Updates the Originally Published with ending date
//         updateOriginallyPublishedDateEnd({commit}, value) {
//             commit('SET_ENDING_DATE_ORIGINALLY_PUBLISHED', value);
//         },

//         // Updates the Proposed Comments Due with starting date
//         updateProposedCommentsDueDateStart({commit}, value) {
//             commit('SET_STARTING_DATE_PROPOSED_COMMENTS_DUE', value);
//         },

//         // Updates the Proposed Comments Due with ending date
//         updateProposedCommentsDueDateEnd({commit}, value) {
//             commit('SET_ENDING_DATE_PROPOSED_COMMENTS_DUE', value);
//         },

//         // Updates the Rule Effective with starting date
//         updateRuleEffectiveDateStart({commit}, value) {
//             commit('SET_STARTING_DATE_RULE_EFFECTIVE', value);
//         },

//         // Updates the Rule Effective with ending date
//         updateRuleEffectiveDateEnd({commit}, value) {
//             commit('SET_ENDING_DATE_RULE_EFFECTIVE', value);
//         },

//         // Updates the Rule Effective with starting date
//         updatePublishedInFederalReserveDateStart({commit}, value) {
//             commit('SET_STARTING_DATE_PUBLISHED_IN_FEDERAL_RESERVE', value);
//         },

//         // Updates the Rule Effective with ending date
//         updatePublishedInFederalReserveDateEnd({commit}, value) {
//             commit('SET_ENDING_DATE_PUBLISHED_IN_FEDERAL_RESERVE', value);
//         },

//         // Updates the States by adding a new item
//         updateStates({commit}, value) {
//             commit('ADD_ITEM_TO_STATES', value);
//         },

//         updateCountries({commit}, value) {
//             commit('ADD_ITEM_TO_COUNTRIES', value);
//         },

//         // Updates the Agency by adding a new item
//         updateAgencies({commit}, value) {
//             commit('ADD_ITEM_TO_AGENCIES', value);
//         },

//         // Updates the Alert Type by adding a new item
//         updateAlertTypes({commit}, value) {
//             commit('ADD_ITEM_TO_ALERT_TYPES', value);
//         },

//         resetSearchFilters({commit}, value) {
//             commit('RESET_SEARCH_FILTERS', value);
//         },

//         // Updates the search results
//         getSearchResults({commit, state}) {

//             // Cancels the current request if exists
//             if (state.currentRequest) {
//                 state.currentRequest.cancel();
//             }

//             // Create a token for cancelling requests
//             const cancelTokenSource = axiosMain.CancelToken.source();
//             commit('SET_CURRENT_REQUEST', cancelTokenSource);

//             // Sets loading to true
//             commit('SET_LOADING_STATUS', true);

//             store.dispatch('filters/setLoadingStatusFiltersSidebar', true);
//             store.dispatch('filters/resetAllSelectedFiltersSidebar');
//             store.dispatch('filters/setLoadingStatusFiltersSidebar', false);

//             store.dispatch('articles/updateCurrentPage', 1);
//             store.dispatch('sidebar/manuallySetSidebarState', false);
//             store.dispatch('articles/setIsFetchingArticles', true);
//             const allFiltersOnSidebar = store.getters["filters/getCurrentFilters"];
//             const allSelectedItems = findAllSelectedItems(allFiltersOnSidebar);
//             const filteredBy = store.getters['articles/getIsFilteredBy'];
//             store.dispatch('filters/getFilters');

//             return articleService.getArticlesByFilters(cancelTokenSource, 1, state.currentFilters, state.searchValue, allSelectedItems, filteredBy)
//                 .then(response => {
//                     commit('SET_CURRENT_REQUEST', null);
//                     commit('SET_SEARCH_RESULTS', response.data.results);
//                     store.dispatch('articles/setArticlesFromExternalSource', response.data.results);
//                     store.dispatch('articles/setTotalResults', response.data.count);

//                     // Tracks the performed search
//                     const currentValues = {...state.currentFilters, searchValue: state.searchValue};
//                     trackingHelper.trackEvent('searchedArticles', currentValues);

//                     commit('SET_LOADING_STATUS', false);
//                     store.dispatch('articles/setIsFetchingArticles', false);
//                     return response;
//                 })
//                 .catch(error => {
//                     commit('SET_CURRENT_REQUEST', null);
//                     console.log(error);
//                     commit('SET_LOADING_STATUS', false);
//                 })
//         },

//         // Gets all Agencies, Alert Types and States
//         getAllOptionsForAdvancedSearch({commit}) {
//             getAllStatesAgenciesAndAlertTypes()
//                 .then(response => {
//                     commit('SET_ALL_AGENCIES', response.data['all_agencies']);
//                     commit('SET_ALL_STATES', response.data['all_states']);
//                     commit('SET_ALL_ALERT_TYPES', response.data['all_alerts']);
//                     commit('SET_ALL_COUNTRIES', response.data['all_countries']);
//                 })
//         },

//         setAllStates({commit}, value) {
//             commit('SET_ALL_STATES', value);
//         },

//         setAllCountries({commit}, value) {
//             commit('SET_ALL_COUNTRIES', value);
//         },

//         setAllAgencies({commit}, value) {
//             commit('SET_ALL_AGENCIES', value);
//         },

//         setAllAlertTypes({commit}, value) {
//             commit('SET_ALL_ALERT_TYPES', value);
//         },

//         setIncludeKeywords({commit}, value) {
//             commit('SET_INCLUDE_KEYWORDS', value);
//         },

//         setOrIncludeKeywords({commit}, value) {
//             commit('SET_OR_INCLUDE_KEYWORDS', value);
//         },

//         setExcludeKeywords({commit}, value) {
//             commit('SET_EXCLUDE_KEYWORDS', value);
//         },

//     }

// }
