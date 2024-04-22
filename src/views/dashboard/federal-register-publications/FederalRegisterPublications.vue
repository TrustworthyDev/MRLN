<template>
  <div class="container mt-5">
    <h3>All Federal Register Publications</h3>

    <div>
      <button class="btn btn-primary btn-sm mb-3" @click="createNewModel">New Federal Register Publication</button>
      <div class="keyword-container">
        <table class="table table-hover table-bordered">
          <thead>
          <tr>
            <th>Name</th>
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="federalRegisterPublication in getFederalRegisterPublications" :key="federalRegisterPublication.id">
            <data-row  :data-row="federalRegisterPublication"
                      :model-type="modelType"/>
          </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useKeywordStore } from "@/stores/keywords";
import { useNewModelStore } from "@/stores/newModel";
import {ModelTypes} from "@/types/ModelTypes";
import DataRow from "@/components/articles/data-row/DataRow.vue";

export default {
  name: "FederalRegisterPublications",
  components: {
    DataRow
  },

  data() {
    return {
      modelType: ModelTypes.federal_register_publication
    }
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
      this.setIsOpen(true);
      this.setModelType(ModelTypes.federal_register_publication);
    }

  },

  computed: {
    getFederalRegisterPublications() {

      const keyWordStore = useKeywordStore();
      return keyWordStore.getFederalRegisterPublications;
    },
  },

  created() {
    const keyWordStore = useKeywordStore();
    keyWordStore.fetchAllFederalRegisterPublications();
  }

}
</script>

<style lang="scss" scoped>
.keyword-container {
  background-color: white;
}
</style>
