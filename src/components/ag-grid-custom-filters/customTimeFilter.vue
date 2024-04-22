<template>
  <div class="custom-filter-wrapper-div">
    <select class="condition-dropdown" v-model="selectedType" v-on:change="updateFilter()">
      <option v-for="option in comparisonTypeOptions" :value="option.value" :key="option.value">{{ option.label }}
      </option>
    </select>

    <input type="text" placeholder="HH:mm" ref="flatpickrInput" v-on:input="updateFilter()" />
  </div>
</template>

<script>
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

export default {
  data: function () {
    return {
      selectedTime: null,
      selectedType: 'equals',
      comparisonTypeOptions: [{ value: 'equals', label: 'Equals' }, { value: 'greaterThan', label: 'Greater than' }, { value: 'lessThan', label: 'Less than' }]
    };
  },
  mounted() {
    flatpickr(this.$refs.flatpickrInput, {
      enableTime: true,
      noCalendar: true,
      enableSeconds: false,
      time_24hr: false,
      dateFormat: 'h:i K',
      onChange: (selectedDates, dateString) => {
        this.selectedTime = dateString;
      },
    });
  },
  methods: {
    updateFilter() {
      this.params.filterChangedCallback();
    },

    doesFilterPass(params) {
      // Implement your custom filter logic here
      // Compare params.data against this.selectedTime
      // Return true if it passes the filter, otherwise return false
    },

    isFilterActive() {
      return this.selectedTime !== null;
    },

    getModel() {
      return {
        time: this.selectedTime,
        type: this.selectedType,
        filterType: "time"
      };
    },

    setModel(model) {
      this.selectedTime = model.time || null;
    }
  },
}
</script>

<style>
.custom-filter-wrapper-div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px;
}

.condition-dropdown,
.flatpickr-input {
  border: 1px solid;
  border-color: var(--ag-border-color);
  border-radius: 5px;
  height: 25px !important;
  padding-left: 5px;
}


.condition-dropdown:focus,
.flatpickr-input:focus {
  outline: none;
  box-shadow: var(--ag-input-focus-box-shadow);
  border-color: var(--ag-input-focus-border-color);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
}
</style>