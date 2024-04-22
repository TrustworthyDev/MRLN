<template>
  <b-container class="mt-5">
    <h3>All Alert Subclassifications</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="subTypeClassifications"
      :perPage="perPage" :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_subTypeClassifications_modal" size="lg" ref="subTypeClassifications_modal" no-close-on-backdrop
      title="Add New Alert Subclassification" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="subTypeClassificationsForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label="Alert Subclassification Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback="Alert Subclassification Name is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Alert Subclassification Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="Description:" label-for="input-1" class="mb-3"
          :state="form_state.description" invalid-feedback="Alert Subclassification Description is required">
          <b-form-textarea id="textarea" placeholder="Enter Alert Subclassification Description"
            v-model="form.description" required :state="form_state.description" max-rows="15" rows="3">
          </b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-2" :state="form_state.higherLevelAlertClassification" label="Alert Classification" class="mb-3"
          label-for="input-2">
          <v-select v-model="form.higherLevelAlertClassification" :options="higherLevelAlertClassifications"
            :push-tags="true" :reduce="(data) => data.id" :required="!form.higherLevelAlertClassification"
            :state="form_state.higherLevelAlertClassification" label="name" :multiple="isMultipleSelect" />
        </b-form-group>

        <b-form-group id="input-group-1" label-for="input-1" class="mb-3"
          :state="form_state.is_active">
          <div class="form-check form-check-inline">
            <input type="checkbox" class="form-check-input" v-model="form.is_active">
            <label>Is Active</label>
          </div>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_subTypeClassifications_modal" size="lg" ref="edit_subTypeClassifications_modal"
      no-close-on-backdrop title="Edit Alert Subclassification" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="subTypeClassificationsForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Alert Subclassification Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" Alert SubclassificationName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Alert Subclassification Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="Description:" label-for="input-1" class="mb-3"
          :state="edit_form_state.description" invalid-feedback="Alert Subclassification Description is required">
          <b-form-textarea id="textarea" placeholder="Enter Alert Subclassification Description"
            v-model="edit_form.description" required :state="edit_form_state.description" max-rows="15"
            rows="3"></b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-2" :state="edit_form_state.higherLevelAlertClassification" class="mb-3" label="Alert Classification:"
          label-for="input-2">
          <v-select v-model="edit_form.higherLevelAlertClassification" :options="higherLevelAlertClassifications"
            :push-tags="true" :reduce="(data) => data.id" :required="!edit_form.higherLevelAlertClassification"
            :state="edit_form_state.higherLevelAlertClassification" label="name" :multiple="isMultipleSelect" />
        </b-form-group>

        <b-form-group id="input-group-1" label-for="input-1" class="mb-3"
          :state="edit_form_state.is_active">
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
import { SubTypeClassificationApi, HigherLevelAlertClassificationsApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "SubTypeClassifications",
  components: {
    bs_table,
    header_section,
  },
  mixins: [SubTypeClassificationApi, HigherLevelAlertClassificationsApi],
  data() {
    return {
      button_string: "Add Alert Subclassification",
      type: "subTypeClassifications",
      form: {
        name: "",
        is_active: false,
        description: "",
        higherLevelAlertClassification: null,
      },
      form_state: {
        name: "",
        is_active: false,
        description: "",
        higherLevelAlertClassification: null,
      },
      edit_form: {
        name: "",
        is_active: false,
        description: "",
        higherLevelAlertClassification: null,
        id: "",
      },
      edit_form_state: {
        name: "",
        is_active: false,
        description: "",
        higherLevelAlertClassification: null,
      },
      higherLevelAlertClassifications: [],
      show: true,
      isBusy: false,
      new_subTypeClassifications_modal: false,
      edit_subTypeClassifications_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Alert Subclassification name" },
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
      submitedSubTypeClassification: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      subTypeClassifications: [],
    };
  },
  mounted() {
    this.fetchSubTypeClassifications();
    this.fetchHigherLevelAlertClassifications();
    this.$bus.$on("updatePage_subTypeClassifications", this.changePage);
    this.$bus.$on("edit_modal_subTypeClassifications", this.edit_subTypeClassifications);
    this.$bus.$on("delete_modal_subTypeClassifications", this.delete_subTypeClassifications);
    this.$bus.$on("on_search_subTypeClassifications", this.onSearch);
    this.$bus.$on("create_new_model_subTypeClassifications", this.createNewModel);
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
      this.new_subTypeClassifications_modal = !this.new_subTypeClassifications_modal;
    },
    async fetchHigherLevelAlertClassifications() {
      this.higherLevelAlertClassifications = [];
      await this.getHigherLevelAlertClassificationList(this.currentPage, this.filter)
        .then((response) => {
          this.higherLevelAlertClassifications = response.data.higherlevelclassifications
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
    async fetchSubTypeClassifications() {
      this.isBusy = true;
      this.subTypeClassifications = [];
      await this.getSubtypeClassificationList(this.currentPage, this.filter)
        .then((response) => {
          this.subTypeClassifications = response.data.subtypeclassifications
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all Alert Subclassification! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_subTypeClassifications(item) {
      this.fetchSubTypeClassification(item.id);
    },
    delete_subTypeClassifications(item) {
      this.deleteSubTypeClassification_(item.id);
    },
    deleteSubTypeClassification_(id) {
      this.deleteSubtypeClassification(id)
      .then(response => {
          const notification = {
            message: 'Alert Subclassification deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchSubTypeClassifications();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Alert Subclassification.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchSubTypeClassification(id) {
      this.getSubtypeClassification(id)
        .then((response) => {
          this.edit_form.name = response.data.subtypeclassification.name;
          this.edit_form.id = response.data.subtypeclassification.id;
          this.edit_form.description = response.data.subtypeclassification.description;
          this.edit_form.higherLevelAlertClassification = response.data.subtypeclassification.higher_order_alert_classification;
          this.edit_form.is_active = response.data.subtypeclassification.is_active;
          this.edit_subTypeClassifications_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Alert Subclassification.",
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
      this.fetchSubTypeClassifications();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchSubTypeClassifications();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { subTypeClassification: false, key: "Alert Subclassification Name" };
      }
      if (this.form.description == "") {
        this.form_state.description = false;
        return { subTypeClassification: false, key: "Description" };
      }
      if (this.form.higherLevelAlertClassification == "") {
        this.form_state.higherLevelAlertClassification = false;
        return { subTypeClassification: false, key: "HigherLevelAlertClassification" };
      } else {
        return { subTypeClassification: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { subTypeClassification: false, key: "Alert Subclassification Name" };
      }
      if (this.edit_form.description == "") {
        this.edit_form_state.description = false;
        return { subTypeClassification: false, key: "Description" };
      } if (this.edit_form.higherLevelAlertClassification == "") {
        this.edit_form_state.higherLevelAlertClassification = false;
        return { subTypeClassification: false, key: "HigherLevelAlertClassification" };
      } else {
        return { subTypeClassification: true };
      }
    },
    resetModal() {
      this.name = "";
      this.form_state.name = null;
      this.form.name = "";
      this.form_state.description = null;
      this.form.description = "";
      this.form_state.is_active = null;
      this.form.is_active = "";
      this.form_state.higherLevelAlertClassification = null;
      this.form.higherLevelAlertClassification = "";
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null;
      this.edit_form.name = "";
      this.edit_form_state.description = null;
      this.edit_form.description = "";
      this.edit_form_state.is_active = null;
      this.edit_form.is_active = "";
      this.edit_form_state.higherLevelAlertClassification = null;
      this.edit_form.higherLevelAlertClassification = "";
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.subTypeClassification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_subTypeClassifications({
          name: this.form.name,
          description: this.form.description,
          is_active: this.form.is_active,
          higher_order_alert_classification: this.form.higherLevelAlertClassification,
        });
        this.new_subTypeClassifications_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.subTypeClassification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_subTypeClassifications_data({
          name: this.edit_form.name,
          description: this.edit_form.description,
          is_active: this.edit_form.is_active,
          higher_order_alert_classification: this.edit_form.higherLevelAlertClassification,
        });
        this.edit_subTypeClassifications_modal = false
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
    create_subTypeClassifications(data) {
      this.postSubtypeClassification(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchSubTypeClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving Alert Subclassifications.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchSubTypeClassifications();
        });
    },
    edit_subTypeClassifications_data(data) {
      this.putSubtypeClassification(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchSubTypeClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating Alert Subclassification.",
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
