<template>
  <div>
    <b-card class="shadow-lg p-3 mb-1 bg-white rounded">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="row">
            <div class="col-md-5 col-sm-12 text-center">
              <button v-if="!hide_button" class="btn btn-primary btn-sm mb-3 btn-block" style="width: 100%"
                @click="createNewModel">
                <vue-feather type="plus"></vue-feather>
                <span>{{ button_string }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <b-form-input id="filter-input" debounce="0" placeholder="Type to Search" type="search"
            @input="onSearch"></b-form-input>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "agencies_header_section",
  components: {},
  props: ["filter", "type", "button_string", "hide_button"],
  methods: {
    onSearch(value) {
      console.debug(value);
      if (this.type === "agencies") {
        this.$bus.$emit("on_search_agency", value);
      } else if (this.type === "alert_types") {
        this.$bus.$emit("on_search_alert_types", value);
      } else if (this.type === "sector_types") {
        this.$bus.$emit("on_search_sector_types", value);
      } else if (this.type === "manage_users") {
        this.$bus.$emit("on_search_manage_users", value);
      } else if (this.type === "statuses") {
        this.$bus.$emit("on_search_statuses", value);
      } else if (this.type === "classifications") {
        this.$bus.$emit("on_search_classifications", value);
      } else if (this.type === "filingTypes") {
        this.$bus.$emit("on_search_filingTypes", value);
      } else if (this.type === "tags") {
        this.$bus.$emit("on_search_tags", value);
      } else if (this.type === "subTypeClassifications") {
        this.$bus.$emit("on_search_subTypeClassifications", value);
      } else if (this.type === "states") {
        this.$bus.$emit("on_search_states", value);
      } else if (this.type === "articleTypes") {
        this.$bus.$emit("on_search_articleTypes", value);
      } else if (this.type === "docketFileNumbers") {
        this.$bus.$emit("on_search_docketFileNumbers", value);
      } else if (this.type === "orderNotices") {
        this.$bus.$emit("on_search_orderNotices", value);
      } else if (this.type === "secReleaseNumbers") {
        this.$bus.$emit("on_search_secReleaseNumbers", value);
      } else if (this.type === "higherLevelAlertClassifications") {
        this.$bus.$emit("on_search_higherLevelAlertClassifications", value);
      } else if (this.type === "published_statuses") {
        this.$bus.$emit("on_search_alert_statuses", value);
      } else if (this.type === "rules") {
        this.$bus.$emit("on_search_rules", value);
      }
    },
    createNewModel(value) {
      console.debug(value);
      if (this.type === "agencies") {
        this.$bus.$emit("create_new_model_agency", value);
      } else if (this.type === "alert_types") {
        this.$bus.$emit("create_new_model_alert_types", value);
      } else if (this.type === "sector_types") {
        this.$bus.$emit("create_new_model_sector_types", value);
      } else if (this.type === "manage_users") {
        this.$bus.$emit("create_new_model_users", value);
      } else if (this.type === "statuses") {
        this.$bus.$emit("create_new_model_statuses", value);
      } else if (this.type === "classifications") {
        this.$bus.$emit("create_new_model_classifications", value);
      } else if (this.type === "filingTypes") {
        this.$bus.$emit("create_new_model_filingTypes", value);
      } else if (this.type === "tags") {
        this.$bus.$emit("create_new_model_tags", value);
      } else if (this.type === "subTypeClassifications") {
        this.$bus.$emit("create_new_model_subTypeClassifications", value);
      } else if (this.type === "states") {
        this.$bus.$emit("create_new_model_states", value);
      } else if (this.type === "articleTypes") {
        this.$bus.$emit("create_new_model_articleTypes", value);
      } else if (this.type === "docketFileNumbers") {
        this.$bus.$emit("create_new_model_docketFileNumbers", value);
      } else if (this.type === "orderNotices") {
        this.$bus.$emit("create_new_model_orderNotices", value);
      } else if (this.type === "secReleaseNumbers") {
        this.$bus.$emit("create_new_model_secReleaseNumbers", value);
      } else if (this.type === "higherLevelAlertClassifications") {
        this.$bus.$emit("create_new_model_higherLevelAlertClassifications", value);
      } else if (this.type === "published_statuses") {
        this.$bus.$emit("create_new_model_alert_statuses", value);
      } else if (this.type === "rules") {
        this.$bus.$emit("create_new_model_rules", value);
      }
    },
  },
};
</script>

<style scoped></style>
