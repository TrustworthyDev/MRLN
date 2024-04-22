<template>
  <b-container class="mt-5">
    <h3>All Published Statuses</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="published_statuses" :perPage="perPage"
      :totalRows="totalRows" :type="type" />

    <b-modal id="add_published_status" v-model="new_published_statuses_modal" size="lg" ref="published_statuses_modal"
      no-close-on-backdrop no-close-on-esc hide-header-close title="Add New Published Status" @show="resetModal"
      @hidden="resetModal" @ok="(e) => handleOk(e)">
      <b-form v-if="show" ref="published_statusesForm">
        <b-form-group id="input-group-1" label="Published Status Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback="Published Status Name is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Published Status Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>

      </b-form>
    </b-modal>
    <b-modal v-model="edit_published_statuses_modal" size="lg" ref="edit_published_statuses_modal" no-close-on-backdrop
      title="Edit Published Status" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="published_statusesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Published Status Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback="Published Status Name is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Published Status Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>

      </b-form>
    </b-modal>
  </b-container>
</template>
  
<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { AlertStatusApi } from '@/api';
import bs_table from "@/components/inner-layouts/table.vue";
import header_section from "@/components/inner-layouts/crud-header-section.vue";
export default {
  name: "alert_statuses",
  components: {
    bs_table,
    header_section
  },
  mixins: [
    AlertStatusApi,
  ],
  data() {
    return {
      type: "published_statuses",
      button_string: "New Published Status",
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
      new_published_statuses_modal: false,
      edit_published_statuses_modal: false,
      items: [],
      fields: [
        { key: 'name', label: 'Published Status name' },
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
      submitedAlertStatus: [],
      editModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      published_statuses: []
    }
  },
  mounted() {
    this.fetchAlertStatuses()
    this.$bus.$on('updatePage_alert_statuses', this.changePage);
    this.$bus.$on('edit_modal_alert_statuses', this.edit_published_statuses);
    this.$bus.$on('delete_modal_alert_statuses', this.delete_published_statuses);
    this.$bus.$on('on_search_alert_statuses', this.onSearch);
    this.$bus.$on('create_new_model_alert_statuses', this.createNewModel);
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
      this.new_published_statuses_modal = !this.new_published_statuses_modal
    },
    fetchAlertStatuses() {
      this.isBusy = true
      this.published_statuses = []
      this.getAlertStatusesList(this.currentPage, this.filter)
        .then(response => {
          this.published_statuses = response.data.publishedstatuses
          this.totalRows = response.data.total_pages * this.perPage
          this.currentPage = response.data.page
          this.isBusy = false
        })
        .catch(() => {
          const notification = {
            message: 'There was an error fetching all published_statuses! Please refresh and try again.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_published_statuses(item) {
      this.fetchAlertStatus(item.id)
    },
    delete_published_statuses(item) {
      this.deleteAlertStatus_(item.id)
    },
    deleteAlertStatus_(id) {
      this.deleteAlertStatus(id)
        .then(response => {
          const notification = {
            message: 'Published Status deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertStatuses();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Published Status.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchAlertStatus(id) {
      this.getAlertStatus(id)
        .then(response => {
          this.edit_form.name = response.data.publishedstatus.name
          this.edit_form.id = response.data.publishedstatus.id
          this.edit_published_statuses_modal = true
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Fetching AlertStatus.',
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
      this.fetchAlertStatuses()

    },
    onSearch(value) {
      this.filter = value
      this.currentPage = 1
      this.fetchAlertStatuses()
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false
        return { status: false, key: "AlertStatus Name" }
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
        return { status: false, key: "AlertStatus Name" }
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

        this.create_published_statuses({
          'name': this.form.name
        })
        // this.$refs['published_statuses_modal'].hide()
        this.new_published_statuses_modal = false
      }


    }, handleEditSubmit(bvModalEvt) {

      const err_ = this.checkEditFormValidity()

      if (err_.status == false) {
        bvModalEvt.preventDefault()
        return
      } else {
        this.edit_published_statuses_data({
          'name': this.edit_form.name
        })
        // this.$refs['edit_published_statuses_modal'].hide()
        this.edit_published_statuses_modal = false
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
    create_published_statuses(data) {
      this.postAlertStatus(data).then(response => {
        const notification = {
          message: data.name + ' Successfully Saved',
          type: 'success'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
        this.fetchAlertStatuses()
      })
        .catch(() => {
          const notification = {
            message: 'There was an error while saving published_statuses.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertStatuses()
        });
    },
    edit_published_statuses_data(data) {
      this.putAlertStatus(this.edit_form.id, data)
        .then(response => {
          const notification = {
            message: data.name + ' Successfully Updated',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertStatuses()
        })
        .catch(() => {
          const notification = {
            message: 'There was an error Updating AlertStatus.',
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
  