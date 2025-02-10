<script setup>
const classStore = useClassesStore();
const { fetchClasses } = classStore;

const columns = [
   {
      title: 'ID',
      dataIndex: '_id',
      key: 'id',
      sorter: (a, b) => a._id - b._id
   },
   {
      title: 'Sinf',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number - b.number,
      defaultSortOrder: 'ascend'
   },
   {
      title: 'Harf',
      dataIndex: 'letter',
      key: 'letter',
      sorter: (a, b) => a.letter.localeCompare(b.letter)
   },
   {
      title: "Ko'rish",
      key: 'more'
   }
];

const { data: classes } = await useAsyncData('classes', async () => {
   return await fetchClasses();
});
</script>

<template>
   <a-table :dataSource="classes" :columns="columns" bordered :scroll="{ x: true }">
      <template #bodyCell="{ column, record }">
         <template v-if="column.key === 'more'">
            <NuxtLink :to="{ path: '/users/pupils', query: { classId: record._id } }" class="text-primary"> Ko'rish </NuxtLink>
         </template>
      </template>
   </a-table>
</template>
