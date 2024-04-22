<template>
  <div class="container" style="margin-top: 2px;">
    <div style="display: flex; justify-content: flex-end;">
      <button @click="goBack" class="btn btn-secondary">Back</button>
    </div>
    <div class="card" style="margin-top: 5px;">
      <div class="card-body">
        <label class="small text-dark" for="name">Rule Name</label>
        <input id="name" v-model="rule_name" class="form-control form-control-sm" placeholder="Name..." type="text">
        <br>

        <div class="row">
          <div class="col-md-4">
            <label>
              <input type="radio" v-model="selection" value="findReplace">
              Find and Replace
            </label>
          </div>
          <div class="col-md-4">
            <div class="radio">
              <label>
                <input type="radio" v-model="selection" value="addRelation">
                Add Relation
              </label>
            </div>
          </div>
          <div class="col-md-4">
            <div class="radio">
              <label>
                <input type="radio" v-model="selection" value="removeRelation">
                Remove Relation
              </label>
            </div>
          </div>
        </div>
        <div class="row" v-if="selection === 'findReplace'">
          <div class="col-md-12">
            <label>Target Column:</label>
            <Multiselect v-model="target_column" :options="getOptions()" mode="tags" :searchable="true" />
          </div>
        </div>
        <div class="row" v-if="selection == 'addRelation' || selection == 'removeRelation'">
          <div class="col-md-12">
            <label>Target Column:</label>
            <Multiselect v-model="target_column" :options="getOptionsm2m()" :searchable="true" />
          </div>
          <div class="col-md-12" v-if="typeof (target_column) == 'string'">
            <label>Target Value:</label>
            <Multiselect v-model="target_value" :options="returnValueOptionsForGrid(target_column)" mode="tags"
              :searchable="true" />
          </div>
        </div>
        <div v-if="selection === 'findReplace'">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="findInput">Find:</label>
                <input type="text" v-model="newEntry.find" id="findInput" class="form-control" whitespace>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="replaceInput">Replace With:</label>
                <input type="text" v-model="newEntry.replace" id="replaceInput" class="form-control" whitespace>
              </div>
            </div>
          </div>


          <button @click="addEntry" class="btn btn-primary" style="margin-top: 5px;">Add Entry</button>
          <table v-if="selection === 'findReplace' && (tableData.length > 0)" class="table">
            <thead>
              <tr>
                <th>Find</th>
                <th>Replace With</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in tableData" :key="index">
                <td>
                  <span v-if="!entry.editing">{{ entry.find }}</span>
                  <input v-else type="text" v-model="entry.find" class="form-control">
                </td>
                <td>
                  <span v-if="!entry.editing">{{ entry.replace }}</span>
                  <input v-else type="text" v-model="entry.replace" class="form-control">
                </td>
                <td>
                  <button v-if="!entry.editing" style="margin-left: 2px;" @click="editEntry(index)"
                    class="btn btn-primary">Edit</button>
                  <button v-else style="margin-left: 2px;" @click="saveEntry(index)" class="btn btn-success">Save</button>
                  <button @click="removeEntry(index)" style="margin-left: 2px;" class="btn btn-danger">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-top:20px" v-if="selection">
          <div>Add Search Criteria</div>
          <InputSwitch v-model="add_criteria" />
        </div>

        <div class="add_criteria" v-if="add_criteria">
          <div class="form-group">
            <div class="row">
              <div class="col-md-9">
                <label for="selectProperty">Select Criteria:</label>
                <select v-model="selectedProperty" class="form-control" id="selectProperty">
                  <option v-for="property in selectableProperties" :value="property" :key="property">
                    {{ property.property_visible_name }} ({{ property.property_relation }})
                  </option>
                </select>
              </div>
              <div class="col-md-3" style="margin-top: 20px;">
                <button @click="addFormElement(selectedProperty)" :disabled="disableSelectedProperty"
                  class="btn btn-primary py-2">Add</button>
              </div>
            </div>


          </div>

          <div v-for="(formElement, index) in formElements" :key="index" style="margin-top:10px">
            <h4>{{ formElement.property_visible_name }}</h4>

            <div class="form-check">
              <input type="radio" v-model="formElement.level" value="must" :id="'levelMust' + index"
                class="form-check-input">
              <label :for="'levelMust' + index" class="form-check-label">Must Include</label>
            </div>
            <div class="form-check">
              <input type="radio" v-model="formElement.level" value="may" :id="'levelMay' + index"
                class="form-check-input">
              <label :for="'levelMay' + index" class="form-check-label">May Include</label>
            </div>
            <div class="form-check" v-if="isPropertyVisibleNameInTextOptions(formElement.property_visible_name)">
              <input type="radio" v-model="formElement.level" value="begins_with" :id="'begins_with' + index"
                class="form-check-input">
              <label :for="'begins_with' + index" class="form-check-label">Begins With</label>
            </div>
            <div class="form-check" v-if="isPropertyVisibleNameInTextOptions(formElement.property_visible_name)">
              <input type="radio" v-model="formElement.level" value="ends_with" :id="'ends_with' + index"
                class="form-check-input">
              <label :for="'ends_with' + index" class="form-check-label">Ends With</label>
            </div>
            <div v-if="formElement.property_type === 'date'" class="form-group">
              <label>Includes Date Range:</label>
              <div class="row">
                <div class="col-md-5">
                  <input type="date" v-model="formElement.includesStart" class="form-control">
                </div>
                <div class="col-md-1">to</div>
                <div class="col-md-5">
                  <input type="date" v-model="formElement.includesEnd" class="form-control">
                </div>
              </div>
              <label>Excludes Date Range:</label>
              <div class="row">
                <div class="col-md-5">
                  <input type="date" v-model="formElement.excludesStart" class="form-control">
                </div>
                <div class="col-md-1">to</div>
                <div class="col-md-5">
                  <input type="date" v-model="formElement.excludesEnd" class="form-control">
                </div>
              </div>
            </div>
            <div v-if="formElement.property_type === 'multi'" class="form-group">
              <div class="form-group">
                <label>Includes:</label>
                <div class="row">
                  <div class="col-md-2">
                    <select v-model="formElement.includesOperator" class="form-control">
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                    </select>
                  </div>
                  <div class="col-md-10">
                    <Multiselect v-model="formElement.includesTags"
                      :options="returnValueOptionsForGrid(formElement.property_name)" mode="tags" :searchable="true" />

                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Excludes:</label>
                <div class="row">
                  <div class="col-md-2">
                    <select v-model="formElement.excludesOperator" class="form-control">
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                    </select>
                  </div>
                  <div class="col-md-10">
                    <Multiselect v-model="formElement.excludesTags"
                      :options="returnValueOptionsForGrid(formElement.property_name)" mode="tags" :searchable="true" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formElement.property_type === 'text'">
              <div class="form-group">
                <label>Includes:</label>
                <div class="row">
                  <div class="col-md-2">
                    <select v-model="formElement.includesOperator" class="form-control">
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                    </select>
                  </div>
                  <div class="col-md-10">
                    <div class="tag-input">
                      <div class="tag" style="margin: 1px 1px 1px;" v-for="(tag, tagIndex) in formElement.includesTags"
                        :key="tagIndex">
                        {{ tag }}
                        <button @click="removeTag(formElement, 'includes', tagIndex)" class="btn btn-danger">X</button>
                      </div>
                      <input v-model="formElement.newIncludeTag" @keydown.enter.prevent="addTag(formElement, 'includes')"
                        :placeholder="'Enter ' + formElement.property_visible_name + ' Includes'" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Excludes:</label>
                <div class="row">
                  <div class="col-md-2">
                    <select v-model="formElement.excludesOperator" class="form-control">
                      <option value="or">OR</option>
                      <option value="and">AND</option>
                    </select>
                  </div>
                  <div class="col-md-10">
                    <div class="tag-input">
                      <div class="tag" v-for="(tag, tagIndex) in formElement.excludesTags" :key="tagIndex">
                        {{ tag }}
                        <button @click="removeTag(formElement, 'excludes', tagIndex)" class="btn btn-danger">X</button>
                      </div>
                      <input v-model="formElement.newExcludeTag" @keydown.enter.prevent="addTag(formElement, 'excludes')"
                        :placeholder="'Enter ' + formElement.property_visible_name + ' Excludes'" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button @click="removeFormElement(index)" class="btn btn-danger" style="margin-left: 2px;">Remove</button>

            <hr>
          </div>
        </div>
        <div style="float: right;">
          <button style="margin-top:4px" @click="submitForm" class="btn btn-success">Update Rule</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { Articles } from '@/api';
