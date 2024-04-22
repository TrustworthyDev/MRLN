<template>
  <b-container class="mt-5">
    <h3>All Alert Classifications</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="higherLevelAlertClassifications"
      :perPage="perPage" :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_higherLevelAlertClassifications_modal" size="lg" ref="higherLevelAlertClassifications_modal"
      no-close-on-backdrop title="Add New Alert Classification" @show="resetModal" @hidden="resetModal"
      @ok="handleOk">
      <b-form v-if="show" ref="higherLevelAlertClassificationsForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label="Name:" label-for="input-1" class="mb-3" :state="form_state.name"
          invalid-feedback=" Alert Classification Name is required">
          <b-form-input id="input-1" v-model="form.name" type="email"
            placeholder="Enter Alert Classification Name" :state="form_state.name" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="Description:" label-for="input-1" class="mb-3"
          :state="form_state.description" invalid-feedback="Alert Classification Description is required">
          <b-form-textarea id="textarea" placeholder="Enter Alert Classification Description"
            v-model="form.description" required :state="form_state.description" max-rows="15" rows="3">
          </b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-1" label-for="input-1" class="mb-3" :state="form_state.is_active">
          <div class="form-check form-check-inline">
            <input type="checkbox" class="form-check-input" v-model="form.is_active">
            <label>Is Active</label>
          </div>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_higherLevelAlertClassifications_modal" size="lg"
      ref="edit_higherLevelAlertClassifications_modal" no-close-on-backdrop title="Edit Alert Classification"
      @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="higherLevelAlertClassificationsForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Name:" label-for="input-1" class="mb-3" :state="edit_form_state.name"
          invalid-feedback=" Alert Classification Name is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email"
            placeholder="Enter Alert Classification Name" :state="edit_form_state.name"
            required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="Description:" label-for="input-1" class="mb-3"
          :state="edit_form_state.description" invalid-feedback=" Alert Classification Name is required">
          <b-form-textarea id="textarea" placeholder="Enter Alert Classification Description"
            v-model="edit_form.description" required :state="edit_form_state.description" max-rows="15"
            rows="3"></b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-1" label-for="input-1" class="mb-3" :state="edit_form_state.is_active">
          <div class="form-check form-check-inline">
            <input type="checkbox" class="form-check-input" v-model="edit_form.is_active">
            <label>Is Active</label>
          </div>
        </b-form-group>

      </b-form>
    </b-modal>
  </b-container>
</template>
  
<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { HigherLevelAlertClassificationsApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "HigherLevelAlertClassifications",
  components: {
    bs_table,
    header_section,
  },
  mixins: [HigherLevelAlertClassificationsApi],
  data() {
    return {
      button_string: "Add Alert Classification",
      type: "higherLevelAlertClassifications",
      form: {
        name: "",
        is_active: false,
        description: "",
      },
      form_state: {
        name: "",
        is_active: false,
        description: "",
      },
      edit_form: {
        name: "",
        is_active: false,
        description: "",
        id: "",
      },
      edit_form_state: {
        name: "",
        is_active: false,
        description: "",
      },

      show: true,
      isBusy: false,
      new_higherLevelAlertClassifications_modal: false,
      edit_higherLevelAlertClassifications_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Alert Classification name" },
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
      submitedHigherLevelAlertClassification: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      higherLevelAlertClassifications: [],
    };
  },
  mounted() {
    this.fetchHigherLevelAlertClassifications();
    this.$bus.$on("updatePage_higherLevelAlertClassifications", this.changePage);
    this.$bus.$on("edit_modal_higherLevelAlertClassifications", this.edit_higherLevelAlertClassifications);
    this.$bus.$on("delete_modal_higherLevelAlertClassifications", this.delete_higherLevelAlertClassifications);
    this.$bus.$on("on_search_higherLevelAlertClassifications", this.onSearch);
    this.$bus.$on("create_new_model_higherLevelAlertClassifications", this.createNewModel);
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
      this.new_higherLevelAlertClassifications_modal = !this.new_higherLevelAlertClassifications_modal;
    },
    async fetchHigherLevelAlertClassifications() {
      this.isBusy = true;
      this.higherLevelAlertClassifications = [];
      await this.getHigherLevelAlertClassificationList(this.currentPage, this.filter)
        .then((response) => {
          this.higherLevelAlertClassifications = response.data.higherlevelclassifications
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all Alert Classifications! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_higherLevelAlertClassifications(item) {
      this.fetchHigherLevelAlertClassification(item.id);
    },
    delete_higherLevelAlertClassifications(item) {
      this.deleteHigherLevelAlertClassification_(item.id);
    },
    deleteHigherLevelAlertClassification_(id) {
      this.deleteHigherLevelAlertClassification(id)
        .then(response => {
          const notification = {
            message: 'Alert Classification deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchHigherLevelAlertClassifications();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Alert Classification.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchHigherLevelAlertClassification(id) {
      this.getHigherLevelAlertClassification(id)
        .then((response) => {
          this.edit_form.name = response.data.higherlevelclassification.name;
          this.edit_form.description = response.data.higherlevelclassification.description;
          this.edit_form.is_active = response.data.higherlevelclassification.is_active;
          this.edit_form.id = response.data.higherlevelclassification.id;
          this.edit_higherLevelAlertClassifications_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Alert Classification.",
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
      this.fetchHigherLevelAlertClassifications();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchHigherLevelAlertClassifications();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { higherLevelAlertClassification: false, key: "Alert Classification Name" };
      }
      if (this.form.description == "") {
        this.form_state.description = false;
        return { higherLevelAlertClassification: false, key: "Description" };
      } else {
        return { higherLevelAlertClassification: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { higherLevelAlertClassification: false, key: "Alert Classification Name" };
      }
      if (this.edit_form.description == "") {
        this.edit_form_state.description = false;
        return { higherLevelAlertClassification: false, key: "Description" };
      } else {
        return { higherLevelAlertClassification: true };
      }
    },
    resetModal() {
      this.name = "";
      this.form_state.name = null;
      this.form.name = "";
      this.form_state.description = null;
      this.form.description = "";
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null;
      this.edit_form.name = "";
      this.edit_form_state.description = null;
      this.edit_form.description = "";
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.higherLevelAlertClassification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_higherLevelAlertClassifications({
          name: this.form.name,
          description: this.form.description,
          is_active: this.form.is_active
        });
        // this.$refs["higherLevelAlertClassifications_modal"].hide();
        this.new_higherLevelAlertClassifications_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.higherLevelAlertClassification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_higherLevelAlertClassifications_data({
          name: this.edit_form.name,
          description: this.edit_form.description,
          is_active: this.edit_form.is_active
        });
        this.edit_higherLevelAlertClassifications_modal = false
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
    create_higherLevelAlertClassifications(data) {
      this.postHigherLevelAlertClassification(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchHigherLevelAlertClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving Alert Classifications.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchHigherLevelAlertClassifications();
        });
    },
    edit_higherLevelAlertClassifications_data(data) {
      this.putHigherLevelAlertClassification(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchHigherLevelAlertClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating Alert Classification.",
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
  