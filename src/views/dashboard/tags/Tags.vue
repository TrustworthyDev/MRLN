<template>
  <b-container class="mt-5">
    <h3>All Tags</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="tags" :perPage="perPage"
      :totalRows="totalRows" :type="type" />
    <b-modal v-model="new_tags_modal" size="lg" ref="tags_modal" no-close-on-backdrop title="Add New Tag"
      @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <b-form v-if="show" ref="tagsForm" @submit.stop.prevent="handleSubmit">
        <b-form-group id="input-group-1" label=" Tag Name:" label-for="input-1" class="mb-3" :state="form_state.name"
          invalid-feedback=" TagName is required">
          <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Enter Tag Name"
            :state="form_state.name" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-1" label="Tag Type:" label-for="input-1" class="mb-3" :state="form_state.type"
          invalid-feedback="Tag Type is required">
          <b-form-input id="input-1" v-model="form.type" type="email" placeholder="Enter Tag Type"
            :state="form_state.type" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal v-model="edit_tags_modal" size="lg" ref="edit_tags_modal" no-close-on-backdrop title="Edit Tag"
      @hidden="reset_edit_Modal" @ok="handle_edit_Ok">
      <b-form v-if="show" ref="tagsForm" @submit.stop.prevent="handleEditSubmit">
        <b-form-group id="input-group-1" label="Tag Name:" label-for="input-1" class="mb-3" :state="edit_form_state.name"
          invalid-feedback=" TagName is required">
          <b-form-input id="input-1" v-model="edit_form.name" type="email" placeholder="Enter Tag Name"
            :state="edit_form_state.name" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-1" label="Tag Type:" label-for="input-1" class="mb-3" :state="edit_form_state.type"
          invalid-feedback=" TagType is required">
          <b-form-input id="input-1" v-model="edit_form.type" type="email" placeholder="Enter Tag Type"
            :state="edit_form_state.type" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { useNewModelStore } from "@/stores/newModel";
import { TagApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
export default {
  name: "Tags",
  components: {
    bs_table,
    header_section,
  },
  mixins: [TagApi],
  data() {
    return {
      button_string: "Add Tags",
      type: "tags",
      form: {
        name: "",
        type: "",
      },
      form_state: {
        name: "",
        type: "",
      },
      edit_form: {
        name: "",
        type: "",
        id: "",
      },
      edit_form_state: {
        name: "",
        type: "",
      },

      show: true,
      isBusy: false,
      new_tags_modal: false,
      edit_tags_modal: false,
      items: [],
      fields: [
        { key: "name", label: "Tag name" },
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
      submitedTag: [],
      editModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      tags: [],
    };
  },
  mounted() {
    this.fetchTags();
    this.$bus.$on("updatePage_tags", this.changePage);
    this.$bus.$on("edit_modal_tags", this.edit_tags);
    this.$bus.$on("delete_modal_tags", this.delete_tags);
    this.$bus.$on("on_search_tags", this.onSearch);
    this.$bus.$on("create_new_model_tags", this.createNewModel);
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
      this.new_tags_modal = !this.new_tags_modal;
    },
    async fetchTags() {
      this.isBusy = true;
      this.tags = [];
      await this.getTagList(this.currentPage, this.filter)
        .then((response) => {
          this.tags = response.data.tags
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all tags! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_tags(item) {
      this.fetchTag(item.id);
    },
    delete_tags(item) {
      this.deleteTag_(item.id);
    },
    deleteTag_(id) {
      this.deleteTag(id)
        .then(response => {
          const notification = {
            message: 'Tag deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchTags();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting Tag.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchTag(id) {
      this.getTag(id)
        .then((response) => {
          this.edit_form.name = response.data.tag.name;
          this.edit_form.id = response.data.tag.id;
          this.edit_form.type = response.data.tag.type;
          this.edit_tags_modal = true;
        })
        .catch(() => {
          const notification = {
            message: "There was an error Fetching Tag.",
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
      this.fetchTags();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchTags();
    },
    checkFormValidity() {
      if (this.form.name == "") {
        this.form_state.name = false;
        return { tag: false, key: " Tag Name" };
      }
      if (this.form.type == "") {
        this.form_state.type = false;
        return { tag: false, key: "Type" };
      } else {
        return { tag: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_form.name == "") {
        this.edit_form_state.name = false;
        return { tag: false, key: " Tag Name" };
      } if (this.edit_form.type == "") {
        this.edit_form_state.type = false;
        return { tag: false, key: "Type" };
      } else {
        return { tag: true };
      }
    },
    resetModal() {
      this.name = "";
      this.form_state.name = null;
      this.form.name = "";
      this.form_state.type = null;
      this.form.type = "";
    },
    reset_edit_Modal() {
      this.edit_form_state.name = null;
      this.edit_form.name = "";
      this.edit_form_state.type = null;
      this.edit_form.type = "";
    },
    handleOk(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.tag == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_tags({
          name: this.form.name,
          type: this.form.type,
        });
        // this.$refs["tags_modal"].hide();
        this.new_tags_modal = false
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.tag == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_tags_data({
          name: this.edit_form.name,
          type: this.edit_form.type,
        });
        this.edit_tags_modal = false
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
    create_tags(data) {
      this.postTag(data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Saved",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchTags();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving tags.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchTags();
        });
    },
    edit_tags_data(data) {
      this.putTag(this.edit_form.id, data)
        .then((response) => {
          const notification = {
            message: data.name + " Successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchTags();
        })
        .catch(() => {
          const notification = {
            message: "There was an error Updating  Tag.",
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
