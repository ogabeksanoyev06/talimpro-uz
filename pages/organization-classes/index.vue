<script setup>
import { useQueryChange } from '@/composables/useQueryChange';

const classStore = useClassesStore();
const { fetchClasses, deleteClass } = classStore;

const { updateQuery } = useQueryChange();

const route = useRoute();

const search = ref(route.query.search || '');

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
   },
   {
      title: 'Amallar',
      key: 'action'
   }
];

const onSearch = (searchValue) => {
   updateQuery('search', searchValue);
};

const onInputChange = (event) => {
   const searchValue = event.target.value;
   updateQuery('search', searchValue);
};

const confirm = async (id) => {
   try {
      await deleteClass(id);
      refresh();
   } catch (error) {
      showToast(error?._data?.message, 'error');
   }
};

const { data: classes, refresh } = await useAsyncData('classes', async () => {
   return await fetchClasses();
});

const filteredClasses = computed(() => {
   if (!search.value) return classes.value;
   return classes.value.filter((item) => {
      return item.number.toString().includes(search.value) || item.letter.toLowerCase().includes(search.value.toLowerCase());
   });
});
</script>

<template>
   <div>
      <div class="flex flex-wrap gap-2 border p-3 rounded-lg mb-2">
         <div class="flex grow">
            <NuxtLink to="/organization-classes/create">
               <a-button class="text-primary border-primary"> <PlusOutlined /> Qo'shish </a-button>
            </NuxtLink>
         </div>
         <a-input-search @input="onInputChange" @search="onSearch" v-model:value="search" placeholder="Qidirish" style="width: 200px" />
      </div>
      <a-table :dataSource="filteredClasses" :columns="columns" bordered :scroll="{ x: true }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'more'">
               <NuxtLink :to="{ path: '/users/pupils', query: { classId: record._id } }" class="text-primary"> Ko'rish </NuxtLink>
            </template>
            <template v-if="column.key === 'action'">
               <div class="flex items-center gap-2">
                  <NuxtLink :to="`organization-classes/update/${record._id}`">
                     <EditFilled class="text-primary cursor-pointer" />
                  </NuxtLink>
                  <a-popconfirm title="O'chirish" description="Rostdan ham o'chirmoqchimisiz?" @confirm="confirm(record._id)" @cancel="cancel">
                     <DeleteFilled class="text-red-500 cursor-pointer" />
                  </a-popconfirm>
               </div>
            </template>
         </template>
      </a-table>
   </div>
</template>
