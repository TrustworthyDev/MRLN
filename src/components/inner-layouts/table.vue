<template>
  <!-- {{busy}} - {{currentPage}} - {{fields}} - {{items}} - {{perPage}} - {{ totalRows }} -->
  <div v-if="items">
    <b-table :busy="busy" :fields="fields" :items="listenItems" :per-page="perPage" show-empty
      small striped sticky-header>
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template #cell(actions)="row">
        <b-button class="mr-4" size="sm" variant="primary" @click="edit_record(row.item, row.index, $event.target)">
          <vue-feather type="edit-3"></vue-feather>
        </b-button>

        <b-button class="ml-4" size="sm" variant="danger" @click="delete_record(row.item, row.index, $event.target)">
          <vue-feather type="trash-2"></vue-feather>
        </b-button>

      </template>
    </b-table>
    <div v-if="items.length > 0" class="mt-3">
      <b-pagination v-model="mutableCurrentPage" :per-page="perPage" :total-rows="totalRows" align="right"
      @page-click="triggerPageChange"></b-pagination>
    </div>
  </div>
</template>



<script>
import { isProxy, toRaw } from 'vue';
import { showConfirmationAlert } from "@/helpers/SweetAlert";

export default {
  name: "table_component",
  props: [
    "items",
    "fields",
    "currentPage",
    "perPage",
    "busy",
    "totalRows",
    "type",
  ],
  data: function () {
    return {
      mutableCurrentPage: this.currentPage,
    };
  },
  computed: {
    listenItems() {
      let rawData = this.items;
      if (isProxy(this.items)) {
        rawData = toRaw(this.items)
      }
      return rawData
    }
  },
  components: {},
  methods: {
    triggerPageChange(event, value) {
      if (this.type === "agencies") {
        this.$bus.$emit("updatePage_agency", value);
      } else if (this.type === "alert_types") {
        this.$bus.$emit("updatePage_alert_types", value);
      } else if (this.type === "sector_types") {
        this.$bus.$emit("updatePage_sector_types", value);
      } else if (this.type === "manage_users") {
        this.$bus.$emit("updatePage_users", value);
      } else if (this.type === "statuses") {
        this.$bus.$emit("updatePage_statuses", value);
      } else if (this.type === "classifications") {
        this.$bus.$emit("updatePage_classifications", value);
      } else if (this.type === "filingTypes") {
        this.$bus.$emit("updatePage_filingTypes", value);
      } else if (this.type === "tags") {
        this.$bus.$emit("updatePage_tags", value);
      } else if (this.type === "subTypeClassifications") {
        this.$bus.$emit("updatePage_subTypeClassifications", value);
      } else if (this.type === "states") {
        this.$bus.$emit("updatePage_states", value);
      } else if (this.type === "articleTypes") {
        this.$bus.$emit("updatePage_articleTypes", value);
      } else if (this.type === "docketFileNumbers") {
        this.$bus.$emit("updatePage_docketFileNumbers", value);
      } else if (this.type === "orderNotices") {
        this.$bus.$emit("updatePage_orderNotices", value);
      } else if (this.type === "secReleaseNumbers") {
        this.$bus.$emit("updatePage_secReleaseNumbers", value);
      } else if (this.type === "higherLevelAlertClassifications") {
        this.$bus.$emit("updatePage_higherLevelAlertClassifications", value);
      } else if (this.type === "published_statuses") {
        this.$bus.$emit("updatePage_alert_statuses", value);
      }
    },
    edit_record(value) {
      if (this.type === "agencies") {
        this.$bus.$emit("edit_modal_agency", value);
      } else if (this.type === "alert_types") {
        this.$bus.$emit("edit_modal_alert_types", value);
      } else if (this.type === "sector_types") {
        this.$bus.$emit("edit_modal_sector_types", value);
      } else if (this.type === "manage_users") {
        this.$bus.$emit("edit_modal_user", value);
      } else if (this.type === "statuses") {
        this.$bus.$emit("edit_modal_statuses", value);
      } else if (this.type === "classifications") {
        this.$bus.$emit("edit_modal_classifications", value);
      } else if (this.type === "filingTypes") {
        this.$bus.$emit("edit_modal_filingTypes", value);
      } else if (this.type === "tags") {
        this.$bus.$emit("edit_modal_tags", value);
      } else if (this.type === "subTypeClassifications") {
        this.$bus.$emit("edit_modal_subTypeClassifications", value);
      } else if (this.type === "states") {
        this.$bus.$emit("edit_modal_states", value);
      } else if (this.type === "articleTypes") {
        this.$bus.$emit("edit_modal_articleTypes", value);
      } else if (this.type === "docketFileNumbers") {
        this.$bus.$emit("edit_modal_docketFileNumbers", value);
      } else if (this.type === "orderNotices") {
        this.$bus.$emit("edit_modal_orderNotices", value);
      } else if (this.type === "secReleaseNumbers") {
        this.$bus.$emit("edit_modal_secReleaseNumbers", value);
      } else if (this.type === "higherLevelAlertClassifications") {
        this.$bus.$emit("edit_modal_higherLevelAlertClassifications", value);
      } else if (this.type === "published_statuses") {
        this.$bus.$emit("edit_modal_alert_statuses", value);
      }
    },
    async delete_record(value) {
      const result = await showConfirmationAlert(
        "Confirm",
        "Do you want to delete this item?"
      );
      if (result.isConfirmed) {
        this.delete_record_(value);
      }
    },

    delete_record_(value) {
      if (this.type === "agencies") {
        this.$bus.$emit("delete_modal_agency", value);
      } else if (this.type === "alert_types") {
        this.$bus.$emit("delete_modal_alert_types", value);
      } else if (this.type === "sector_types") {
        this.$bus.$emit("delete_modal_sector_types", value);
      } else if (this.type === "manage_users") {
        this.$bus.$emit("delete_modal_user", value);
      } else if (this.type === "statuses") {
        this.$bus.$emit("delete_modal_statuses", value);
      } else if (this.type === "classifications") {
        this.$bus.$emit("delete_modal_classifications", value);
      } else if (this.type === "filingTypes") {
        this.$bus.$emit("delete_modal_filingTypes", value);
      } else if (this.type === "tags") {
        this.$bus.$emit("delete_modal_tags", value);
      } else if (this.type === "subTypeClassifications") {
        this.$bus.$emit("delete_modal_subTypeClassifications", value);
      } else if (this.type === "states") {
        this.$bus.$emit("delete_modal_states", value);
      } else if (this.type === "articleTypes") {
        this.$bus.$emit("delete_modal_articleTypes", value);
      } else if (this.type === "docketFileNumbers") {
        this.$bus.$emit("delete_modal_docketFileNumbers", value);
      } else if (this.type === "orderNotices") {
        this.$bus.$emit("delete_modal_orderNotices", value);
      } else if (this.type === "secReleaseNumbers") {
        this.$bus.$emit("delete_modal_secReleaseNumbers", value);
      } else if (this.type === "higherLevelAlertClassifications") {
        this.$bus.$emit("delete_modal_higherLevelAlertClassifications", value);
      } else if (this.type === "published_statuses") {
        this.$bus.$emit("delete_modal_alert_statuses", value);
      }
    }
  },
};
</script>

<style scoped></style>
