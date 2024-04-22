<template>
  <tr v-if="articleRow.id === getCurrentArticle.id && getIsEditing" class="dropdown-row">
    <td colspan="10">

      <div>

        <div class="d-flex">
          <div class="me-4" style="width: 250px;">
            <label for="title">Title: </label>
            <input id="title" :value="getCurrentArticle.title" class="form-control" type="text" @change="setTitle">
          </div>

          <div class="me-4" style="width: 250px;">
            <label for="url">URL: </label>
            <input id="url" :value="getCurrentArticle.url" class="form-control" required type="url" @change="setURL">
          </div>

          <div class="me-4" style="width: 250px;">
            <label for="status">Status: </label>
            <v-select id="status" :clearable="false" :options="getStatuses" :value="getCurrentArticle.status.name"
              label="name" @input="updateStatus" />
          </div>

        </div>

        <div class="d-flex mt-3">
          <div class="me-4" style="width: 250px;">
            <label for="sector">Sector: </label>
            <v-select id="sector" :clearable="false" :options="getSectors" :value="getCurrentArticle.sector.name"
              label="name" @input="updateSectors" />
          </div>

          <div class="me-4" style="width: 250px;">
            <label for="alertType">Alert Type: </label>
            <v-select id="alertType" :clearable="false" :options="getAlertTypes"
              :value="getCurrentArticle.alert_type.name" label="name" @input="updateAlertTypes" />
          </div>

          <div class="me-4" style="width: 250px;">
            <label for="filingType">Filing Type: </label>
            <v-select id="filingType" :clearable="false" :options="getFilingTypes"
              :value="getCurrentArticle.filing_type.name" label="name" @input="updateFilingTypes" />
          </div>

          <div class="me-4" style="width: 250px;">
            <label for="classification">Classification</label>
            <v-select id="classification" :clearable="false" :options="getClassifications"
              :value="getCurrentArticle.classification.name" label="name" @input="updateClassifications" />
          </div>
        </div>

        <div class="mb-3 mt-3" style="max-width: 700px;">
          <label for="summary">Summary: </label>
          <textarea id="summary" :value="getCurrentArticle.summary" class="form-control"
            @change="setSummary"></textarea>
        </div>

        <div class="mb-3" style="max-width: 500px;">
          <label for="agency">Agency: </label>
          <v-select id="agency" :options="getAgencies" :value="getCurrentArticle.agency" label="name" multiple
            @input="updateAgencies" />
        </div>

        <div class="mb-3" style="max-width: 300px;">
          <label for="latestUpdate">Latest Update: </label>
          <input id="latestUpdate" :value="getCurrentArticle.latest_update" class="form-control" type="date"
            @change="setLatestUpdate">
        </div>

        <p class="fw-bold">To-do the rest of the items</p>

        <button class="btn btn-primary btn-sm me-3" style="width: 200px;" @click="updateArticle">Save</button>

        <button v-if="getCurrentUser.role === userRoles.EDITOR" class="btn btn-dark btn-sm" style="width: 200px;"
          @click="markAsCompleted">
          Mark as Completed
        </button>
      </div>


    </td>
  </tr>
</template>

<script>
import { useAccountStore } from "@/stores/account";
import { useEditArticleStore } from "@/stores/editArticle";
import { useKeywordStore } from "@/stores/keywords";
import { UserRoles } from "@/types/User";

export default {
  name: "AllArticlesTableEditRow",

  props: {
    articleRow: Object
  },

  data() {
    return {
      userRoles: UserRoles
    }
  },

  computed: {
    getCurrentUser() {
      const accountStore = useAccountStore();
      return accountStore.getCurrentUser;
    }, 
    
    getIsEditing() {
      const editArticleStore = useEditArticleStore();
      return editArticleStore.getIsEditing;
    },
    
    getCurrentArticle() {
      const editArticleStore = useEditArticleStore();
      return editArticleStore.getCurrentArticle;
    },
    
    getAgencies() {
      const keywordStore = useKeywordStore();
      return keywordStore.getAgencies;
    },
    
    getAlertTypes() {
      const keywordStore = useKeywordStore();
      return keywordStore.getAlertTypes;
    },
    
    getFilingTypes() {
      const keywordStore = useKeywordStore();
      return keywordStore.getFilingTypes;
    },
    
    getClassifications() {
      const keywordStore = useKeywordStore();
      return keywordStore.getClassifications;
    },
    
    getStatuses() {
      const keywordStore = useKeywordStore();
      return keywordStore.getStatuses;
    },
    
    getSectors() {
      const keywordStore = useKeywordStore();
      return keywordStore.getSectors;
    },
  },

  methods: {
    hideEditingPage() { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.hideEditingPage();
    },
    
    addAgencies(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addAgencies(payload);
    },
    
    addAlertTypes(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addAlertTypes(payload);
    },
    
    addFilingTypes(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addFilingTypes(payload);
    },
    
    addClassifications(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addClassifications(payload);
    },
    
    addStatus(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addStatus(payload);
    },
    
    addSector(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.addSector(payload);
    },
    
    updateTitle(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.updateTitle(payload);
    },
    
    updateSummary(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.updateSummary(payload);
    },
    
    updateURL(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.updateUrl(payload);
    },
    
    updateLatestUpdate(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.updateLatestUpdate(payload);
    },
    
    saveChanges(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.saveChanges(payload);
    },
    
    removeAssignedArticle(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.removeAssignedArticle(payload);
    },
    
    fetchAllAgencies() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllAgencies();
    },
    
    fetchAllAlertTypes() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllAlertTypes();
    },
    
    fetchAllFilingTypes() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllFilingTypes();
    },
    
    fetchAllClassifications() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllClassifications();
    },
    
    fetchAllStatuses() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllStatuses();
    },
    
    fetchAllSectors() { 
      const keywordStore = useKeywordStore();
      keywordStore.fetchAllSectors();
    },


    setTitle(value) {
      this.updateTitle(value.target.value);
    },

    setSummary(value) {
      this.updateSummary(value.target.value);
    },

    setURL(value) {
      this.updateURL(value.target.value);
    },

    updateAgencies(value) {
      this.addAgencies(value);
    },

    updateAlertTypes(value) {
      this.addAlertTypes(value);
    },

    updateFilingTypes(value) {
      this.addFilingTypes(value);
    },

    updateClassifications(value) {
      this.addClassifications(value);
    },

    updateStatus(value) {
      this.addStatus(value);
    },

    updateSectors(value) {
      this.addSector(value);
    },

    setLatestUpdate(value) {
      this.updateLatestUpdate(value.target.value);
    },

    updateArticle() {
      this.saveChanges(this.getCurrentArticle);
    },

    markAsCompleted() {
      this.removeAssignedArticle(this.getCurrentArticle);
    }

  },


}
</script>

<style lang="scss" scoped>
.dropdown-row {
  background-color: white !important;
  height: 300px;

  &:hover {
    background-color: white !important;
  }
}
</style>
