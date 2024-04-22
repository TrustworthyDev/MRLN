<template>
  <div class="bulk-actions-bar">

    <button :disabled="getSelectedArticlesId <= 0" class="btn btn-link btn-sm text-decoration-none fw-bold text-primary"
      @click="bulkUpdateArticles">
      Find & Replace
    </button>

    <actions-dropdown :keyword="modelType.agency" :many="true" :required="true">
      Agencies
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.sector" :many="false" :required="true">
      Sectors
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.status" :many="false" :required="true">
      Statuses
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.tag" :many="true" :required="false">
      Tags
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.classification" :many="false" :required="true">
      Classifications
    </actions-dropdown>

    <!--  TODO: Federal Register Publication may be required in the database right now. Will come back to this.  -->
    <actions-dropdown :keyword="modelType.federal_register_publication" :many="false" :required="false">
      FRP
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.filing_type" :many="false" :required="true">
      Filing Types
    </actions-dropdown>

    <actions-dropdown :keyword="modelType.alert_type" :many="false" :required="true">
      Alert Types
    </actions-dropdown>

    <assign-articles />

  </div>
</template>

<script>
import { useArticleStore } from "@/stores/articles";
import ActionsDropdown from "@/components/articles/bulk-actions-bar/ActionsDropdown.vue";
import { ModelTypes } from "@/types/ModelTypes";
import AssignArticles from "@/components/articles/bulk-actions-bar/AssignArticles.vue";

export default {
  name: "BulkActionsBar",

  components: {
    AssignArticles,
    ActionsDropdown
  },

  computed: {
    getSelectedArticlesId() {
      const articleStore = useArticleStore();
      return articleStore.getSelectedArticlesId;
    },
  },

  data() {
    return {
      modelType: ModelTypes
    }
  },

  methods: {

    assignEditorArticles(payload) { 
      const articleStore = useArticleStore();
      articleStore.massUpdateArticles(payload);
    },


    bulkUpdateArticles() {
      if (this.getSelectedArticlesId.length <= 0) return;

      const allArticleIds = [...this.getSelectedArticlesId];
      this.massUpdateArticles(allArticleIds);
    }
  }


}
</script>

<style lang="scss" scoped>
.bulk-actions-bar {
  width: 100%;
  background: white;
  box-shadow: 2px 3px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;

}
</style>
