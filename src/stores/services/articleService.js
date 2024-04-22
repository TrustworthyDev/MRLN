import axios from "@/axios";
import { useArticleStore } from '@/stores/articles';
import { useSearchFilterStore } from '@/stores/searchFilters';



export const articleService = {
    getArticles,
    getArticlesByFilters,
    getAllStatesAgenciesAndAlertTypes,
    updateCountForCollection
}


// Get's "all articles" from the API -> Will be limited
// Can limit based on a users limits for their account
function getArticles(currentToken, currentPage) {
    return axios.get(`/articles/all?page=${currentPage}`, {withCredentials: true, cancelToken: currentToken.token})
        .then(articles => {
            return articles;
        });
}


// getArticlesByFilters will get all articles by the search
// parameters provided from the state
function getArticlesByFilters(currentToken, currentPage, searchFilters, searchValue, selectedItems, filteredBy) {
    return axios.post(`/articles/filter?page=${currentPage}`, {
            searchFilters: searchFilters,
            searchValue: searchValue,
            filters: selectedItems,
            sortBy: filteredBy
        },
        {
            withCredentials: true,
            cancelToken: currentToken.token
        }
    )
}

// Update Articles Count for user collection
// parameters provided from the state
// Updates the last viewed date for a users collection
function updateCountForCollection(collection_id, count, currentToken) {
    return axios.post('/collections/update', {
            id: collection_id,
            count: count
        },
        {
            withCredentials: true,
            cancelToken: currentToken.token
        }
    )
}


// Gets all States, Agencies and Alert Types
export function getAllStatesAgenciesAndAlertTypes() {
    return axios.get('/articles/all-search-options', {
        withCredentials: true
    });
}

export function logViewedArticle(articleId) {
    return axios.post('/telemetry/viewed', {
        article_id: articleId
    }, {withCredentials: true});
}

export function logSearchHistory() {
    const searchFiltersStore = useSearchFilterStore();
    const articlesStore = useArticleStore();
    const searchValue = searchFiltersStore.getSearchValue;
    const searchFilters = searchFiltersStore.getAllFilters;
    const totalResults = articlesStore.getTotalResults;

    return axios.post('/telemetry/searched', {
        search_value: searchValue,
        search_options: searchFilters,
        total_results: totalResults
    }, {withCredentials: true});
}

// KEEP - Used for resetting the Vuex state in parts of the application
export const defaultSearchOptions = {
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
    country: [],
    agency: [],
    alertType: [],
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
