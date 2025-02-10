<script setup>
const universitiesStore = useUniversitiesStore();
const testStore = useTestStore();

const { fetchUniversitiesBySubjectsIds } = universitiesStore;
const { fetchAttemptResultById } = testStore;

const route = useRoute();
const testAttemptId = route.query.testAttemptId;
const userRole = useCookie('role');

const columns = [
   {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 80,
      fixed: 'left',
      sorter: (a, b) => a._id.localeCompare(b._id)
   },
   {
      title: 'Universitet',
      dataIndex: 'OTM',
      key: 'OTM',
      width: 200,
      sorter: (a, b) => a.OTM.localeCompare(b.OTM)
   },
   {
      title: "Yo'nalish",
      dataIndex: 'dirnm',
      key: 'dirnm',
      width: 200,
      sorter: (a, b) => a.dirnm.localeCompare(b.dirnm)
   },
   {
      title: "Ta'lim shakli",
      dataIndex: 'emnm',
      key: 'emnm',
      width: 200,
      sorter: (a, b) => a.emnm.localeCompare(b.emnm)
   },
   {
      title: 'Grant soni',
      dataIndex: 'grantnm',
      key: 'grantnm',
      width: 200,
      sorter: (a, b) => a.grantnm - b.grantnm
   },
   {
      title: 'Kontrakt soni',
      dataIndex: 'contractnm',
      key: 'contractnm',
      width: 200,
      sorter: (a, b) => a.contractnm - b.contractnm
   },
   {
      title: 'Grant ball',
      dataIndex: 'ballgr',
      key: 'ballgr',
      width: 200,
      sorter: (a, b) => a.ballgr - b.ballgr
   },
   {
      title: 'Kontrakt ball',
      dataIndex: 'ballk',
      key: 'ballk',
      width: 200,
      sorter: (a, b) => a.ballk - b.ballk
   },
   {
      title: 'Satus',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      sorter: (a, b) => a.duration.localeCompare(b.duration),
      fixed: 'right'
   }
];

const subjects = route.query.subjects?.split(',') || [];
const allQuestions = ref([]);

const { data } = await useAsyncData('test-attempt-results-compare', async () => {
   const [universities, compareResult] = await Promise.all([fetchUniversitiesBySubjectsIds({ subject_1: Number(subjects[0]), subject_2: Number(subjects[1]) }), fetchAttemptResultById(userRole.value, testAttemptId)]);
   return { universities, compareResult };
});

const universities = data.value.universities;
const compareResult = data.value.compareResult;
allQuestions.value = [...compareResult.data?.main_test, ...compareResult.data?.third_test, ...compareResult.data?.secondary_test];
</script>

<template>
   <div>
      <a-card class="text-center text-lg font-medium">
         <p class="text-green text-lg font-bold">{{ calculateTotalScore(allQuestions, 'dtm').totalScore }}</p>
         <p class="max-w-[800px] mx-auto">O'tgan yilgi turdosh yo'nalishlar bo'yicha o'tish ballari va siz to'plagan ballga nisbatatan solishtirish natijasi</p>
      </a-card>
      <a-table :columns="columns" :data-source="universities" :scroll="{ x: 1000 }" class="mt-6">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
               <span class="text-red-500">Yiqildi</span>
            </template>
         </template>
      </a-table>
   </div>
</template>
