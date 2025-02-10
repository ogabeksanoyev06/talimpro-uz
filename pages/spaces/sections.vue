<template>
   <div>
      <h3 class="mb-6 text-base font-semibold md:text-xl lg:mb-8 lg:text-2xl">Ishlangan testlarni bo'limlar kesimida hisoboti</h3>
      <a-table :columns="columns" :data-source="sections" :pagination="false" bordered :scroll="{ x: true }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'subject'">
               <span @click="goToLink(record.part?.subject, record.part?._id)" class="cursor-pointer text-primary">{{ record.part?.name_uz }}</span>
            </template>
         </template>
      </a-table>
   </div>
</template>

<script setup>
const testStore = useTestStore();
const { fetchPartsSpacesResults } = testStore;

const router = useRouter();
const route = useRoute();
const userRole = useCookie('role');

const columns = [
   {
      title: "Bo'lim",
      dataIndex: 'subject',
      key: 'subject'
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

const subjectId = route.query.subjectId;
const testId = route.query.typeId;

const goToLink = (sectionId, themeId) => {
   router.push({ path: '/spaces/theme', query: { themeId: themeId, sectionId: sectionId } });
};

const { data: sections, pending } = await useAsyncData('subjects', async () => {
   return await fetchPartsSpacesResults(userRole.value, subjectId);
});
</script>
