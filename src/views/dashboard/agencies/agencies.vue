<template>
  <b-container class="mt-5">
    <h3>All Agencies</h3>
    <header_component :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="agencies" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal ref="agency_modal" v-model="new_agency_modal" no-close-on-backdrop size="lg" title="Add New Agency"
      @hidden="resetModal" @ok="handleOk" @show="resetModal">
      <b-form v-if="show" ref="agencyForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" :state="form_state.name" class="mb-3" invalid-feedback="Agency Name is required"
          label="Agency Name:" label-for="input-1">
          <b-form-input id="input-1" v-model="form.name" :state="form_state.name" placeholder="Enter Agency Name" required
            type="email"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" :state="form_state.selected_countries" class="mb-3"
          invalid-feedback="Country Name is required if unsure about it select Unassigned from list"
          label="Select Countries:" label-for="input-2">
          <v-select v-model="form.selected_countries" :options="countries" :push-tags="true"
            :reduce="country_data => country_data.name" :required="!form.selected_countries"
            :state="form_state.selected_countries" label="name" multiple />

        </b-form-group>
        <b-form-group id="input-group-2" class="mb-3" label="Select States:" label-for="input-2">
          <v-select v-model="form.selected_states" :options="states" :push-tags="true"
            :reduce="states_data => states_data.name" label="name" multiple />
        </b-form-group>

      </b-form>
    </b-modal>
    <b-modal ref="edit_agency_modal" v-model="edit_agency_modal" no-close-on-backdrop size="lg" title="Edit Agency"
      @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="agencyForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" :state="edit_form_state.name" class="mb-3"
          invalid-feedback="Agency Name is required" label="Agency Name:" label-for="input-1">
          <b-form-input id="input-1" v-model="edit_form.name" :state="edit_form_state.name"
            placeholder="Enter Agency Name" required type="email"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" :state="edit_form_state.selected_countries" class="mb-3"
          invalid-feedback="Country Name is required if unsure about it select Unassigned from list"
          label="Select Countries:" label-for="input-2">
          <v-select v-model="edit_form.selected_countries" :options="countries" :push-tags="true"
            :reduce="country_data => country_data.name" :required="!edit_form.selected_countries"
            :state="edit_form_state.selected_countries" label="name" multiple />

        </b-form-group>
        <b-form-group id="input-group-2" class="mb-3" label="Select States:" label-for="input-2">
          <v-select v-model="edit_form.selected_states" :options="states" :push-tags="true"
            :reduce="states_data => states_data.name" label="name" multiple />
        </b-form-group>

      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from '@/stores/notifications';
import { useNewModelStore } from '@/stores/newModel';
import { AgencyApi, } from '@/api';
import bs_table from "@/components/inner-layouts/table.vue";
import header_component from "@/components/inner-layouts/crud-header-section.vue";

