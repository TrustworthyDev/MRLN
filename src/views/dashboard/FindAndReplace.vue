<template>
  <div class="container mt-5">
    <h3>All Find & Replace Keywords</h3>

    <div class="keyword-container">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>Find</th>
            <th>Replace</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="findAndReplace in getFindAndReplace" :key="findAndReplace.id">
            <find-replace-row :data-row="findAndReplace" />
          </template>

          <tr>
            <td>
              <input v-model="findKeyword" class="form-control form-control-sm" placeholder="Find keyword..." required
                type="text">
            </td>
            <td>
              <input v-model="replaceKeyword" class="form-control form-control-sm" placeholder="Replace with..."
                type="text">
            </td>
            <td class="text-center align-items-center icon-btn" style="width: 20px;">
              <vue-feather type="plus" @click="createNewKeywords"></vue-feather>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DataRow from "@/components/articles/data-row/DataRow.vue";
import FindReplaceRow from "@/components/articles/data-row/FindReplaceRow.vue";
import { FindAndReplaceMethodType, FindAndReplaceRequest } from "@/types/FindAndReplace";
import { useKeywordStore } from "@/stores/keywords";

export default {
  name: "FindAndReplace",

  components: {
    FindReplaceRow,
    DataRow,
  },

  computed: {
    getFindAndReplace() {

      const keyWordStore = useKeywordStore();
      return keyWordStore.getFindAndReplace;
    },
  },

  data() {
    return {
      findKeyword: '',
      replaceKeyword: ''
    }
  },

  methods: {

    createNewKeywords() {
      const newItem = {
        id: 0,
        find_keyword: this.findKeyword,
        replace_keyword: this.replaceKeyword,
        method_type: FindAndReplaceMethodType.create
      }
      const keyWordStore = useKeywordStore();
      keyWordStore.updateFindAndReplaceKeyword(newItem);
      this.findKeyword = '';
      this.replaceKeyword = '';
    }

  },

  created() {
    const keyWordStore = useKeywordStore();
    keyWordStore.fetchFindAndReplace();
  }

}
</script>

<style lang="scss" scoped>
.keyword-container {
  background-color: white;
}

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
