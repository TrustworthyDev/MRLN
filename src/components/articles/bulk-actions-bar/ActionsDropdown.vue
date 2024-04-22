<template>
  <div>
    <div v-if="isActive" id="actionOverlay" class="overlay" @click="event => hideOverlay(event)"></div>
    <div class="actions-dropdown">
      <button class="btn btn-link btn-sm text-decoration-none fw-bold text-primary" @click="updateDropdown">
        <slot />
      </button>

      <div v-if="isActive" class="dropdown-content">
        <v-select :multiple="this.many" :options="allKeywords" :value="currentOptions" label="name"
          @input="updateValue" />

        <div class="d-flex justify-content-center">
          <button :disabled="getSelectedArticles.length <= 0" class="btn btn-sm btn-primary w-100 mt-1 fw-bold"
            @click="updateSelectedArticles">
            Update Articles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import { ModelTypes } from "@/types/ModelTypes";
import { useArticleStore } from "@/stores/articles";
import { useKeywordStore } from "@/stores/keywords";
import { Model, UpdateArticlesWithModels } from '@/types/Article';

export default {
  name: "ActionsDropdown",
  components: {
  },

  data() {
    return {
      isActive: false,
      currentOptions: []
    }
  },

  props: {
    keyword: String,
    many: Boolean,
    required: Boolean
  },

  computed: {
    getSelectedArticles() {

      const articleStore = useArticleStore();
      return articleStore.getSelectedArticles;
    },


    allKeywords: function () {

      let currentKeywords;

      switch (this.keyword) {
        case ModelTypes.agency:
          currentKeywords = this.$store.getters['keywords/getAgencies'];
          break;
        case ModelTypes.sector:
          currentKeywords = this.$store.getters['keywords/getSectors'];
          break;
        case ModelTypes.status:
          currentKeywords = this.$store.getters['keywords/getStatuses'];
          break;
        case ModelTypes.tag:
          currentKeywords = this.$store.getters['keywords/getTags'];
          break;
        case ModelTypes.classification:
          currentKeywords = this.$store.getters['keywords/getClassifications'];
          break;
        case ModelTypes.federal_register_publication:
          currentKeywords = this.$store.getters['keywords/getFederalRegisterPublications'];
          break;
        case ModelTypes.filing_type:
          currentKeywords = this.$store.getters['keywords/getFilingTypes'];
          break;
        case ModelTypes.alert_type:
          currentKeywords = this.$store.getters['keywords/getAlertTypes'];
          break;
      }

      return currentKeywords;
    }

  },

  methods: {

    updateDropdown() {
      this.isActive = !this.isActive;
    },

    updateValue(value) {
      this.currentOptions = value;
    },

    hideOverlay(event) {
      if (event.target.id === 'actionOverlay') {
        this.isActive = false;
      }
    },

    // Bulk sets options for the selected Articles
    updateSelectedArticles() {
      // If we don't have selected Articles do nothing
      if (this.getSelectedArticles.length <= 0) return;

      // Check if the current requirements are met
      if (this.required) {
        if (this.many) {
          if (this.currentOptions.length <= 0) return;
        } else {
          if (!this.currentOptions || this.currentOptions.length <= 0) return;
        }
      }

      const finalState = {
        articles: this.getSelectedArticles,
        models: this.currentOptions,
        type: this.keyword,
        required: this.required,
        many: this.many
      }
      const articleStore = useArticleStore();
      articleStore.massUpdateWithModels(finalState);
    }

  },

  created() {
    const keyWordStore = useKeywordStore();

    switch (this.keyword) {
      case ModelTypes.agency:
        keyWordStore.fetchAllAgencies();
        break;
      case ModelTypes.sector:
        keyWordStore.fetchAllSectors();
        break;
      case ModelTypes.status:
        keyWordStore.fetchAllStatuses();
        break;
      case ModelTypes.tag:
        keyWordStore.fetchAllTags();
        break;
      case ModelTypes.classification:
        keyWordStore.fetchAllClassifications();
        break;
      case ModelTypes.federal_register_publication:
        keyWordStore.fetchAllFederalRegisterPublications();
        break;
      case ModelTypes.filing_type:
        keyWordStore.fetchAllFilingTypes();
        break;
      case ModelTypes.alert_type:
        keyWordStore.fetchAllAlertTypes();
        break;
      default:
        break;
    }

  }

}
</script>

<style lang="scss" scoped>
.articles-dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  z-index: 3;
  width: 240px;
  margin-top: 2px;
  margin-left: 10px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #e9e9e9;
  box-shadow: 3px 5px 12px rgba(0, 0, 0, 0.2);
  padding: 5px 5px;
}

.dropdown-container {
  padding: .3rem .4rem;
}

.dropdown-results {
  max-height: 120px;
  min-height: 120px;
  overflow-y: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
