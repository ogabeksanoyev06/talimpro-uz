<script setup>
import { ref } from 'vue';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { ExcelExportModule } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllCommunityModule, ExcelExportModule]);
provideGlobalGridOptions({ theme: 'legacy' });

const gridApi = ref(null);

const columnDefs = ref([
   { field: 'id', headerName: 'ID', filter: true },
   { field: 'regionId', headerName: 'Viloyat', filter: true },
   { field: 'districtId', headerName: 'Tuman', filter: true },
   { field: 'organizationId', headerName: 'Tashkilot', filter: true },
   { field: 'userName', headerName: 'Sinf', filter: true },
   { field: 'firstName', headerName: 'Ism', filter: true },
   { field: 'lastName', headerName: 'Familiya', filter: true },
   { field: 'middleName', headerName: 'Otasining ismi', filter: true },
   { field: 'userName', headerName: 'Login', filter: true },
   { field: 'password', headerName: 'Parol', filter: true },
   { field: 'role', headerName: 'Rol', filter: true },
   { field: 'phoneNumber', headerName: 'Telefon raqam', filter: true },
   { field: 'createdAt', headerName: 'Yaratilgan vaqti', filter: true },
   { field: 'lastModifiedAt', headerName: "Oxirgi o'zgartirilgan vaqti", filter: true }
]);

const defaultColDef = ref({
   filter: true,
   minWidth: 200,
   flex: 1
});

const defaultExcelExportParams = ref({
   exportAsExcelTable: {
      name: '',
      showRowStripes: false,
      showColumnStripes: true,
      showFilterButton: true
   }
});

const rowData = ref([
   {
      id: 111408,
      regionId: 13,
      districtId: 57,
      organizationId: 15,
      organizationClassId: 9651,
      userName: 'p00965101',
      password: '169003',
      role: 2,
      firstName: '545',
      lastName: '',
      middleName: '',
      avatar: '3b5140bb-d6a7-41c3-840f-51121a5fbdf6.webp',
      phoneNumber: '+998 93 081 91 40',
      wallet: 0,
      anonymousUploadedUserId: null,
      createdAt: '2025-02-04T09:12:59.607093Z',
      createdBy: 918,
      lastModifiedAt: '2025-02-06T05:08:20.007606Z',
      lastModifiedBy: 111408,
      lastLogin: '2025-02-06T05:08:20.007478Z'
   },
   {
      id: 109073,
      regionId: 13,
      districtId: 57,
      organizationId: 15,
      organizationClassId: 9607,
      userName: 'p00960701',
      password: '743046',
      role: 2,
      firstName: "Og'abek",
      lastName: 'Sanoyev',
      middleName: 'fd',
      avatar: 'b5ea12b7-e825-4b9c-8ccc-765f2962e1cd.webp',
      phoneNumber: '+998 93 081 91 40',
      wallet: 0,
      anonymousUploadedUserId: null,
      createdAt: '2025-01-27T13:07:46.172004Z',
      createdBy: 918,
      lastModifiedAt: '2025-02-04T09:10:55.523107Z',
      lastModifiedBy: 109073,
      lastLogin: '2025-02-04T09:08:56.695011Z'
   }
]);

// Excelga eksport qilish
const onBtExport = () => {
   gridApi.value?.exportDataAsExcel();
};

// Grid tayyor bo'lganda gridApi ni saqlash
const onGridReady = (params) => {
   gridApi.value = params.api;
};
</script>

<template>
   <div class="h-full">
      <div>
         <a-button @click="onBtExport">Export to Excel</a-button>
         <div class="grid-wrapper">
            <AgGridVue
               class="ag-theme-alpine"
               style="width: 100%; height: 100%"
               @grid-ready="onGridReady"
               :localeText="AG_GRID_LOCALE_UZ"
               :columnDefs="columnDefs"
               :defaultColDef="defaultColDef"
               :defaultExcelExportParams="defaultExcelExportParams"
               :rowData="rowData"
               :domLayout="'autoHeight'"
            />
         </div>
      </div>
   </div>
</template>

<style scoped>
.grid-wrapper {
   height: 500px;
}
</style>