export default {
  name: "agencies",
  components: {
    header_component,
    bs_table
  },
  data() {
    return {
      type: "agencies",
      button_string: "New Agency",
      states: [],
      countries: [],
      form: {
        name: '',
        selected_countries: [],
        selected_states: []
      },
      form_state: {
        name: '',
        selected_countries: "",
        selected_states: ""
      },
      edit_form: {
        name: '',
        id: '',
        selected_countries: "",
        selected_states: ""
      },
      edit_form_state: {
        name: '',
        selected_countries: "",
        selected_states: ""
      },

      show: true,
      isBusy: false,
      new_agency_modal: false,
      edit_agency_modal: false,
      items: [],
      fields: [
        { key: 'name', label: 'Agency name' },
        { key: 'actions', label: 'Actions' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: "",
      filterOn: [],
      submitedAgency: [],
      editModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      agencies: []
    }
  },
  mixins: [
    AgencyApi,
  ],
  mounted() {
    this.fetchAgencies()
    this.$bus.$on('updatePage_agency', this.changePage);
    this.$bus.$on('edit_modal_agency', this.edit_agency);
    this.$bus.$on('delete_modal_agency', this.delete_agency);
    this.$bus.$on('on_search_agency', this.onSearch);
    this.$bus.$on('create_new_model_agency', this.createNewModel);
  },
  methods: {
    setIsOpen(payload) { // parameter type boolean
      const newModelStore = useNewModelStore();
      newModelStore.setIsOpen(payload);
    },

    setModelType(payload) { // parameter type ModelTypes
      const newModelStore = useNewModelStore();
      newModelStore.setModelType(payload);

    },
    createNewModel() {
      this.new_agency_modal = !this.new_agency_modal
      if (this.new_agency_modal) {
        this.selected_countries = "";
        this.selected_states = "";
        this.fetchStatesAndCountries()
      }
    },
    fetchAgencies() {
      this.isBusy = true
      this.agencies = []
      this.getAllAgencies(this.currentPage, this.filter)
        .then(response => {
          this.agencies = response.data.agencies
          this.totalRows = response.data.total_pages * this.perPage
          this.currentPage = response.data.page
          this.isBusy = false
        })
        .catch(() => {
          const notification = {
            message: 'There was an error fetching all agencies! Please refresh and try again.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_agency(item) {
      this.fetchAgency(item.id)
    },
    delete_agency(item) {
      this.deleteAgency_(item.id)
    },
    fetchAgency(id) {
      this.getAgency(id)
        .then(response => {
          this.edit_form.selected_countries = response.data.agency.country
          this.edit_form.selected_states = response.data.agency.state
          this.edit_form.name = response.data.agency.name
          this.edit_form.id = response.data.agency.id
          this.edit_agency_modal = true
          this.fetchStatesAndCountries()
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Fetching Agency.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });

    },
    deleteAgency_(id) {
      this.deleteAgency(id)
        .then(response => {
          const notification = {
            message: 'Agency deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAgencies();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Agency.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });

    },
    reseteditModal() {
      this.editModal.title = ''
      this.editModal.content = ''
    },
    changePage(value) {
      this.currentPage = value
      this.fetchAgencies()

    },
    onSearch(value) {
      this.filter = value
      this.currentPage = 1
      this.fetchAgencies()
    },
    fetchStatesAndCountries() {
      this.states = []
      this.countries = []
      this.getStatesAndCountries()
        .then(response => {

          this.states = response.data.states
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
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false
        return { status: false, key: "Agency Name" }
      }
      if (this.form.selected_countries == "") {
        this.form_state.selected_countries = false
        return { status: false, key: "Countries" }
      } else {
        return { status: true }
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false
        return { status: false, key: "Agency Name" }
      }
      if (this.edit_form.selected_countries == "") {
        this.edit_form_state.selected_countries = false
        return { status: false, key: "Countries" }
      } else {
        return { status: true }
      }
    },
    resetModal() {
      this.name = ''
      this.form_state.name = null
      this.form.name = ""
      this.form_state.selected_countries = null
      this.form.selected_countries = ""
      this.form_state.selected_states = null
      this.form.selected_states = ""
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null
      this.edit_form.name = ""
      this.edit_form_state.selected_countries = null
      this.edit_form.selected_countries = ""
      this.edit_form_state.selected_states = null
      this.edit_form.selected_states = ""
    },
    handleOk(bvModalEvt) {

      this.handleSubmit(bvModalEvt)
    },
    handle_edit_Ok(bvModalEvt) {

      this.handleEditSubmit(bvModalEvt)
    },
    handleSubmit(bvModalEvt) {

      const err_ = this.checkFormValidity()

      if (err_.status == false) {
        bvModalEvt.preventDefault()

      } else {
        const selected_countries = [];
        const form_select_countries = this.form.selected_countries
        this.countries.filter((v, k) => {
          if (form_select_countries.includes(v.name)) {
            selected_countries.push(v.id)
            return k
          }
        })
        const selected_states = []
        const form_selected_states = this.form.selected_states
        this.states.filter((v, k) => {
          if (form_selected_states.includes(v.name)) {
            selected_states.push(v.id)
            return k
          }
        })
        this.create_agency({
          'agency_name': this.form.name, 'countries': selected_countries, 'states': selected_states
        })
        // this.$refs['agency_modal'].hide()
        this.new_agency_modal = false
      }


    }, handleEditSubmit(bvModalEvt) {

      const err_ = this.checkEditFormValidity()

      if (err_.status == false) {
        bvModalEvt.preventDefault()

      } else {
        this.edit_form.selected_countries = this.edit_form.selected_countries.map((v, k) => {
          if (Object.keys(v).includes("name")) {
            return v.name
          } else {
            return v
          }

        })
        this.edit_form.selected_states = this.edit_form.selected_states.map((v, k) => {
          if (Object.keys(v).includes("name")) {
            return v.name
          } else {
            return v
          }

        })
        const selected_countries = [];
        const form_select_countries = this.edit_form.selected_countries
        this.countries.filter((v, k) => {
          if (form_select_countries.includes(v.name)) {
            selected_countries.push(v.id)
            return k
          }
        })
        const selected_states = []
        const form_selected_states = this.edit_form.selected_states
        this.states.filter((v, k) => {
          if (form_selected_states.includes(v.name)) {
            selected_states.push(v.id)
            return k
          }
        })
        this.edit_agency_data({
          'agency_name': this.edit_form.name, 'countries': selected_countries, 'states': selected_states
        })
        // this.$refs['edit_agency_modal'].hide()
        this.edit_agency_modal = false
      }


    },
    makeToast(variant = null, body) {
      this.$bvToast.toast(body, {
        variant: variant,
        autoHideDelay: 5000,
        appendToast: true,
        solid: true
      })
    },
    create_agency(data) {
      this.postAgency(data).then(response => {
        const notification = {
          message: data.agency_name + ' Successfully Saved',
          type: 'success'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
        this.fetchAgencies()
      })
        .catch(() => {
          const notification = {
            message: 'There was an error while saving agency.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAgencies()
        });
    },
    edit_agency_data(data) {
      this.putAgency(this.edit_form.id, data)
        .then(response => {
          const notification = {
            message: data.agency_name + ' Successfully Updated',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAgencies()
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Updating Agency.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    }
  }
}
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

