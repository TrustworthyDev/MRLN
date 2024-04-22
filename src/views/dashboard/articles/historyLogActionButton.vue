<template>
    <span>
        <button class="btn btn-success btn-sm hitoryLogBtn" @click="buttonClicked()">
            History Logs
            <i class="fa fa-history" aria-hidden="true"></i>
        </button>
        <button class="btn btn-success btn-sm hitoryLogBtn" style="margin-left: .5rem;" @click="buttonFeedback()">
            Feedback
            <i class="fa fa-book" aria-hidden="true"></i>
        </button>
    </span>
</template>

<script>
export default {
    data: function () {

        return {
            cellValue: null
        };
    },
    beforeMount() {
        this.cellValue = this.params.data;
    },
    methods: {
        buttonClicked() {
            this.$bus.$emit('showHistoryModal', this.cellValue.id);
        },
        buttonFeedback() {
            this.$bus.$emit('showFeedback', { id: this.cellValue.id, title: this.cellValue.title });
        }
    }
}
</script>
<style>
.hitoryLogBtn {
    margin: 0 auto 0.5rem;
}
</style>
