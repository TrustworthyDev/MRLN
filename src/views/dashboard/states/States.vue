<template>
  <b-container class="mt-5">
    <h3>All States</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="states" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_states_modal" size="lg" ref="states_modal" no-close-on-backdrop title="Add New State"
      @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="statesForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" State Name:" label-for="input-1" class="mb-3" :state="form_state.name"
          invalid-feedback=" StateName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter State Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" :state="form_state.country" label="Country:" class="mb-3" label-for="input-2">
          <v-select v-model="form.country" :options="countries" :push-tags="true" :reduce="(data) => data.id"
            :required="!form.country" :state="form_state.country" label="name" />
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_states_modal" size="lg" ref="edit_states_modal" no-close-on-backdrop title="Edit State"
      @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="statesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="State Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" StateName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter State Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" :state="edit_form_state.country" class="mb-3" label="Country:"
          label-for="input-2">
          <v-select v-model="edit_form.country" :options="countries" :push-tags="true" :reduce="(data) => data.id"
            :required="!edit_form.country" :state="edit_form_state.country" label="name" />
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>
  
<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { AgencyApi, StateApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "States",
  components: {
    bs_table,
    header_section,
  },
  mixins: [StateApi, AgencyApi],
  data() {
    return {
      button_string: "Add States",
      type: "states",
      form: {
        name: "",
        country: "",
      },
      form_state: {
        name: "",
        country: "",
      },
      edit_form: {
        name: "",
        country: "",
        id: "",
      },
      edit_form_state: {
        name: "",
        country: "",
      },
      countries: [],
      show: true,
      isBusy: false,
      new_states_modal: false,
      edit_states_modal: false,
      items: [],
      fields: [
        { key: "name", label: "State name" },
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
      submitedState: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      states: [],
    };
  },
  mounted() {
    this.fetchStates();
    this.fetchCountries();
    this.$bus.$on("updatePage_states", this.changePage);
    this.$bus.$on("edit_modal_states", this.edit_states);
    this.$bus.$on("delete_modal_states", this.delete_states);
    this.$bus.$on("on_search_states", this.onSearch);
    this.$bus.$on("create_new_model_states", this.createNewModel);
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
      this.new_states_modal = !this.new_states_modal;
    },
    async fetchStates() {
      this.isBusy = true;
      this.states = [];
      await this.getStateList(this.currentPage, this.filter)
        .then((response) => {
          this.states = response.data.states
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all states! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchCountries() {
      this.countries = []
      this.getStatesAndCountries()
        .then(response => {
          this.countries = response.data.countries
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Article Options.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_states(item) {
      this.fetchState(item.id);
    },
    delete_states(item) {
      this.deleteState_(item.id);
    },
    deleteState_(id) {
      this.deleteState(id)
        .then(response => {
          const notification = {
            message: 'State deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStates();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting State.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchState(id) {
      this.getState(id)
        .then((response) => {
          this.edit_form.name = response.data.state.name;
          this.edit_form.id = response.data.state.id;
          this.edit_form.country = response.data.state.country;
          this.edit_states_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching State.",
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
      this.fetchStates();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchStates();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { state: false, key: "State Name" };
      }
      if (this.form.country == "") {
        this.form_state.country = false;
        return { state: false, key: "Country" };
      } else {
        return { state: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { state: false, key: " State Name" };
      } if (this.edit_form.country == "") {
        this.edit_form_state.country = false;
        return { state: false, key: "Country" };
      } else {
        return { state: true };
      }
    },
    resetModal() {
      this.name = "";
      this.form_state.name = null;
      this.form.name = "";
      this.form_state.country = null;
      this.form.country = "";
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null;
      this.edit_form.name = "";
      this.edit_form_state.country = null;
      this.edit_form.country = "";
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.state == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_states({
          name: this.form.name,
          country: this.form.country
        });
        // this.$refs["states_modal"].hide();
        this.new_states_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.state == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_states_data({
          name: this.edit_form.name,
          country: this.edit_form.country
        });
        this.edit_states_modal = false
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
    create_states(data) {
      this.postState(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStates();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving states.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStates();
        });
    },
    edit_states_data(data) {
      this.putState(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchStates();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  State.",
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
  