import axios from "@/axios";
import { useNotificationStore } from '@/stores/notifications';
import Multiselect from '@vueform/multiselect';
import InputSwitch from 'primevue/inputswitch';
export default {
  components: {
    InputSwitch, Multiselect
  },
  mixins: [
    Articles
  ],
  data() {
    return {
      options: [
        'Batman',
        'Robin',
        'Joker',
      ],

      ruleProperties: [
        {
          'property_name': 'title',
          'property_visible_name': 'Title',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'ai_summary',
          'property_visible_name': 'AI Summary',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'ai_title',
          'property_visible_name': 'AI Title',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'source_language',
          'property_visible_name': 'Source Language',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'ai_sentiment',
          'property_visible_name': 'AI Sentiment',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'ai_translated_date',
          'property_visible_name': 'AI Translated Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'summary',
          'property_visible_name': 'Summary',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'sector_type',
          'property_visible_name': 'Sector Type',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
       
        {
          'property_name': 'pdf_url',
          'property_visible_name': 'PDF URL',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'status',
          'property_visible_name': 'Status',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'classification',
          'property_visible_name': 'Classification',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'filing_type',
          'property_visible_name': 'Filing Type',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'states',
          'property_visible_name': 'States',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'agencies',
          'property_visible_name': 'Agencies',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'alert_type',
          'property_visible_name': 'Alert Type',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'rule_classification',
          'property_visible_name': 'Rule Classification',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'published_status',
          'property_visible_name': 'Article Publish Status',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'article_type',
          'property_visible_name': 'Article Type',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'tags',
          'property_visible_name': 'Tags',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'docket_file_number',
          'property_visible_name': 'Docket File Number',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'order_notice',
          'property_visible_name': 'Order Notice',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'sec_release_number',
          'property_visible_name': 'SEC Release Number',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'subtype_classification',
          'property_visible_name': 'Subtype Classification',
          'property_type': 'multi',
          'property_relation': 'm2m'
        },
        {
          'property_name': 'in_federal_register',
          'property_visible_name': 'In Federal Register',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'federal_register_number',
          'property_visible_name': 'Federal Register Number',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'regalytics_alert_id',
          'property_visible_name': 'Regalytics Alert ID',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'proposed_comments_due_date',
          'property_visible_name': 'Proposed Comments Due Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'original_publication_date',
          'property_visible_name': 'Original Publication Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'federal_register_publication_date',
          'property_visible_name': 'Federal Register Publication Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'rule_effective_date',
          'property_visible_name': 'Rule Effective Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'event_start_date',
          'property_visible_name': 'Event Start Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'event_end_date',
          'property_visible_name': 'Event End Date',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'event_start_time',
          'property_visible_name': 'Event Start Time',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'event_end_time',
          'property_visible_name': 'Event End Time',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'event_location',
          'property_visible_name': 'Event Location',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'alert_key',
          'property_visible_name': 'Alert Key',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'fine_amount_total',
          'property_visible_name': 'Fine Amount Total',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'latest_update',
          'property_visible_name': 'Latest Update',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'created_at',
          'property_visible_name': 'Created At',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'to_be_published',
          'property_visible_name': 'To Be Published',
          'property_type': 'boolean',
          'property_relation': 'straight'
        },
        {
          'property_name': 'to_be_published_at',
          'property_visible_name': 'To Be Published At',
          'property_type': 'date',
          'property_relation': 'straight'
        },
        {
          'property_name': 'ui_published_status',
          'property_visible_name': 'UI Published Status',
          'property_type': 'text',
          'property_relation': 'straight'
        },
        {
          'property_name': 'last_edited_by',
          'property_visible_name': 'Last Edited By',
          'property_type': 'multi',
          'property_relation': 'o2o'
        },
        {
          'property_name': 'reviewed_by',
          'property_visible_name': 'Reviewed By',
          'property_type': 'multi',
          'property_relation': 'o2o'
        }
      ],

      rule_name: '',
      selection: '',
      newEntry: { find: '', replace: '' },
      tableData: [],
      target_column: [],
      target_value: [],
      formElements: [],
      add_criteria: false,
      update_remove_relation: false,
      agencies: [],
      alert_type: [],
      rule_classification: [],
      published_status: [],
      article_type: [],
      classification: [],
      docket_file_number: [],
      filing_type: [],
      order_notice: [],
      rules: [],
      sec_release_number: [],
      sector_type: [],
      states: [],
      status: [],
      subtype_classification: [],
      tags: []
    };
  },
  computed: {
    editMode() {
      return this.$route.name === 'Edit Rule';
    },
    selectableProperties() {
      // Filter the ruleProperties to exclude properties already added to the formElements
      return this.ruleProperties.filter(property => !this.isPropertyAdded(property));
    },
    disableSelectedProperty() {
      // Disable the select property dropdown if all properties are added to the formElements
      return this.selectableProperties.length === 0;
    }
  },
  created() {
    this.loadFormFromLocalStorage();
    this.fetchRelatedData();
  },
  watch: {
    selection(newSelection) {
      if (newSelection === 'addRelation' || newSelection === 'removeRelation') {
        this.update_remove_relation = true;
      } else {
        this.update_remove_relation = false;
      }
    }
  },
  methods: {
    fetchRelatedData() {
      this.get_related_article_data().then(response => {
        const data = response.data.data
        this.agencies = data.agencies;
        this.alert_type = data.alert_type;
        this.rule_classification = data.rule_classification;
        this.published_status = data.published_status;
        this.article_type = data.article_type;
        this.classification = data.classification;
        this.docket_file_number = data.docket_file_number;
        this.filing_type = data.filing_type;
        this.order_notice = data.order_notice;
        this.rules = data.rules;
        this.sec_release_number = data.sec_release_number;
        this.sector_type = data.sector_type;
        this.states = data.states;
        this.status = data.status;
        this.subtype_classification = data.subtype_classification;
        this.tags = data.tags;
        console.log(data)
      })
    },
    getOptions() {
      return this.ruleProperties
        .filter(property => property.property_type == 'text')
        .map(property => ({
          value: property.property_name,
          label: property.property_visible_name
        }));
    },
    get_text_options() {
      return this.ruleProperties
        .filter(property => property.property_type == 'text')
        .map(property => ( property.property_visible_name));
    },
    isPropertyVisibleNameInTextOptions(option) {
      return this.get_text_options().includes(option);
    },
    getOptionsm2m() {
      return this.ruleProperties
        .filter(property => property.property_type == 'multi')
        .map(property => ({
          value: property.property_name,
          label: property.property_visible_name
        }));
    },
    returnValueOptionsForGrid(propertyName) {
      return this[propertyName].map(item => {
        return {
          value: item.name,
          label: item.name
        };
      });
    },
    clearLocalStorage() {
      window.localStorage.removeItem('formElements');
    },
    goBack() {
      this.$router.push('/dashboard/rules');
    },
    addEntry() {
      this.tableData.push({ ...this.newEntry, editing: false });
        this.newEntry.find = '';
        this.newEntry.replace = '';
    },
    editEntry(index) {
      this.tableData[index].editing = true;
    },
    saveEntry(index) {
      this.tableData[index].editing = false;
    },
    removeEntry(index) {
      this.tableData.splice(index, 1);
    },
    saveData() {
      console.log('Table Data:', this.tableData);
    },
    addFormElement(selectedProperty) {
      if (selectedProperty) {
        const formElement = {
          property_name: selectedProperty.property_name,
          property_visible_name: selectedProperty.property_visible_name,
          property_type: selectedProperty.property_type,
          property_relation: selectedProperty.property_relation,
          level: 'must',
          includesOperator: 'or',
          excludesOperator: 'or',
          includesStart: '',
          includesEnd: '',
          excludesStart: '',
          excludesEnd: '',
          includesTags: [],
          target_column: this.target_column,
          target_value: this.target_value,
          newIncludeTag: '',
          excludesTags: [],
          newExcludeTag: ''
        };

        this.formElements.push(formElement);
      }
    },
    removeFormElement(index) {
      this.formElements.splice(index, 1);
    },
    submitForm() {
      // Save form data to local storage
      console.log(this.formElements)
      console.log(this.tableData)
      const rule_data = {
        'formElements': this.formElements,
        'rule_type': this.selection,
        'rule_name': this.rule_name,
        'rule_criteria_enabled': this.add_criteria,
        'target_column': this.target_column,
        'target_value': this.target_value,
        'tableData': this.tableData,
        'update_remove_relation': this.update_remove_relation
      };

      if (rule_data.rule_name !== '') {
        // all-rules
        axios.put('/collections/get-user-rules/' + this.$route.params.id + '/', rule_data, { withCredentials: true })
          .then(response => {
            const notification = {
              message: 'Rule updated',
              type: 'success'
            }
            const notificationStore = useNotificationStore();
            notificationStore.addNotification(notification);
            this.$router.push('/dashboard/rules');
          })
          .catch(() => {
            const notification = {
              message: 'There was an error creating Rule',
              type: 'danger'
            }
            const notificationStore = useNotificationStore();
            notificationStore.addNotification(notification);
          });
      } else {
        const notification = {
          message: 'Please add a rule name',
          type: 'danger'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
      }


    },
    loadFormFromLocalStorage() {
      axios.get('/collections/get-user-rules/' + this.$route.params.id + '/', { withCredentials: true })
        .then(response => {
          const notification = {
            message: 'Rule Fetched',
            type: 'success'
          }
          if (response.data) {
            this.formElements = response.data.rule.formElements;
            this.selection = response.data.rule.rule_type;
            this.update_remove_relation = response.data.rule.update_remove_relation;
            this.rule_name = response.data.rule.rule_name;
            this.add_criteria = response.data.rule.rule_criteria_enabled;
            this.target_column = response.data.rule.target_column;
            this.target_value = response.data.rule.target_value;
            this.tableData = response.data.rule.tableData == undefined ? [] : response.data.rule.tableData;
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        })
        .catch(() => {
          const notification = {
            message: 'There was an error creating Rule',
            type: 'danger'
          }
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(notification);
        });


    },
    isPropertyAdded(property) {
      // Check if the property is already added to formElements
      return this.formElements.some(formElement => formElement.property_name === property.property_name);
    },
    addTag(formElement, tagType) {
      console.log(formElement)
      if (formElement.newIncludeTag.trim() !== '') {
        if (tagType === 'includes') {
          formElement.includesTags.push(formElement.newIncludeTag.trim());
          formElement.newIncludeTag = '';
        } else if (tagType === 'excludes') {
          formElement.excludesTags.push(formElement.newExcludeTag.trim());
          formElement.newExcludeTag = '';
        }
      }
      if (formElement.newExcludeTag.trim() !== '') {
        if (tagType === 'includes') {
          formElement.includesTags.push(formElement.newIncludeTag.trim());
          formElement.newIncludeTag = '';
        } else if (tagType === 'excludes') {
          formElement.excludesTags.push(formElement.newExcludeTag.trim());
          formElement.newExcludeTag = '';
        }
      }
    },
    removeTag(formElement, tagType, index) {
      if (tagType === 'includes') {
        formElement.includesTags.splice(index, 1);
      } else if (tagType === 'excludes') {
        formElement.excludesTags.splice(index, 1);
      }
    }
  }
};
</script>

<style>
.tag-input {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
}

.tag {
  display: inline-block;
  margin-right: 5px;
  padding: 5px 10px;
  background-color: lightgray;
}

.tag button {
  border: none;
  background: none;
  cursor: pointer;
}

#replaceInput {
  white-space: pre;
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>