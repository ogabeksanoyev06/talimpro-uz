<template>
   <div>
      <h3 class="mb-6 text-base font-semibold md:text-xl lg:mb-8 lg:text-2xl">Ishlangan testlarni mavzular kesimida hisoboti</h3>
      <a-table :columns="columns" :data-source="theme" :pagination="false" bordered :scroll="{ x: true }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'theme'">
               <span>{{ record.theme?.name_uz }}</span>
            </template>
         </template>
      </a-table>
   </div>
</template>

<script setup>
const userRole = useCookie('role');
const testStore = useTestStore();

const { fetchThemeSpacesResults } = testStore;

const route = useRoute();

const columns = [
   {
      title: 'Mavzu',
      dataIndex: 'theme',
      key: 'theme'
   },
   {
      title: 'Soni',
      dataIndex: 'total_questions',
      key: 'total_questions'
   },
   {
      title: "To'g'rilar",
      dataIndex: 'total_correct',
      key: 'total_correct'
   },
   {
      title: 'Xatolar',
      dataIndex: 'total_incorrect',
      key: 'total_incorrect'
   },
   {
      title: 'Foiz',
      dataIndex: 'percentage_correct',
      key: 'percentage_correct   '
   }
];

const sectionId = route.query.sectionId;
const themeId = route.query.themeId;

const { data: theme } = await useAsyncData('subjects', async () => {
   return await fetchThemeSpacesResults(userRole.value, sectionId, themeId);
});
</script>
