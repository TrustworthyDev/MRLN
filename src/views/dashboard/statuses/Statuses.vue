<template>
  <b-container class="mt-5">
    <h3>All Statuses</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="statuses" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_statuses_modal" size="lg" ref="statuses_modal" no-close-on-backdrop title="Add New Status"
      @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="statusesForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" Status Name:" label-for="input-1" class="mb-3" :state="form_state.name"
          invalid-feedback=" StatusName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Status Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_statuses_modal" size="lg" ref="edit_statuses_modal" no-close-on-backdrop title="Edit Status"
      @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="statusesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Status Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" StatusName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Status Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { StatusApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "Statuses",
  components: {
    bs_table,
    header_section,
  },
  mixins: [StatusApi],
  data() {
    return {
      button_string: "Add Statuses",
      type: "statuses",
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
      new_statuses_modal: false,
      edit_statuses_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Status name" },
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
      submitedStatus: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      statuses: [],
    };
  },
  mounted() {
    this.fetchStatuses();
    this.$bus.$on("updatePage_statuses", this.changePage);
    this.$bus.$on("edit_modal_statuses", this.edit_statuses);
    this.$bus.$on("delete_modal_statuses", this.delete_statuses);
    this.$bus.$on("on_search_statuses", this.onSearch);
    this.$bus.$on("create_new_model_statuses", this.createNewModel);
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
      this.new_statuses_modal = !this.new_statuses_modal;
    },
    async fetchStatuses() {
      this.isBusy = true;
      this.statuses = [];
      await this.getAllStatuses(this.currentPage, this.filter)
        .then((response) => {
          this.statuses = response.data.statuses
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all statuses! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_statuses(item) {
      this.fetchStatus(item.id);
    },
    delete_statuses(item) {
      this.deleteStatus_(item.id);
    },
    deleteStatus_(id) {
      this.deleteStatus(id)
        .then(response => {
          const notification = {
            message: 'Status deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStatuses();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Status.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchStatus(id) {
      this.getStatus(id)
        .then((response) => {
          this.edit_form.name = response.data.status.name;
          this.edit_form.id = response.data.status.id;
          this.edit_statuses_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Status.",
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
      this.fetchStatuses();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchStatuses();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { status: false, key: "Status Name" };
      } else {
        return { status: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { status: false, key: " Status Name" };
      } else {
        return { status: true };
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

      if (err_.status == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_statuses({
          name: this.form.name,
        });
        // this.$refs["statuses_modal"].hide();
        this.new_statuses_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.status == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_statuses_data({
          name: this.edit_form.name,
        });
        this.edit_statuses_modal = false
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
    create_statuses(data) {
      this.postStatus(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStatuses();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving statuses.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStatuses();
        });
    },
    edit_statuses_data(data) {
      this.putStatus(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStatuses();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  Status.",
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
