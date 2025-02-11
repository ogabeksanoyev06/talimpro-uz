<script setup>
import ExcelJS from 'exceljs';

import { FileExcelOutlined } from '#components';

const schoolStore = useSchoolStore();
const { fetchSubjects, fetchFilterPupilResults } = schoolStore;

const { $dayjs } = useNuxtApp();
const testId = 15;

const form = reactive({
   subject: undefined,
   grade: undefined,
   startDate: $dayjs().valueOf(),
   endDate: $dayjs().valueOf()
});
const subjects = ref([]);
const results = ref([]);
const formRef = ref();
const loading = ref(false);
const loadingB = ref(false);
const excelLoading = ref(false);

const columns = [
   {
      title: 'FISH',
      dataIndex: 'fio',
      key: 'fio'
   },
   {
      title: 'Sana',
      dataIndex: 'startedAt',
      key: 'startedAt'
   },
   {
      title: 'Vaqt',
      dataIndex: 'vaqt',
      key: 'vaqt'
   },
   {
      title: 'Fan',
      dataIndex: 'subject',
      key: 'subject'
   },
   {
      title: "Testdagi jami to'g'ri javoblar soni",
      dataIndex: 'correct_answers',
      key: 'correct_answers'
   },
   {
      title: 'Ball',
      dataIndex: 'ball',
      key: 'ball'
   }
];

const rules = {
   startDate: [{ required: true, message: 'Iltimos, Boshlanish sanani kiriting', trigger: 'change' }],
   endDate: [{ required: true, message: 'Iltimos, Tugash sanani kiriting', trigger: 'change' }],
   subject: [{ required: true, message: 'Iltimos, fanni tanlang', trigger: 'change' }],
   grade: [{ required: true, message: 'Iltimos, sinfni tanlang', trigger: 'change' }]
};
const handleGradeChange = async (newGrade) => {
   loading.value = true;
   try {
      if (newGrade) {
         const res = await fetchSubjects(testId);
         subjects.value = res.filter((subject) => subject.class === Number(newGrade));
      }
   } finally {
      loading.value = false;
   }
};

const handleSubmitForm = async () => {
   loadingB.value = true;
   try {
      await formRef.value.validate();
      const res = await fetchFilterPupilResults({
         startDate: form.startDate,
         endDate: form.endDate,
         subject: form.subject.value,
         test_type_id: testId
      });
      results.value = res;
      console.log("Yuborilayotgan ma'lumotlar:", form);
   } catch (error) {
   } finally {
      loadingB.value = false;
   }
};
const exportToExcel = async () => {
   excelLoading.value = true;
   try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Hisobot');
      worksheet.columns = columns.map((col) => ({
         header: col.title,
         key: col.key,
         width: col.title.length + 2
      }));
      const borderStyle = {
         top: { style: 'thin' },
         left: { style: 'thin' },
         bottom: { style: 'thin' },
         right: { style: 'thin' }
      };
      worksheet.getRow(1).eachCell((cell) => {
         cell.border = borderStyle;
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
         };
         cell.font = { bold: true };
      });
      results.value.forEach((result) => {
         const row = worksheet.addRow({
            fio: result?.pupil?.surname || '-' + ' ' + result?.pupil?.name || '-' + ' ' + result?.pupil?.father_name || '-',
            startedAt: $dayjs(result.startedAt).format('DD-MM-YYYY HH:mm'),
            vaqt: timerFormat((result.endedAt - result.startedAt) / 1000),
            subject: result.subject.name_ru,
            correct_answers: result.correct_answers,
            ball: result.correct_answers * 2
         });

         row.eachCell((cell, colNumber) => {
            cell.border = borderStyle;
            const textLength = cell.value ? cell.value.toString().length : 10;
            worksheet.getColumn(colNumber).width = Math.max(worksheet.getColumn(colNumber).width, textLength + 2);
         });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'O`quvchi.xlsx';
      link.click();
   } catch (error) {
      console.error('Excel faylini yaratishda xatolik:', error);
   } finally {
      excelLoading.value = false;
   }
};
</script>

<template>
   <div>
      <a-card class="mb-5">
         <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" class="gap-x-2 grid grid-cols-12 !items-start" @finish="handleSubmitForm">
            <a-form-item name="grade" class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
               <template #label>
                  <span class="text-primary">Fan</span>
               </template>
               <a-select v-model:value="form.grade" :options="classes" @change="handleGradeChange" />
            </a-form-item>
            <a-form-item name="subject" class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
               <template #label>
                  <span class="text-primary">Fan</span>
               </template>
               <a-select v-model:value="form.subject" :loading="loading" :disabled="!form.grade" :label-in-value="true">
                  <a-select-option v-for="subject in subjects" :key="subject._id" :value="{ value: subject._id, label: subject.name_uz }">
                     {{ subject.name_uz }}
                  </a-select-option>
               </a-select>
            </a-form-item>
            <a-form-item name="startDate" class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3">
               <template #label>
                  <span class="text-primary">Boshlanish sana</span>
               </template>
               <a-date-picker v-model:value="form.startDate" show-time class="w-full" valueFormat="x" />
            </a-form-item>

            <a-form-item name="endDate" class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3">
               <template #label>
                  <span class="text-primary">Tugash sana</span>
               </template>
               <a-date-picker v-model:value="form.endDate" show-time class="w-full" valueFormat="x" />
            </a-form-item>
            <div class="col-span-12 ml-auto flex flex-wrap gap-2">
               <a-button type="primary" html-type="submit" :loading="loadingB">Yasash</a-button>
               <a-button type="primary" class="!bg-green" :loading="excelLoading" @click="exportToExcel">
                  <FileExcelOutlined />
                  Excel
               </a-button>
            </div>
         </a-form>
      </a-card>
      <a-table :dataSource="results" :columns="columns" bordered :scroll="{ x: 1000 }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fio'"> {{ record?.pupil?.surname || '-' }} {{ record?.pupil?.name || '-' }} {{ record?.pupil?.father_name || '-' }} </template>
            <template v-if="column.key === 'startedAt'">
               {{ $dayjs(record.startedAt).format('DD-MM-YYYY HH:mm') }}
            </template>
            <template v-if="column.key === 'vaqt'">
               {{ timerFormat((record.endedAt - record.startedAt) / 1000) }}
            </template>
            <template v-if="column.key === 'subject'">
               {{ record.subject.name_ru }}
            </template>
            <template v-if="column.key === 'correct_answers'">
               {{ record.correct_answers }}
            </template>
            <template v-if="column.key === 'ball'">
               {{ record.correct_answers }}
            </template>
         </template>
      </a-table>
   </div>
</template>
