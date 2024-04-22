<template>
  <b-container class="mt-5">
    <h3>All Article Types</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="articleTypes" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_articleTypes_modal" size="lg" ref="articleTypes_modal" no-close-on-backdrop
      title="Add New Article Type" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="articleTypesForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" Article Type Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback=" Article TypeName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Article Type Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_articleTypes_modal" size="lg" ref="edit_articleTypes_modal" no-close-on-backdrop
      title="Edit Article Type" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="articleTypesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Article Type Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" Article TypeName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Article Type Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>
  
<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { ArticleTypeApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "ArticleTypes",
  components: {
    bs_table,
    header_section,
  },
  mixins: [ArticleTypeApi],
  data() {
    return {
      button_string: "Add Article Types",
      type: "articleTypes",
      form: {
        name: "",
      },
      form_state: {
        name: "",
      },
      edit_form: {
        name: "",
        id: "",
      },
      edit_form_state: {
        name: "",
      },

      show: true,
      isBusy: false,
      new_articleTypes_modal: false,
      edit_articleTypes_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Article Type name" },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterOn: [],
      submitedArticleType: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      articleTypes: [],
    };
  },
  mounted() {
    this.fetchArticleTypes();
    this.$bus.$on("updatePage_articleTypes", this.changePage);
    this.$bus.$on("edit_modal_articleTypes", this.edit_articleTypes);
    this.$bus.$on("delete_modal_articleTypes", this.delete_articleTypes);
    this.$bus.$on("on_search_articleTypes", this.onSearch);
    this.$bus.$on("create_new_model_articleTypes", this.createNewModel);
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  methods: {
    setIsOpen(payload) {
      // parameter type boolean
      const newModelStore = useNewModelStore();
      newModelStore.setIsOpen(payload);
    },

    setModelType(payload) {
      // parameter type ModelTypes
      const newModelStore = useNewModelStore();
      newModelStore.setModelType(payload);
    },
    createNewModel() {
      this.new_articleTypes_modal = !this.new_articleTypes_modal;
    },
    async fetchArticleTypes() {
      this.isBusy = true;
      this.articleTypes = [];
      await this.getArticleTypeList(this.currentPage, this.filter)
        .then((response) => {
          this.articleTypes = response.data.articletypes
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all articleTypes! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_articleTypes(item) {
      this.fetchArticleType(item.id);
    },
    delete_articleTypes(item) {
      this.deleteArticleType_(item.id);
    },
    deleteArticleType_(id) {
      this.deleteArticleType(id)
        .then(response => {
          const notification = {
            message: 'Article Type deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchArticleTypes();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Article Type.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchArticleType(id) {
      this.getArticleType(id)
        .then((response) => {
          this.edit_form.name = response.data.articletype.name;
          this.edit_form.id = response.data.articletype.id;
          this.edit_articleTypes_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching ArticleType.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    reseteditModal() {
      this.editModal.title = "";
      this.editModal.content = "";
    },
    changePage(value) {
      this.currentPage = value;
      this.fetchArticleTypes();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchArticleTypes();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { articleType: false, key: " ArticleType Name" };
      }
      if (this.form.selected_countries == "") {
        this.form_state.selected_countries = false;
        return { articleType: false, key: "Countries" };
      } else {
        return { articleType: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { articleType: false, key: " ArticleType Name" };
      } else {
        return { articleType: true };
      }
    },
    resetModal() {
      this.name = "";
      this.form_state.name = null;
      this.form.name = "";
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null;
      this.edit_form.name = "";
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.articleType == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_articleTypes({
          name: this.form.name,
        });
        // this.$refs["articleTypes_modal"].hide();
        this.new_articleTypes_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.articleType == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_articleTypes_data({
          name: this.edit_form.name,
        });
        this.edit_articleTypes_modal = false
      }
    },
    makeToast(variant = null, body) {
      this.$bvToast.toast(body, {
        variant: variant,
        autoHideDelay: 5000,
        appendToast: true,
        solid: true,
      });
    },
    create_articleTypes(data) {
      this.postArticleType(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchArticleTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving articleTypes.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchArticleTypes();
        });
    },
    edit_articleTypes_data(data) {
      this.putArticleType(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchArticleTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  ArticleType.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
  },
};
</script>
  
<style>
.page-item.active .page-link {
  background-color: #88ad3a !important;
  border-color: #88ad3a !important;
}

.page-link {
  color: black;
}

.close {
  color: black;
  background: transparent;
  border: navajowhite;
  font-size: 33px;
  font-weight: bold;
}
</style>
  