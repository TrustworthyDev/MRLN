<template>
  <b-container class="mt-5">
    <h3>All Users</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string"
      :hide_button="!hasPermissions(CREATE_USER_REQUIRED_PERMISSION)" />
    <bs_table :busy="isBusy" :currentPage="currentPage" :fields="fields" :items="users" :perPage="perPage"
      :totalRows="totalRows" :type="type" />

    <b-modal id="add_user_modal" v-model="add_user_modal" size="lg" ref="add_user_modal" no-close-on-backdrop
      no-close-on-esc hide-header-close title="Add New User" @show="resetModal" @hidden="resetModal" @ok="add_user_OK">
      <b-form v-if="show" ref="add_user_form">
        <b-form-group id="input-group-1" label="First Name:" label-for="input-1" class="mb-3"
          :state="add_user_form_state.first_name" invalid-feedback="First Name is required">
          <b-form-input id="input-1" v-model="add_user_form.first_name" type="text" placeholder="Enter First Name"
            required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Last Name:" label-for="input-1" class="mb-3"
          :state="add_user_form_state.last_name" invalid-feedback="Last Name is required">
          <b-form-input id="input-1" v-model="add_user_form.last_name" type="text" placeholder="Enter Last Name"
            required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-email" label="Email:" label-for="add-user-email" class="mb-3"
          :state="add_user_form_state.email" invalid-feedback="Email is required">
          <b-form-input id="add-user-email" v-model="add_user_form.email" type="email"
            placeholder="Enter email address of the user">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-password" label="Password:" label-for="add-user-password" class="mb-3"
          :state="add_user_form_state.password" invalid-feedback="Password is required">
          <div class="password-group">
            <div class="control">
              <b-form-input v-if="showPassword" id="add-user-password-show" v-model="add_user_form.password" type="text"
                placeholder="Enter password of the user">
              </b-form-input>
              <b-form-input v-else id="add-user-password-hidden" v-model="add_user_form.password" type="password"
                placeholder="Enter password of the user">
              </b-form-input>
            </div>

            <div class="control">
              <button class="btn btn-sm" @click="toggleShow">
                <vue-feather :type="showPassword ? 'eye' : 'eye-off'"></vue-feather>
              </button>
            </div>
          </div>
        </b-form-group>

        <b-form-group id="input-group-role" label="Role:" label-for="add-user-role" class="mb-3"
          :state="add_user_form_state.role" invalid-feedback="Role is required">
          <v-select v-model="add_user_form.role" :options="userRoles" :push-tags="true" :reduce="(data) => data.id"
            :required="!add_user_form.role" :state="add_user_form_state.role" label="name" />
        </b-form-group>

        <b-form-group id="input-group-licenses" label="License:" label-for="add-user-licenses" class="mb-3"
          :state="add_user_form_state.license" invalid-feedback="License is required">
          <v-select v-model="add_user_form.license" :options="userLicenses" :push-tags="true" :reduce="(data) => data.id"
            :required="!add_user_form.license" :state="add_user_form_state.license" label="name" />
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal id="edit_user_modal" v-model="edit_user_modal" size="lg" ref="edit_user_modal" no-close-on-backdrop
      title="Edit User" @show="resetModal" @hidden="resetModal" @ok="handle_edit_Ok">
      <b-form-group id="input-group-1" label="First Name:" label-for="input-1" class="mb-3"
        :state="edit_user_form_state.first_name" invalid-feedback="First Name is required">
        <b-form-input id="input-1" v-model="edit_user_form.first_name" type="text" placeholder="Enter First Name"
          required></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Last Name:" label-for="input-1" class="mb-3"
        :state="edit_user_form_state.last_name" invalid-feedback="Last Name is required">
        <b-form-input id="input-1" v-model="edit_user_form.last_name" type="text" placeholder="Enter Last Name"
          required></b-form-input>
      </b-form-group>


      <b-form v-if="show" ref="edit_user_form">
        <input type="hidden" v-model="edit_user_form.id" />
        <b-form-group id="input-group-1" label="Email:" label-for="input-1" class="mb-3"
          :state="edit_user_form_state.email" invalid-feedback="Email is required">
          <b-form-input id="input-1" v-model="edit_user_form.email" type="email"
            placeholder="Enter email address of the user" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-password" label="Password:" label-for="add-user-password" class="mb-3"
          :state="edit_user_form_state.password" invalid-feedback="Password is required">
          <div class="password-group">
            <div class="control">
              <b-form-input v-if="showPassword" id="edit-user-password-show" v-model="edit_user_form.password" type="text"
                placeholder="Enter password of the user">
              </b-form-input>
              <b-form-input v-else id="edit-user-password-hidden" v-model="edit_user_form.password" type="password"
                placeholder="Enter password of the user">
              </b-form-input>
            </div>

            <div class="control">
              <button class="btn btn-sm" @click="toggleShow">
                <vue-feather :type="showPassword ? 'eye' : 'eye-off'"></vue-feather>
              </button>
            </div>
          </div>
        </b-form-group>
        <b-form-group id="input_group_edit_role" label="Role:" label-for="edit_user_role" class="mb-3"
          :state="edit_user_form_state.role" invalid-feedback="Role is required">
          <v-select v-model="edit_user_form.role" :options="userRoles" :push-tags="true" :reduce="(data) => data.id"
            :required="!edit_user_form.role" :state="edit_user_form_state.role" label="name" />
        </b-form-group>

        <b-form-group id="input_group_edit_license" label="License:" label-for="edit_user_license" class="mb-3"
          :state="edit_user_form_state.license" invalid-feedback="License is required">
          <v-select v-model="edit_user_form.license" :options="userLicenses" :push-tags="true" :reduce="(data) => data.id"
            :required="!edit_user_form.license" :state="edit_user_form_state.license" label="name" />
        </b-form-group>

      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { useNotificationStore } from "@/stores/notifications";
