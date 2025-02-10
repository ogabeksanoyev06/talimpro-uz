import { defineNuxtPlugin } from '#app';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default defineNuxtPlugin((nuxtApp) => {
   nuxtApp.vueApp.component('AgGridVue', AgGridVue);
});
