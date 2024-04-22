<template>
  <div class="container-fluid mt-5 custom-container">
    <bulk-actions-bar />
    <div class="custom-table-container">
      <div class="custom-table-length">

        <div v-if="getCurrentArticles.length <= 0" class="my-3 text-center">
          <p>You don't have any assigned articles...</p>
        </div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>
                <input :checked="isSelectingAllArticles" class="form-check-input" type="checkbox"
                  @click="toggleAllArticles">
              </th>
              <th>Edit</th>
              <th>Sector</th>
              <th>Title</th>
              <th>Summary</th>
              <th>Agency</th>
              <th>Status</th>
              <th>Classification</th>
              <th>Alert</th>
              <th>RegAlytics Alert ID</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="article in getCurrentArticles" :key="article.id">
              <all-articles-table-row  :article="article" />
              <all-articles-table-edit-row :articleRow="article" />
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import BulkActionsBar from "@/components/articles/bulk-actions-bar/BulkActionsBar";
import AllArticlesTableRow from "@/components/articles/all-articles-table/all-articles-table-row/AllArticlesTableRow";
import AllArticlesTableEditRow from "@/components/articles/all-articles-table/all-articles-table-edit-row/AllArticlesTableEditRow";
import { useArticleStore } from "@/stores/articles";

export default {
  name: "AssignedArticles",
  components: { AllArticlesTableEditRow, AllArticlesTableRow, BulkActionsBar },

  computed: {
    isSelectingAllArticles() {
      const articleStore = useArticleStore();
      return articleStore.isSelectingAllArticles;
    }, 
    
    getCurrentArticles() {
      const articleStore = useArticleStore();
      return articleStore.getCurrentArticles;
    }, 
    
  },

  methods: {
    getAssignedArticles() { 
      const articleStore = useArticleStore();
      articleStore.getAssignedArticles();
    },

    toggleAllArticles() {
      if (this.isSelectingAllArticles) {
        this.$store.dispatch('articles/deselectAllArticles');
      } else {
        this.$store.dispatch('articles/selectAllArticles');
      }
    }

  },

  created() {
    this.getAssignedArticles();
  }

}
</script>

<style lang="scss" scoped>
.custom-table-container {
  overflow-x: auto;
  padding: 10px 15px;
}

.custom-table-length {
  width: 1600px;
  background-color: white;
  box-shadow: 2px 5px 12px rgba(0, 0, 0, 0.2);
  height: 80vh;
  overflow-y: auto;
}

.article-navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 0.8rem .8rem;
  margin-bottom: 20px;
}

.col-cel {
  position: relative;
}

.resize-div {
  position: absolute;
  width: 5px;
  top: 0;
  right: 0;
  bottom: 0;
  cursor: col-resize;
  background-color: red;
  height: 100%;
  user-select: none;
}

.fit-content {
  width: 200px;
}

.custom-table {
  width: 1000px !important;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 1px solid #cdcdcd;
  border-radius: 3px;
  cursor: pointer;
}

.custom-checkbox--selected {
  background-color: rgba(44, 150, 255, 0.7);
}

.custom-container {
  display: block;
  position: relative;
  z-index: 5;
}
</style>
