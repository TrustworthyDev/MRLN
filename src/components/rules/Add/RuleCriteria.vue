<template>
    <div class="container">
      <div class="form-group">
        <label for="selectProperty">Select Property:</label>
        <select v-model="selectedProperty" class="form-control" id="selectProperty">
          <option v-for="property in selectableProperties" :value="property">
            {{ property.property_visible_name }} {{ isPropertyAdded(property) }}
          </option>
        </select>
        <button @click="addFormElement(selectedProperty)" :disabled="disableSelectedProperty"
          class="btn btn-primary py-2">Add</button>
      </div>
  
      <div v-for="(formElement, index) in formElements" :key="index">
        <h3>{{ formElement.property_visible_name }}</h3>
  
        <div class="form-check">
          <input type="radio" v-model="formElement.level" value="must" :id="'levelMust' + index" class="form-check-input">
          <label :for="'levelMust' + index" class="form-check-label">Must Include</label>
        </div>
        <div class="form-check">
          <input type="radio" v-model="formElement.level" value="may" :id="'levelMay' + index" class="form-check-input">
          <label :for="'levelMay' + index" class="form-check-label">May Include</label>
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
  
        <div v-else>
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
                <input type="text" v-model="formElement.includes" class="form-control">
  
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
                <input type="text" v-model="formElement.excludes" class="form-control">
              </div>
            </div>
          </div>
        </div>
  
        <button @click="removeFormElement(index)" class="btn btn-danger">Remove</button>
  
        <hr>
      </div>
  
      <button @click="submitForm" class="btn btn-success">Submit</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ruleProperties: [
          {
            property_name: 'title',
            property_visible_name: 'Title',
            property_type: 'text',
            property_relation: 'straight'
          },
          {
            property_name: 'alert_type',
            property_visible_name: 'Alert Type',
            property_type: 'multi',
            property_relation: 'o2o'
          },
          {
            property_name: 'agency',
            property_visible_name: 'Agencies',
            property_type: 'multi',
            property_relation: 'm2m'
          },
          {
            property_name: 'date',
            property_visible_name: 'Date',
            property_type: 'date',
            property_relation: 'straight'
          }
        ],
        formElements: []
      };
    },
    computed: {
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
    },
    methods: {
      addFormElement(selectedProperty) {
        if (selectedProperty) {
          const formElement = {
            property_name: selectedProperty.property_name,
            property_visible_name: selectedProperty.property_visible_name,
            property_type: selectedProperty.property_type,
            level: 'must',
            includesStart: '',
            includesEnd: '',
            excludesStart: '',
            excludesEnd: '',
            includes: '',
            includesOperator: 'or',
            excludes: '',
            excludesOperator: 'or'
          };
  
          this.formElements.push(formElement);
        }
      },
      removeFormElement(index) {
        this.formElements.splice(index, 1);
      },
      submitForm() {
        // Save form data to local storage
        localStorage.setItem('formElements', JSON.stringify(this.formElements));
      },
      loadFormFromLocalStorage() {
        // Load form data from local storage
        const savedFormElements = localStorage.getItem('formElements');
        if (savedFormElements) {
          this.formElements = JSON.parse(savedFormElements);
        }
      },
      isPropertyAdded(property) {
        // Check if the property is already added to formElements
        return this.formElements.some(formElement => formElement.property_name === property.property_name);
      }
    }
  };
  </script>