<template>
  <div v-if="getCurrentUser.role !== userRoles.EDITOR">
    <div v-if="isActive" id="actionOverlay" class="overlay" @click="event => hideOverlay(event)"></div>
    <div class="actions-dropdown">
      <button class="btn btn-link btn-sm text-decoration-none fw-bold text-primary" @click="updateDropdown">
        Assign Articles
      </button>

      <div v-if="isActive" class="dropdown-content">
        <v-select :options="getAllUsers" :value="currentOptions" label="firstName" @input="updateValue" />

        <div class="d-flex justify-content-center">
          <button :disabled="getSelectedArticles.length <= 0" class="btn btn-sm btn-primary w-100 mt-1 fw-bold"
            @click="assignSelectedArticles">
            Update Articles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserRoles } from "@/types/User";
import { useAccountStore } from "@/stores/account";
import { useArticleStore } from "@/stores/articles";
import { useAllUserStore } from "@/stores/allUsers";

export default {
  name: "AssignArticles",

  data() {
    return {
      isActive: false,
      currentOptions: null,
      userRoles: UserRoles
    }
  },

  computed: {
    getCurrentUser() {
      const accountStore = useAccountStore();
      return accountStore.getCurrentUser;
    },
    
    getAllUsers() {
      const allUserStore = useAllUserStore();
      return allUserStore.getAllUsers;
    },
    
    getSelectedArticles() {
      const articleStore = useArticleStore();
      return articleStore.getSelectedArticles;
    },
  },

  methods: {
    fetchAllEditors() { // parameter type boolean
      const allUserStore = useAllUserStore();
      allUserStore.fetchAllEditors();
    },
    
    assignEditorArticles(payload) { // parameter type boolean
      const allUserStore = useAllUserStore();
      allUserStore.assignEditorArticles(payload);
    },

    updateValue(value) {
      this.currentOptions = value;
    },

    updateDropdown() {
      this.isActive = !this.isActive;
    },

    hideOverlay(event) {
      if (event.target.id === 'actionOverlay') {
        this.isActive = false;
      }
    },

    assignSelectedArticles() {
      if (!this.currentOptions) return;
      this.assignEditorArticles(this.currentOptions);
    }

  },

  created() {
    this.fetchAllEditors();
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
