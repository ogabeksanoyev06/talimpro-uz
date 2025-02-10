<template>
   <div>
      <h3 class="mb-6 text-base font-semibold md:text-xl lg:mb-8 lg:text-2xl">Ishlangan testlarni fanlar kesimida hisoboti</h3>
      <a-table :columns="columns" :data-source="filteredData" :pagination="false" bordered :scroll="{ x: true }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'subject'">
               <span @click="goToLink(record.subject?._id)" class="cursor-pointer text-primary">{{ record.subject?.name_uz }}</span>
            </template>
         </template>
      </a-table>
   </div>
</template>

<script setup>
const userRole = useCookie('role');

const testStore = useTestStore();
const profileStore = useProfileStore();

const { fetchSubjectSpacesResults } = testStore;
const { user } = storeToRefs(profileStore);

const router = useRouter();
const route = useRoute();

const columns = [
   {
      title: 'Fan',
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

const testId = route.query.typeId;

const goToLink = (subjectId) => {
   router.push({ path: '/spaces/sections', query: { typeId: testId, subjectId: subjectId } });
};

const { data: subjects } = await useAsyncData('subjects', async () => {
   return await fetchSubjectSpacesResults(userRole.value, { testtype: testId });
});
const filteredData = computed(() => {
   const userClassNumber = Number(user?.value?.classNumber);
   return Number(testId) === 15 ? subjects.value?.filter((row) => row?.subject?.class === userClassNumber) : subjects.value;
});
</script>
