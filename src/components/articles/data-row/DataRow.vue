<template>
  <tr>
    <td>
      <span v-if="!isEditing">{{ dataRow.name }}</span>
      <div v-else>
        <input v-model="value" class="form-control form-control-sm" maxlength="165" minlength="3" required type="text">
        <p v-if="value.trim().length <= 0" class="m-0 small text-danger">The field cannot be blank!</p>
      </div>
    </td>
    <td class="text-center align-items-center" style="width: 20px;">
      <span class="icon-btn">
        <vue-feather type="edit-3" v-if="!isEditing" @click="isEditing=true"></vue-feather>
        <vue-feather type="check" v-else @click="updateDataItem"></vue-feather>
      </span>
    </td>
  </tr>
</template>

<script>
import Vue from 'vue';
import {UpdateModel} from '@/types/ModelTypes';

export default {
  name: "DataRow",
  components: {
  },

  data() {
    return {
      isEditing: false,
      value: ''
    }
  },

  methods: {

    // Updates the value of the data row in the database
    updateDataItem() {
      if (this.value.trim().length <= 0) return;

      const model = {
        id: this.dataRow.id,
        name: this.value,
        model: this.modelType
      };
      this.$store.dispatch('keywords/updateModel', model);
      this.isEditing = false;
    }

  },

  props: {
    dataRow: Object,
    modelType: String
  },

  created() {
    this.value = this.dataRow.name;
  }

};
</script>

<style lang="scss" scoped>
.icon-btn {
  svg {
    stroke: #4e4e4e;
    cursor: pointer;

    &:hover {
      stroke: #707070;
    }
  }
}
</style>
