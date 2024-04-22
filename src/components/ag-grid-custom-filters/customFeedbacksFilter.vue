<template>
  <div></div>
</template>

<script>
export default {
  data: function () {
    return {
      filterModel: {
        filterType: "feedback",
        type: "equals",
        status: "New"
      }
    };
  },
  mounted() {
  },
  methods: {
    updateFilter() {
      this.params.filterChangedCallback();
    },

    getModel() {
      return this.filterModel;
    },

    setModel(model) {
      if (model == null) {
        this.filterModel = null;
      } else {
        this.filterModel = {
          filterType: "feedback",
          type: "equals",
          status: "New"
        };
      }
    },

    resetModel() {
      this.filterModel = {
        filterType: "feedback",
        type: "equals",
        status: "New"
      };
    }
  },
}
</script>

<style>
</style>