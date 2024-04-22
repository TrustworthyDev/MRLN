<template>
    <input class="cell-time-editor-custom" type="text" v-model="value" :placeholder="value" ref="flatpickrInput" />
</template>

<script>
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { nextTick } from 'vue';

export default {
    data() {
        return {
            value: null
        };
    },
    methods: {
        getValue() {
            return this.value;
        },
    },
    mounted() {
        this.value = this.params.value;
        flatpickr(this.$refs.flatpickrInput, {
            enableTime: true,
            noCalendar: true,
            enableSeconds: false,
            defaultDate: this.value,
            time_24hr: false,
            dateFormat: 'h:i K',
            onChange: (selectedDates, dateString) => {
                this.value = dateString;
            },
        });

        nextTick(() => {
            this.$refs.container.focus();
        });
    }
};
</script>
  
<style>
.cell-time-editor-custom {
    height: 100% !important;
    border: none !important;
}
</style>