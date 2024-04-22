<template>
    <b-modal :ref="`edit-${modalTitle}-modal`" v-model="modal" no-close-on-backdrop size="lg"
        :title="`Edit ${capitalize(modalTitle)}`" @hidden="reset" @ok="handleOk">

        <template v-if="typeInput == 'dropdown' && Object.keys(dataInput).length == 0">
            <b-form-group id="input-group-2" :state="stateValue" class="mb-3" :invalid-feedback="invalidFeedback"
                :label="`Select ${capitalize(modalTitle)}:`" label-for="input-2">
                <v-select v-model="value" :options="listenOptions" :push-tags="true" :reduce="(data) => data.id || data"
                    :required="!value" :state="stateValue" label="name" :multiple="isMultipleSelect" />
            </b-form-group>
        </template>

        <template v-else-if="typeInput == 'text-input'">
            <b-form-input id="arcticle-input" debounce="0" :placeholder="modalTitle" type="search" v-model="value"
                :required="!value" @keyup.enter="handleOk">
            </b-form-input>
        </template>

        <template v-else-if="typeInput == 'text-area'">
            <b-form-textarea id="textarea" :placeholder="modalTitle" v-model="value" :required="!value"
                @keyup.enter="handleOk" max-rows="15" rows="3"></b-form-textarea>
        </template>

    </b-modal>
</template>

<script>
export default {
    name: "articles-modal",
    props: {
        isMultipleSelect: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String,
            default: ""
        },
        dataInputModal: {
            type: Object,
            // eslint-disable-next-line
            default: {}
        },
        options: {
            type: [Array],
            // eslint-disable-next-line
            default: []
        },
        invalidFeedback: {
            type: String,
            default: ""
        },
        typeInput: {
            type: String,
            default: ""
        }
    },
    computed: {
        listenOptions() {
            return this.options
        },
        listenDataInputModal() {
            return this.dataInputModal
        }
    },
    data() {
        return {
            modal: false,
            dataInput: {},
            value: "",
            stateValue: ""
        }
    },
    methods: {
        initialize() {
            if (Object.keys(this.dataInputModal).length > 0) {
                this.value = this.dataInputModal['value']
                this.stateValue = this.dataInputModal['value']
            } else {
                this.value = this.dataInputModal
                this.stateValue = this.dataInputModal
            }
        },
        capitalize(str) {
            if (!str) return
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        openModal() {
            this.initialize()
            this.modal = true
        },
        handleOk() {
            if (JSON.stringify(this.dataInputModal.value) == JSON.stringify(this.value)) {
                this.reset();
                return;
            }
            const dataCol = Object.assign({}, this.dataInputModal['data'])
            const data = {
                value: this.value,
                field: this.dataInputModal['field'],
                colId: this.dataInputModal['colId'],
                id: dataCol['id']
            }

            this.modal = !this.modal
            this.$emit('submit', data)
        },
        reset() {
            this.modal = false
            this.value = ""
            this.stateValue = ""
            this.dataInput = {}
            this.$emit('reset')
        }
    }
}
</script>

<style lang="scss">
</style>