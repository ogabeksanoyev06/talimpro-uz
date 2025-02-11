<script setup>
import ExcelJS from 'exceljs';
const schoolStore = useSchoolStore();
const { fetchSubjects, fetchFilterTeacherResults } = schoolStore;

const { $dayjs } = useNuxtApp();
const testId = 14;

const form = reactive({
   subject: undefined,
   startDate: $dayjs().valueOf(),
   endDate: $dayjs().valueOf()
});
const subjects = ref([]);
const results = ref([]);
const formRef = ref();
const loading = ref(false);
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
   },
   {
      title: 'Attestatsiya turi',
      dataIndex: 'attestType',
      key: 'attestType'
   },
   {
      title: 'Amaldagi toifasi',
      dataIndex: 'attestLevel',
      key: 'attestLevel'
   },
   {
      title: 'Tashxis',
      dataIndex: 'result',
      key: 'result'
   }
];

const rules = {
   startDate: [{ required: true, message: 'Iltimos, Boshlanish sanani kiriting', trigger: 'change' }],
   endDate: [{ required: true, message: 'Iltimos, Tugash sanani kiriting', trigger: 'change' }],
   subject: [{ required: true, message: 'Iltimos, fanni tanlang', trigger: 'change' }]
};
const diagnosisRules = {
   highest: {
      passed: {
         minScore: 80,
         message: 'Attestatsiyadan o‘tdi, oliy malaka toifasi (bosh o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 79,
         message: 'Attestatsiyadan o‘tmadi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) ga tushirilsin'
      }
   },
   first: {
      passedHighest: {
         minScore: 80,
         message: 'Attestatsiyadan o‘tdi, oliy malaka toifasi (bosh o‘qituvchi lavozimi) berilsin'
      },
      passedFirst: {
         minScore: 70,
         maxScore: 79,
         message: 'Attestatsiyadan o‘tdi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 69,
         message: 'Attestatsiyadan o‘tmadi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) ga tushirilsin'
      }
   },
   second: {
      passedFirst: {
         minScore: 70,
         message: 'Attestatsiyadan o‘tdi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) berilsin'
      },
      passedSecond: {
         minScore: 60,
         maxScore: 69,
         message: 'Attestatsiyadan o‘tdi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 59,
         message: 'Attestatsiyadan o‘tmadi, mutaxassis (oliy ma’lumotli o‘qituvchi) lavozimiga tushirilsin'
      }
   },
   specialist: {
      passedSecond: {
         minScore: 60,
         message: 'Attestatsiyadan o‘tdi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) berilsin'
      },
      failed: {
         maxScore: 59,
         message: 'Attestatsiyadan o‘tmadi, mutaxassis (oliy ma’lumotli o‘qituvchi) saqlansin'
      }
   }
};
const getDiagnosisResult = (category, totalScore, isExceptional) => {
   const rules = diagnosisRules[category];
   if (isExceptional && totalScore < 60) {
      return 'Siz yetarlicha ball to‘play olmaganligingiz uchun amaldagi toifangiz o‘zgarishsiz qoladi va sizga yangi sertifikat berilmaydi.';
   }
   switch (category) {
      case 'highest':
         return totalScore >= rules.passed.minScore ? rules.passed.message : rules.failed.message;
      case 'first':
         if (totalScore >= rules.passedHighest.minScore) {
            return rules.passedHighest.message;
         } else if (totalScore >= rules.passedFirst.minScore && totalScore <= rules.passedFirst.maxScore) {
            return rules.passedFirst.message;
         } else {
            return rules.failed.message;
         }
      case 'second':
         if (totalScore >= rules.passedFirst.minScore) {
            return rules.passedFirst.message;
         } else if (totalScore >= rules.passedSecond.minScore && totalScore <= rules.passedSecond.maxScore) {
            return rules.passedSecond.message;
         } else {
            return rules.failed.message;
         }
      case 'specialist':
         return totalScore >= rules.passedSecond.minScore ? rules.passedSecond.message : rules.failed.message;
      default:
         return 'Tashxis aniqlanmadi';
   }
};

