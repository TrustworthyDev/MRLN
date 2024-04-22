
import $bus from "@/eventBus/eventBus.js";
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueFeather from 'vue-feather';
import MySpinner from '../src/components/Spinner.vue';
import App from './App.vue';
import router from './router';

  

import PrimeVue from 'primevue/config';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";
    
//core
import "@vueform/multiselect/themes/default.css";
import "primevue/resources/primevue.min.css";

//icons
import { LicenseManager } from "@ag-grid-enterprise/core";
import "primeicons/primeicons.css";

LicenseManager.setLicenseKey("CompanyName=RegAlytics,LicensedApplication=RegAlytics,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-017464,ExpiryDate=20_July_2024_[v2]_MTY1ODI3MTYwMDAwMA==b32bf26b21af50acf0fc44b3379475fe");

import { ModuleRegistry } from '@ag-grid-community/core';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
    
ModuleRegistry.registerModules([ ServerSideRowModelModule, SetFilterModule ]);

// Axios configuration
import axios from "@/axios";


const app = createApp(App)

app.config.warnHandler = function (msg, vm, trace) {
    return null
}

app.provide('$axios', axios);
app.component('v-select', vSelect);

import { BootstrapVue3 } from 'bootstrap-vue-3';
// import '../node_modules/@ag-grid-community/core/dist/styles/ag-grid.css';
// import '../node_modules/@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


import '../node_modules/bootstrap/dist/css/bootstrap.css';



// Import Bootstrap an BootstrapVue CSS files (order is important)
import '@/assets/scss/main.scss';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap/dist/css/bootstrap.css';

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(BootstrapVue3)
app.use(PrimeVue);
app.component(VueFeather.name, VueFeather);
app.component(MySpinner.name, MySpinner);

app.config.globalProperties.$bus = $bus;


app.mount('#app')

import { TrackingHelper } from '@/helpers/trackingHelper';


import { useAccountStore } from '@/stores/account';
const accountStore = useAccountStore();



export const trackingHelper = new TrackingHelper(app, accountStore, router);
app.provide("$tracking", trackingHelper);
