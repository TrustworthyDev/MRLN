<template>
  <b-container class="mt-5">
    <h3>All Alert Types</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="alert_types" :perPage="perPage"
      :totalRows="totalRows" :type="type" />



    <b-modal id="add_alert_type" v-model="new_alert_types_modal" size="lg" ref="alert_types_modal" no-close-on-backdrop
      no-close-on-esc hide-header-close title="Add New Alert Type" @show="resetModal" @hidden="resetModal"
      @ok="(e) => handleOk(e)">
      <b-form v-if="show" ref="alert_typesForm">
        <b-form-group id="input-group-1" label="Alert_Type Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback="Alert_Type Name is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Alert_Type Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>


      </b-form>
    </b-modal>
    <b-modal v-model="edit_alert_types_modal" size="lg" ref="edit_alert_types_modal" no-close-on-backdrop
      title="Edit Alert_Type" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="alert_typesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Alert_Type Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback="Alert_Type Name is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Alert_Type Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>


      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { AlertTypeApi, } from '@/api';
import bs_table from "@/components/inner-layouts/table.vue";
import header_section from "@/components/inner-layouts/crud-header-section.vue";
export default {
  name: "alert_types",
  components: {
    bs_table,
    header_section
  },
  mixins: [
    AlertTypeApi,
  ],
  data() {
    return {
      type: "alert_types",
      button_string: "New Alert Type",
      form: {
        name: '',
      },
      form_state: {
        name: '',
      },
      edit_form: {
        name: '',
        id: '',
      },
      edit_form_state: {
        name: '',
      },

      show: true,
      isBusy: false,
      new_alert_types_modal: false,
      edit_alert_types_modal: false,
      items: [],
      fields: [
        { key: 'name', label: 'Alert Type name' },
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
      submitedAlert_Type: [],
      editModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      alert_types: []
    }
  },
  mounted() {
    this.fetchAlertTypes()
    this.$bus.$on('updatePage_alert_types', this.changePage);
    this.$bus.$on('edit_modal_alert_types', this.edit_alert_types);
    this.$bus.$on('delete_modal_alert_types', this.delete_alert_types);
    this.$bus.$on('on_search_alert_types', this.onSearch);
    this.$bus.$on('create_new_model_alert_types', this.createNewModel);
  },
  computed: {

    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },


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
      this.new_alert_types_modal = !this.new_alert_types_modal
    },
    fetchAlertTypes() {
      this.isBusy = true
      this.alert_types = []
      this.getAlertTypesList(this.currentPage, this.filter)
        .then(response => {
          this.alert_types = response.data.alerttypes
          this.totalRows = response.data.total_pages * this.perPage
          this.currentPage = response.data.page
          this.isBusy = false
        })
        .catch(() => {
          const notification = {
            message: 'There was an error fetching all alert_types! Please refresh and try again.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_alert_types(item) {
      this.fetchAlert_Type(item.id)
    },
    delete_alert_types(item) {
      this.delete_alert_types_(item.id)
    },
    delete_alert_types_(id) {
      this.deleteAlertType(id).then(response => {
        const notification = {
          message: 'Alert Type deleted.',
          type: 'success'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
        this.fetchAlertTypes();
      })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Alert Type.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchAlert_Type(id) {
      this.getAlertType(id)
        .then(response => {
          this.edit_form.name = response.data.alerttype.name
          this.edit_form.id = response.data.alerttype.id
          this.edit_alert_types_modal = true
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Fetching Alert_Type.',
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
      this.fetchAlertTypes()

    },
    onSearch(value) {
      this.filter = value
      this.currentPage = 1
      this.fetchAlertTypes()
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false
        return { status: false, key: "Alert_Type Name" }
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
        return { status: false, key: "Alert_Type Name" }
      } else {
        return { status: true }
      }
    },
    resetModal() {
      this.name = ''
      this.form_state.name = null
      this.form.name = ""
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null
      this.edit_form.name = ""
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
        return
      } else {

        this.create_alert_types({
          'alert_types_name': this.form.name
        })
        // this.$refs['alert_types_modal'].hide()
        this.new_alert_types_modal = false
      }


    }, handleEditSubmit(bvModalEvt) {

      const err_ = this.checkEditFormValidity()

      if (err_.status == false) {
        bvModalEvt.preventDefault()
        return
      } else {
        this.edit_alert_types_data({
          'alert_types_name': this.edit_form.name
        })
        // this.$refs['edit_alert_types_modal'].hide()
        this.edit_alert_types_modal = false
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
    create_alert_types(data) {
      this.postAlertType(data).then(response => {
        const notification = {
          message: data.alert_types_name + ' Successfully Saved',
          type: 'success'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
        this.fetchAlertTypes()
      })
        .catch(() => {
          const notification = {
            message: 'There was an error while saving alert_types.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes()
        });
    },
    edit_alert_types_data(data) {
      this.putAlertType(this.edit_form.id, data)
        .then(response => {
          const notification = {
            message: data.alert_types_name + ' Successfully Updated',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes()
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Updating Alert_Type.',
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
