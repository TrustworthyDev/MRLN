<template>
  <div class="container">
    Raw Articles

    <div class="overflow-auto" style="width: 1000px;">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>RegAlytics Alert ID</th>
            <th>Scraped Date</th>
            <th>Title</th>
            <th>Summary</th>
            <th>Agency ID</th>
            <th>HTML PDF</th>
            <th>HTML URL</th>
            <th>Alert Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in allArticles" :key="article.regalytics_alert_id">
            <td>{{ article.regalytics_alert_id }}</td>
            <td>{{ article.scraped_date }}</td>
            <td>{{ article.title }}</td>
            <td>{{ article.summary }}</td>
            <td>{{ article.agency_id }}</td>
            <td>{{ article.html_pdf }}</td>
            <td>{{ article.html_url }}</td>
            <td>{{ article.alert_type }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
/* eslint-disable */
import { inject, ref } from 'vue';

const $axios = inject('$axios');
let allArticles = ref([]);




const getAllArticles = () => {
  $axios.get('/raw_data/all/', { withCredentials: true }).then(r => {
    allArticles = r.data.articles;
  })
    .catch(e => {
      'pass'
    });
}


getAllArticles();



</script>

<style scoped>
</style>
