<template>
  <tr>
    <th>
      <input :checked="article.selected" class="form-check-input" type="checkbox"
        @input="() => selectAnArticle(article.id)">
    </th>
    <td class="text-center">
      <span class="edit-column" @click="editArticle">
        <vue-feather type="edit-2"></vue-feather>
      </span>
    </td>
    <td>{{ article.sector.name }}</td>
    <td>{{ shortenString(article.title, 10) }}</td>
    <td>{{ shortenString(article.summary, 50) }}</td>
    <td>
      {{ shortenAgencies(article.agency) }}
    </td>
    <td>{{ article.status.name }}</td>
    <td>{{ article.classification.name }}</td>
    <td>{{ article.alert_type.name }}</td>
    <td>{{ article.regalytics_alert_id }}</td>
  </tr>
</template>

<script>
import { shortenAgencies, shortenStringReturnMore } from "@/helpers/stringHelpers";
import { useEditArticleStore } from "@/stores/editArticle";
import { useArticleStore } from "@/stores/articles";


export default {
  name: "AllArticlesTableRow",
  components: {
    
  },
  props: {
    article: Object
  },

  computed: {
    getCurrentArticle() {
      const editArticleStore = useEditArticleStore();
      return editArticleStore.getCurrentArticle;
    },
    
    getIsEditing() {
      const editArticleStore = useEditArticleStore();
      return editArticleStore.getIsEditing;
    },
  },

  methods: {
    selectAnArticle(payload) { 
      const articleStore = useArticleStore();
      articleStore.selectAnArticle(payload);

    },
    
    setArticleData(payload) { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.setArticleData(payload);

    }, 
    
    hideEditingPage() { 
      const editArticleStore = useEditArticleStore();
      editArticleStore.hideEditingPage();

    },

    getDate(item) {
      return item === null ? '' : new Date(item).toDateString();
    },

    editArticle() {
      if (this.getIsEditing) {
        if (this.getCurrentArticle.id === this.article.id) {
          this.hideEditingPage();
        } else {
          this.editThisArticle();
        }
      } else {
        this.editThisArticle();
      }
    },

    // Update the store to edit this article specifically
    editThisArticle() {
      const article = { ...this.article };
      this.$store.dispatch('edit_article/setArticleData', article);
    },

    shortenString(text, length) {
      return shortenStringReturnMore(text, length);
    },

    shortenAgencies(allAgencies) {
      return shortenAgencies(allAgencies, 2);
    }

  }

}
</script>

<style lang="scss" scoped>
.edit-column {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: #6b6b6b;
  }
}
</style>
