<template>
    <div class="container">
      <div class="radio">
        <label>
          <input type="radio" v-model="selection" value="findReplace">
          Find and Replace
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" v-model="selection" value="tableOnly">
          Table Only
        </label>
      </div>
  
      <div v-if="selection === 'findReplace'">
        <div class="form-group">
          <label for="findInput">Find:</label>
          <input type="text" v-model="newEntry.find" id="findInput" class="form-control">
        </div>
        <div class="form-group">
          <label for="replaceInput">Replace:</label>
          <input type="text" v-model="newEntry.replace" id="replaceInput" class="form-control">
        </div>
        <button @click="addEntry" class="btn btn-primary">Add Entry</button>
      </div>
  
      <table v-if="selection === 'findReplace' || (selection === 'tableOnly' && tableData.length > 0)" class="table">
        <thead>
          <tr>
            <th>Find</th>
            <th>Replace</th>
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
              <button v-if="!entry.editing" @click="editEntry(index)" class="btn btn-primary">Edit</button>
              <button v-else @click="saveEntry(index)" class="btn btn-success">Save</button>
              <button @click="removeEntry(index)" class="btn btn-danger">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <button @click="saveData" class="btn btn-success">Save</button>
  
    </div>
  </template>
  
  <script>
    
  export default {
    name: 'FindReplaceForm',
    data() {
      return {
        newEntry: { find: '', replace: '' },
        tableData: [],
        selection: 'findReplace'
      };
    },
    methods: {
      addEntry() {
        if (this.newEntry.find.trim() !== '' && this.newEntry.replace.trim() !== '') {
          this.tableData.push({ ...this.newEntry, editing: false });
          this.newEntry.find = '';
          this.newEntry.replace = '';
        }
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
      }
    }
  };
  </script>
  
  <style>
  .container {
    margin: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  </style>