<template>
   <a-table :columns="columns" :data-source="types" :pagination="false" :scroll="{ x: true }">
      <template #bodyCell="{ column, record }">
         <template v-if="column.key === 'action'">
            <span @click="goToLink(record._id)" class="text-primary cursor-pointer">Ko'rish</span>
         </template>
      </template>
   </a-table>
</template>

<script setup>
import { useQueryChange } from '@/composables/useQueryChange';
const userRole = useCookie('role');

const testStore = useTestStore();
const { fetchTestTypes } = testStore;

const { updateQuery } = useQueryChange();
const router = useRouter();

const columns = [
   {
      title: 'ID',
      dataIndex: '_id',
      key: 'id'
   },
   {
      title: 'Test turi',
      dataIndex: 'title_uz',
      key: 'title'
   },
   {
      title: 'Savollar soni',
      dataIndex: 'questions_count',
      key: 'questions_count'
   },
   {
      title: 'Test davomiyligi',
      dataIndex: 'duration',
      key: 'duration'
   },
   {
      title: 'Amaliyot',
      key: 'action'
   }
];

const goToLink = (typeId) => {
   router.push({ path: '/spaces/subjects', query: { typeId: typeId } });
};

const { data: types } = await useAsyncData('testTypes', async () => {
   return await fetchTestTypes(userRole.value);
});
</script>