const { data } = await useAsyncData('subjects-attestation-type', async () => {
   return await fetchSubjects(testId);
});
if (data.value) {
   subjects.value = data.value.filter((subject) => subject._id !== 162);
}

const handleSubmitForm = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      const res = await fetchFilterTeacherResults({
         startDate: form.startDate,
         endDate: form.endDate,
         subject: form.subject.value,
         test_type_id: testId
      });
      results.value = res;
      console.log("Yuborilayotgan ma'lumotlar:", form);
   } catch (error) {
   } finally {
      loading.value = false;
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
            fio: result.teacher.surname + ' ' + result.teacher.name + ' ' + result.teacher.father_name,
            startedAt: $dayjs(result.startedAt).format('DD-MM-YYYY HH:mm'),
            vaqt: timerFormat((result.endedAt - result.startedAt) / 1000),
            subject: result.subject.name_ru,
            correct_answers: result.correct_answers,
            ball: result.correct_answers * 2,
            attestType: attesType.find((item) => item.value === result.comments?.attestation_type)?.name || '-',
            attestLevel: attesLevel.find((item) => item.value === result.comments?.toifa)?.name || '-',
            result: getDiagnosisResult(
               attesLevel.find((item) => item.value === result.comments?.toifa)?.value,
               result.correct_answers * 2,
               attesType.find((item) => item.value === result.comments?.attestation_type)?.value === 'extraordinary'
            )
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
      link.download = 'Attestatsiya.xlsx';
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
            <a-form-item name="subject" class="col-span-12 lg:col-span-4">
               <template #label>
                  <span class="text-primary">Fan</span>
               </template>
               <a-select v-model:value="form.subject" :label-in-value="true">
                  <a-select-option v-for="subject in subjects" :key="subject._id" :value="{ value: subject._id, label: subject.name_uz }">
                     {{ subject.name_uz }}
                  </a-select-option>
               </a-select>
            </a-form-item>

            <a-form-item name="startDate" class="col-span-12 sm:col-span-6 lg:col-span-4">
               <template #label>
                  <span class="text-primary">Boshlanish sana</span>
               </template>
               <a-date-picker v-model:value="form.startDate" show-time class="w-full" valueFormat="x" />
            </a-form-item>

            <a-form-item name="endDate" class="col-span-12 sm:col-span-6 lg:col-span-4">
               <template #label>
                  <span class="text-primary">Tugash sana</span>
               </template>
               <a-date-picker v-model:value="form.endDate" show-time class="w-full" valueFormat="x" />
            </a-form-item>
            <div class="col-span-12 ml-auto flex flex-wrap gap-2">
               <a-button type="primary" html-type="submit" :loading="loading">Yasash</a-button>
               <a-button type="primary" class="!bg-green" :loading="excelLoading" @click="exportToExcel">
                  <FileExcelOutlined />
                  Excel
               </a-button>
            </div>
         </a-form>
      </a-card>
      <a-table :dataSource="results" :columns="columns" bordered :scroll="{ x: 1000 }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fio'">
               {{ record.teacher.surname + ' ' + record.teacher.name + ' ' + record.teacher.father_name }}
            </template>
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
               {{ record.correct_answers * 2 }}
            </template>
            <template v-if="column.key === 'attestType'">
               {{ attesType.find((item) => item.value === record.comments?.attestation_type)?.name || '-' }}
            </template>
            <template v-if="column.key === 'attestLevel'">
               {{ attesLevel.find((item) => item.value === record.comments?.toifa)?.name || '-' }}
            </template>
            <template v-if="column.key === 'result'">
               {{
                  getDiagnosisResult(
                     attesLevel.find((item) => item.value === record.comments?.toifa)?.value,
                     record.correct_answers * 2,
                     attesType.find((item) => item.value === record.comments?.attestation_type)?.value === 'extraordinary'
                  )
               }}
            </template>
         </template>
      </a-table>
   </div>
</template>
