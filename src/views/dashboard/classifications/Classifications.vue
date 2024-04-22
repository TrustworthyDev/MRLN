<template>
  <b-container class="mt-5">
    <h3>All Agency Classifications</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="classifications" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_classifications_modal" size="lg" ref="classifications_modal" no-close-on-backdrop
      title="Add New Agency Classification" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="classificationsForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label="Agency Classification Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback="Agency Classification Name is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Agency Classification Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_classifications_modal" size="lg" ref="edit_classifications_modal" no-close-on-backdrop
      title="Edit Agency Classification" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="classificationsForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Agency Classification Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback="Agency Classification Name is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Agency Classification Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { ClassificationApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "Classifications",
  components: {
    bs_table,
    header_section,
  },
  mixins: [ClassificationApi],
  data() {
    return {
      button_string: "Add Agency Classification",
      type: "classifications",
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
      new_classifications_modal: false,
      edit_classifications_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Agency Classification name" },
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
      submitedClassification: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      classifications: [],
    };
  },
  mounted() {
    this.fetchClassifications();
    this.$bus.$on("updatePage_classifications", this.changePage);
    this.$bus.$on("edit_modal_classifications", this.edit_classifications);
    this.$bus.$on("delete_modal_classifications", this.delete_classifications);
    this.$bus.$on("on_search_classifications", this.onSearch);
    this.$bus.$on("create_new_model_classifications", this.createNewModel);
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
      this.new_classifications_modal = !this.new_classifications_modal;
    },
    async fetchClassifications() {
      this.isBusy = true;
      this.classifications = [];
      await this.getAllClassifications(this.currentPage, this.filter)
        .then((response) => {
          this.classifications = response.data.classifications
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all Agency Classifications! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_classifications(item) {
      this.fetchClassification(item.id);
    },
    delete_classifications(item) {
      this.deleteClassification_(item.id);
    },
    deleteClassification_(id) {
      this.deleteClassification(id)
        .then(response => {
          const notification = {
            message: 'Agency Classification deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchClassifications();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Agency Classification.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchClassification(id) {
      this.getClassification(id)
        .then((response) => {
          this.edit_form.name = response.data.classification.name;
          this.edit_form.id = response.data.classification.id;
          this.edit_classifications_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Agency Classification.",
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
      this.fetchClassifications();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchClassifications();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { classification: false, key: "Agency Classification Name" };
      }
      if (this.form.selected_countries == "") {
        this.form_state.selected_countries = false;
        return { classification: false, key: "Countries" };
      } else {
        return { classification: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { classification: false, key: "Agency Classification Name" };
      } else {
        return { classification: true };
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

      if (err_.classification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_classifications({
          name: this.form.name,
        });
        // this.$refs["classifications_modal"].hide();
        this.new_classifications_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.classification == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_classifications_data({
          name: this.edit_form.name,
        });
        this.edit_classifications_modal = false
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
    create_classifications(data) {
      this.postClassification(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving Agency Classification.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchClassifications();
        });
    },
    edit_classifications_data(data) {
      this.putClassification(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchClassifications();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating Agency Classification.",
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
