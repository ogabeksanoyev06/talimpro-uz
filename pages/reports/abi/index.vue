<script setup>
const schoolStore = useSchoolStore();
const { fetchSubjects, fetchFilterTeacherResults } = schoolStore;

const { $dayjs } = useNuxtApp();
const testId = 18;

const form = reactive({
   subject: undefined,
   startDate: $dayjs().valueOf(),
   endDate: $dayjs().valueOf()
});
const subjects = ref([]);
const results = ref([]);
const formRef = ref();
const loading = ref(false);

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
            <a-form-item class="col-span-12 ml-auto mb-0">
               <a-button type="primary" html-type="submit" :loading="loading">Yasash</a-button>
            </a-form-item>
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
               {{ getDiagnosisResult(attesLevel.find((item) => item.value === record.comments?.toifa)?.value, record.correct_answers * 2) }}
            </template>
         </template>
      </a-table>
   </div>
</template>
