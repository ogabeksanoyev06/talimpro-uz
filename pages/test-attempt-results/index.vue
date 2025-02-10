<template>
   <a-table :columns="columns" :data-source="result.data" :pagination="pagination" :loading="pending" bordered @change="handleTableChange" :scroll="{ x: true }" class="whitespace-nowrap">
      <template #bodyCell="{ column, record }">
         <template v-if="column.key === 'date'"> {{ $dayjs(record.startedAt).format('DD.MM.YYYY HH:mm') }} - {{ $dayjs(record.endedAt).format('DD.MM.YYYY HH:mm') }} </template>
         <template v-if="column.key === 'type'">
            {{ record.test_type_id?.title_uz }}
         </template>
         <template v-if="column.key === 'ball'">
            <span v-if="record.test_type === 'dtm'">
               {{ calculateTotalScore(allQuestions(record?.main_test, record.secondary_test, record.third_test), record.test_type).totalScore }}
            </span>
            <span v-else> {{ points[record.test_type] * record.correct_answers }}</span>
         </template>
         <template v-if="column.key === 'action'">
            <NuxtLink :to="{ path: '/test-attempt-results/result', query: { attemptId: record._id } }" class="text-primary">Ko'rish</NuxtLink>
         </template>
      </template>
   </a-table>
</template>

<script setup>
import { ref } from 'vue';

const columns = [
   {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
      sorter: (a, b) => a._id - b._id
   },
   {
      title: 'Sana va vaqt',
      key: 'date',
      sorter: (a, b) => a.startedAt - b.startedAt
   },
   {
      title: 'Ball',
      key: 'ball',
      sorter: (a, b) => {
         const ballA = points[a.test_type] * a.correct_answers;
         const ballB = points[b.test_type] * b.correct_answers;
         return ballA - ballB;
      }
   },
   {
      title: 'Test turi',
      key: 'type'
   },
   {
      title: 'Amaliyot',
      key: 'action'
   }
];

const testStore = useTestStore();
const { fetchAttemptResult } = testStore;

const userRole = useCookie('role');

const page = ref(1);
const total = ref(1);
const limit = ref(10);

const allQuestions = (main = [], second = [], third = []) => {
   if (!Array.isArray(main)) main = [];
   if (!Array.isArray(second)) second = [];
   if (!Array.isArray(third)) third = [];

   return [...main, ...second, ...third];
};

const { data: result, pending } = await useAsyncData(
   `results-attempt-${page.value}`,
   async () => {
      const res = await fetchAttemptResult(userRole.value, { page: page.value, limit: limit.value });
      return res;
   },
   { watch: [page, limit] }
);

total.value = result.value._meta.totalItems;

const pagination = ref({
   current: page.value,
   pageSize: limit.value,
   total: total.value,
   showSizeChanger: true,
   showTotal: (total) => `Jami ${total} ta`
});

function handleTableChange(pag, filters, sorter, extra) {
   page.value = pag.current;
   pagination.value.pageSize = pag.pageSize;
   limit.value = pag.pageSize;
   pagination.value.current = page.value;
}
</script>
