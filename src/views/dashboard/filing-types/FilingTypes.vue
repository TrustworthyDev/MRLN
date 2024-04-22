<template>
  <b-container class="mt-5">
    <h3>All Filing Types</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="filingTypes" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_filingTypes_modal" size="lg" ref="filingTypes_modal" no-close-on-backdrop
      title="Add New Filing Type" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="filingTypesForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" Filing Type Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback=" Filing TypeName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Filing Type Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_filingTypes_modal" size="lg" ref="edit_filingTypes_modal" no-close-on-backdrop
      title="Edit Filing Type" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="filingTypesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Filing Type Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" Filing TypeName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Filing Type Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { FilingTypeApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "FilingTypes",
  components: {
    bs_table,
    header_section,
  },
  mixins: [FilingTypeApi],
  data() {
    return {
      button_string: "Add Filing Types",
      type: "filingTypes",
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
      new_filingTypes_modal: false,
      edit_filingTypes_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Filing Type name" },
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
      submitedFilingType: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      filingTypes: [],
    };
  },
  mounted() {
    this.fetchFilingTypes();
    this.$bus.$on("updatePage_filingTypes", this.changePage);
    this.$bus.$on("edit_modal_filingTypes", this.edit_filingTypes);
    this.$bus.$on("delete_modal_filingTypes", this.delete_filingTypes);
    this.$bus.$on("on_search_filingTypes", this.onSearch);
    this.$bus.$on("create_new_model_filingTypes", this.createNewModel);
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
      this.new_filingTypes_modal = !this.new_filingTypes_modal;
    },
    async fetchFilingTypes() {
      this.isBusy = true;
      this.filingTypes = [];
      await this.getFilingTypeList(this.currentPage, this.filter)
        .then((response) => {
          this.filingTypes = response.data.filingtypes
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all filingTypes! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_filingTypes(item) {
      this.fetchFilingType(item.id);
    },
    delete_filingTypes(item) {
      this.deleteFilingType_(item.id);
    },
    deleteFilingType_(id) {
      this.deleteFilingType(id)
        .then(response => {
          const notification = {
            message: 'Filing Type deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchFilingTypes();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Filing Type.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchFilingType(id) {
      this.getFilingType(id)
        .then((response) => {
          this.edit_form.name = response.data.filingtype.name;
          this.edit_form.id = response.data.filingtype.id;
          this.edit_filingTypes_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching FilingType.",
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
      this.fetchFilingTypes();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchFilingTypes();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { filingType: false, key: "FilingType Name" };
      } else {
        return { filingType: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { filingType: false, key: "FilingType Name" };
      } else {
        return { filingType: true };
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

      if (err_.filingType == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_filingTypes({
          name: this.form.name,
        });
        // this.$refs["filingTypes_modal"].hide();
        this.new_filingTypes_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.filingType == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_filingTypes_data({
          name: this.edit_form.name,
        });
        this.edit_filingTypes_modal = false
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
    create_filingTypes(data) {
      this.postFilingType(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchFilingTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving filingTypes.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchFilingTypes();
        });
    },
    edit_filingTypes_data(data) {
      this.putFilingType(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchFilingTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  FilingType.",
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
