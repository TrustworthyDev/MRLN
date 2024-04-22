<template>
  <tr>
    <td>
      <span v-if="!isEditing">{{ dataRow.find_keyword }}</span>
      <input v-else v-model="findValue" class="form-control form-control-sm" maxlength="165" minlength="3" required
        type="text">
    </td>
    <td>
      <span v-if="!isEditing">{{ dataRow.replace_keyword }}</span>
      <input v-else v-model="replaceValue" class="form-control form-control-sm" maxlength="165" minlength="3" required
        type="text">
    </td>
    <td class="text-center icon-btn" style="width: 20px;">
      <span class="d-flex align-items-center">
        <vue-feather type="edit-3" v-if="!isEditing" @click="isEditing = true"></vue-feather>

        <span v-else class="d-flex align-items-center">
          <span @click="updateDataItem">
            <vue-feather type="check"></vue-feather>
          </span>
          <span @click="removeDataItem">
            <vue-feather type="trash"></vue-feather>
          </span>
        </span>
      </span>
    </td>
  </tr>
</template>

<script>
import { FindAndReplaceMethodType } from "@/types/FindAndReplace";
import { useKeywordStore } from "@/stores/keywords";

export default {
  name: "FindReplaceRow",

  components: {
  },

  data() {
    return {
      isEditing: false,
      findValue: '',
      replaceValue: '',
    }
  },

  methods: {

    // Updates the value of the data row in the database
    updateDataItem() {
      const currentItem = {
        id: this.dataRow.id,
        find_keyword: this.findValue,
        replace_keyword: this.replaceValue,
        method_type: FindAndReplaceMethodType.update
      }

      const keyWordStore = useKeywordStore();
      keyWordStore.updateFindAndReplaceKeyword(currentItem);
      this.isEditing = false;
    },

    // Removes the find and replace instance from the database
    removeDataItem() {
      const currentItem = {
        id: this.dataRow.id,
        find_keyword: this.findValue,
        replace_keyword: this.replaceValue,
        method_type: FindAndReplaceMethodType.delete
      }

      const keyWordStore = useKeywordStore();
      keyWordStore.updateFindAndReplaceKeyword(currentItem);
      this.isEditing = false;
    }

  },

  props: {
    dataRow: Object,
    modelType: String
  },

  created() {
    this.findValue = this.dataRow.find_keyword;
    this.replaceValue = this.dataRow.replace_keyword;
  }
}
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
