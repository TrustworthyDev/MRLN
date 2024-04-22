<template>
  <b-container class="mt-5">
    <h3>All Sector Types</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="sector_types" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_sector_types_modal" size="lg" ref="sector_types_modal" no-close-on-backdrop
      title="Add New Sector Type" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="sector_typesForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" Sector Type Name:" label-for="input-1" class="mb-3"
          :state="form_state.name" invalid-feedback=" Sector TypeName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter SectorType Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_sector_types_modal" size="lg" ref="edit_sector_types_modal" no-close-on-backdrop
      title="Edit Sector Type" @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="sector_typesForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Sector Type Name:" label-for="input-1" class="mb-3"
          :state="edit_form_state.name" invalid-feedback=" Sector TypeName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter SectorType Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
// import {DeleteIcon, Edit3Icon, PlusIcon} from 'vue-feather-icons';
// import store from "../../../store";
// import {mapActions} from "vuex";
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { SectorTypeApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
// import { EventBus } from "../../../eventBus/eventBus";
export default {
  name: "sectorTypes",
  components: {
    // Edit3Icon,
    // PlusIcon,
    // DeleteIcon,
    bs_table,
    header_section,
  },
  mixins: [SectorTypeApi],
  data() {
    return {
      button_string: "Add SectorTypes",
      type: "sector_types",
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
      new_sector_types_modal: false,
      edit_sector_types_modal: false,
      items: [],
      fields: [
        { key: "name", label: "SectorType name" },
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
      submitedSector_Type: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      sector_types: [],
    };
  },
  mounted() {
    this.fetchAlertTypes();
    this.$bus.$on("updatePage_sector_types", this.changePage);
    this.$bus.$on("edit_modal_sector_types", this.edit_sector_types);
    this.$bus.$on("delete_modal_sector_types", this.delete_sector_types);
    this.$bus.$on("on_search_sector_types", this.onSearch);
    this.$bus.$on("create_new_model_sector_types", this.createNewModel);
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
      this.new_sector_types_modal = !this.new_sector_types_modal;
    },
    async fetchAlertTypes() {
      this.isBusy = true;
      this.sector_types = [];
      await this.getSectorTypesList(this.currentPage, this.filter)
        .then((response) => {
          this.sector_types = response.data.sectortypes
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all sector_types! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_sector_types(item) {
      this.fetchSector_Type(item.id);
    },
    delete_sector_types(item) {
      this.deleteSector_Type_(item.id);
    },
    deleteSector_Type_(id) {
      this.deleteSectorType(id)
        .then(response => {
          const notification = {
            message: 'Sector Type deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Sector Type.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchSector_Type(id) {
      this.getSectorType(id)
        .then((response) => {
          this.edit_form.name = response.data.sectortype.name;
          this.edit_form.id = response.data.sectortype.id;
          this.edit_sector_types_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Sector_Type.",
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
      this.fetchAlertTypes();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchAlertTypes();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { status: false, key: " Sector Type Name" };
      }
      if (this.form.selected_countries == "") {
        this.form_state.selected_countries = false;
        return { status: false, key: "Countries" };
      } else {
        return { status: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { status: false, key: " Sector Type Name" };
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
        this.create_sector_types({
          sector_types_name: this.form.name,
        });
        // this.$refs["sector_types_modal"].hide();
        this.new_sector_types_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.status == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_sector_types_data({
          sector_types_name: this.edit_form.name,
        });
        // this.$refs["edit_sector_types_modal"].hide();
        this.edit_sector_types_modal = false
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
    create_sector_types(data) {
      this.postSectorType(data)
        .then((response) => {
          const notification = {
            message: data.sector_types_name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving sector_types.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes();
        });
    },
    edit_sector_types_data(data) {
      this.putSectorType(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.sector_types_name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchAlertTypes();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  Sector Type.",
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
