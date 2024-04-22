<template>
    <div>
      <ul>
        <li v-for="historyItem in historyData" :key="historyItem.id">
          {{ historyItem.created_at }} applied at {{ historyItem.applied_by }} on {{ historyItem.targeted_article }}
          <b-button variant="danger" size="sm" @click="revert(historyItem)">Revert</b-button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, defineProps } from 'vue';
  
  export default {
    props: {
      historyData: {
        type: Array,
        required: true,
      },
    },
    setup(props) {
      const revertHistory = (historyItem) => {
        // Emit an event to the parent component to handle the revert action
        // You can also directly call a method if needed
        emit('revertHistory', historyItem);
      };
  
      return {
        revertHistory,
      };
    },
  };
  </script>