import { UserRoles } from "@/types/User";
// import { useNewModelStore } from "@/stores/newModel";
import { UsersApi } from "@/api";
import bs_table from "@/components/inner-layouts/table";
import header_section from "@/components/inner-layouts/crud-header-section";
import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

export default {
  name: "ManageUsers",
  components: {
    bs_table,
    header_section,
  },
  mixins: [UsersApi],
  data() {
    return {
      CREATE_USER_REQUIRED_PERMISSION: 'Create a user',
      button_string: "Add User",
      type: "manage_users",
      showPassword: false,
      add_user_form: {
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        license: "",
        password: ""
      },
      add_user_form_state: {
        email: null,
        first_name: "",
        last_name: "",
        role: null,
        license: null,
        password: ""
      },
      edit_user_form: {
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        license: "",
        password: ""
      },
      edit_user_form_state: {
        email: null,
        first_name: "",
        last_name: "",
        role: null,
        license: null,
        password: ""
      },

      show: true,
      isBusy: false,
      add_user_modal: false,
      edit_user_modal: false,
      items: [],
      fields: [
        { key: "email", label: " Email", sortable: true },
        {
          key: "role.name",
          formatter: (value, key, item) => {
            return item?.role?.name;
          }, label: "Role"
        },
        {
          key: "license.name",
          formatter: (value, key, item) => {
            return item?.license?.name;
          },
          label: "License"
        },
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
      userRoles: [],
      userLicenses: [],
      users: [],
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchUserRoles();
    this.fetchUserLicenses();
    this.$bus.$on("updatePage_users", this.changePage);
    this.$bus.$on("edit_modal_user", this.edit_user);
    this.$bus.$on("delete_modal_user", this.delete_user);
    this.$bus.$on("on_search_manage_users", this.onSearch);
    this.$bus.$on("create_new_model_users", this.createNewModel);
  },
  computed: {},
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword
    },
    hasPermissions: function (requiredPermission) {
      const userPermissions = accountStore.getCurrentUser.permissions;
      return userPermissions.includes(`${requiredPermission}`);
    },
    // setIsOpen(payload) {
    //   // parameter type boolean
    //   const newModelStore = useNewModelStore();
    //   newModelStore.setIsOpen(payload);
    // },

    // setModelType(payload) {
    //   // parameter type ModelTypes
    //   const newModelStore = useNewModelStore();
    //   newModelStore.setModelType(payload);
    // },
    createNewModel() {
      this.add_user_modal = !this.add_user_modal;
    },
    fetchUserRoles() {
      this.userRoles = [];
      this.getUserRoles()
        .then((response) => {
          this.userRoles = response.data;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all users roles! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchUserLicenses() {
      this.userLicenses = [];
      this.getUserLicenses()
        .then((response) => {
          this.userLicenses = response.data;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all users licenses! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetchUsers() {
      this.isBusy = true;
      this.users = [];
      this.getUsersList(this.currentPage, this.filter)
        .then((response) => {
          this.users = [];
          this.users.push(...response.data.users);
          this.totalRows = response.data.total_pages * this.perPage;
          this.currentPage = response.data.page;
          this.isBusy = false;
        })
        .catch(() => {
          const notification = {
            message:
              "There was an error fetching all users! Please refresh and try again.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    edit_user(item) {
      this.fetch_user(item.id);
    },
    delete_user(item) {
      this.delete_user_(item.id);
    },
    delete_user_(id) {
      this.deleteUser(id)
        .then(response => {
          const notification = {
            message: 'User deleted.',
            type: 'success'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchUsers();
        })
        .catch(() => {
          const notification = {
            message: 'There was an error deleting User.',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });
    },
    fetch_user(id) {
      this.getUser(id)
        .then((response) => {
          this.edit_user_form.first_name = response.data.user.first_name;
          this.edit_user_form.last_name = response.data.user.last_name;
          this.edit_user_form.email = response.data.user.email;
          this.edit_user_form.password = response.data.user.password || '';
          this.edit_user_form.role = response.data.user.role.id;
          this.edit_user_form.license = response.data.user.license.id;
          this.edit_user_form.id = response.data.user.id;
          this.edit_user_modal = !this.edit_user_modal;
        })
        .catch(() => {
          const notification = {
            message: "There was an error fetching User.",
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
      this.fetchUsers();
    },
    onSearch(value) {
      this.filter = value;
      this.currentPage = 1;
      this.fetchUsers();
    },
    validEmail(e) {
      const filter =
        /^\s*[\w\-+_]+(\.[\w\-+_]+)*@[\w\-+_]+\.[\w\-+_]+(\.[\w\-+_]+)*\s*$/;
      return String(e).search(filter) != -1;
    },
    checkFormValidity() {
      if (this.add_user_form.first_name == "") {
        this.add_user_form_state.first_name = false;
        return { user: false, key: "First Name" };
      }

      if (this.add_user_form.last_name == "") {
        this.add_user_form_state.last_name = false;
        return { user: false, key: "Last Name" };
      }
      if (!this.validEmail(this.add_user_form.email)) {
        this.add_user_form_state.email = false;
        return { user: false, key: "email" };
      }

      if (this.add_user_form.password == "") {
        this.add_user_form_state.password = false;
        return { user: false, key: "Password" };
      }

      if (this.add_user_form.role == "" || this.add_user_form.role == null) {
        this.add_user_form_state.role = false;
        return { user: false, key: "Role" };
      }

      if (this.add_user_form.license == "" || this.add_user_form.license == null) {
        this.add_user_form_state.license = false;
        return { user: false, key: "License" };
      } else {
        return { user: true };
      }
    },
    checkEditFormValidity() {
      if (this.edit_user_form.first_name == "") {
        this.edit_user_form_state.first_name = false;
        return { user: false, key: "First Name" };
      }

      if (this.edit_user_form.last_name == "") {
        this.edit_user_form_state.last_name = false;
        return { user: false, key: "Last Name" };
      }

      if (!this.validEmail(this.edit_user_form.email)) {
        this.edit_user_form_state.email = false;
        return { user: false, key: "email" };
      }

      if (this.edit_user_form.role == "" || this.edit_user_form.role == null) {
        this.edit_user_form_state.role = false;
        return { user: false, key: "Role" };
      }

      if (this.edit_user_form.license == "" || this.edit_user_form.license == null) {
        this.edit_user_form_state.license = false;
        return { user: false, key: "License" };
      } else {
        return { user: true };
      }
    },
    resetModal(evt) {
      this.showPassword = false;
      const current_modal = evt.target;
      const element = current_modal.querySelectorAll(".modal-footer .btn")
      element[1].innerHTML = "Submit"
      element[1].removeAttribute("data-bs-dismiss")
      // const element = current_modal.getElementsByClassName(
      //   "btn btn-primary btn-md btn"
      // )[0];
      // element.innerHTML = "Submit";
      // element.removeAttribute("data-bs-dismiss");
      if (current_modal.id === "add_user_modal") {
        this.add_user_form.email = "";
        this.add_user_form_state.email = null;
      } else if (current_modal.id === "edit_user_modal") {
        // this.edit_user_form.email = "";
        // this.edit_user_form_state.email = null;
      }
    },
    // reset_edit_Modal() {
    //   this.edit_user_form_state.name = null;
    //   this.edit_user_form.name = "";
    // },
    add_user_OK(bvModalEvt) {
      this.handleSubmit(bvModalEvt);
    },
    handle_edit_Ok(bvModalEvt) {
      this.handleEditSubmit(bvModalEvt);
    },
    handleSubmit(bvModalEvt) {
      const err_ = this.checkFormValidity();

      if (err_.user == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.create_user({
          first_name: this.add_user_form.first_name,
          last_name: this.add_user_form.last_name,
          email: this.add_user_form.email,
          role_id: this.add_user_form.role,
          license_id: this.add_user_form.license,
          password: this.add_user_form.password,
        });
        this.add_user_modal = false
        this.add_user_form = {
          email: "",
          first_name: "",
          last_name: "",
          role: null,
          license: null,
          password: ""
        }
      }
    },
    handleEditSubmit(bvModalEvt) {
      const err_ = this.checkEditFormValidity();

      if (err_.user == false) {
        bvModalEvt.preventDefault();
        return;
      } else {
        this.edit_user_data({
          first_name: this.edit_user_form.first_name,
          last_name: this.edit_user_form.last_name,
          id: this.edit_user_form.id,
          email: this.edit_user_form.email,
          password: this.edit_user_form.password,
          role_id: this.edit_user_form.role,
          license_id: this.edit_user_form.license,
        });
        this.edit_user_modal = false
        this.edit_user_form = {
          id: "",
          email: "",
          first_name: "",
          last_name: "",
          role: null,
          license: null,
          password: ""
        }
      }
    },
    create_user(data) {
      this.postUser(data)
        .then((response) => {
          const notification = {
            message: data.email + " user created successfully",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchUsers();
        })
        .catch(() => {
          const notification = {
            message: "There was an error while saving User.",
            type: "danger",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchUsers();
        });
    },
    edit_user_data(data) {
      this.putUser(this.edit_user_form.id, data)
        .then((response) => {
          const notification = {
            message: data.email + " successfully Updated",
            type: "success",
          };
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
          this.fetchUsers();
        })
        .catch(() => {
          const notification = {
            message: "There was an error in updating the user",
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

.control .btn:active {
  border: 0;
  border-color: transparent;
}

.password-group {
  position: relative;
  display: flex;
}

.password-group .control:first-of-type {
  width: 100%;
}

.password-group .control:last-of-type {
  position: absolute;
  right: 0.2rem;
}

.password-group .control .vue-feather {
  width: 1.2rem;
  padding-top: 0.4rem;
}
</style>
