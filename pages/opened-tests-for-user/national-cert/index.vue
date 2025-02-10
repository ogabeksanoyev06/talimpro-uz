<template>
   <a-card>
      <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" :size="'large'" class="flex flex-col gap-4 max-w-full items-center" @finish="handleSubmitForm">
         <a-form-item class="mb-0 w-80" name="subject">
            <template #label>
               <span class="text-primary">Fan</span>
            </template>
            <a-select v-model:value="form.subject" :label-in-value="true" class="w-full">
               <a-select-option v-for="subject in subjects" :key="subject._id" :value="{ value: subject._id, label: subject.name_uz }">
                  {{ subject.name_uz }}
               </a-select-option>
            </a-select>
         </a-form-item>
         <a-form-item class="w-80 mb-0" name="language" required>
            <template #label>
               <span class="text-primary">Til</span>
            </template>
            <a-select v-model:value="form.language" :options="languageTest" class="w-full"></a-select>
         </a-form-item>
         <AButton type="primary" html-type="submit" class="max-w-52 w-full">Testni boshlash</AButton>
      </a-form>
   </a-card>
</template>

<script setup>
const testStore = useTestStore();
const { fetchTestTypeSubject, startTest } = testStore;

const route = useRoute();
const router = useRouter();
const userRole = useCookie('role');

const { showToast } = useCustomToast();

const testId = route.query.Id;
const testType = route.query.Type;

const formRef = ref();
const form = reactive({
   subject: undefined,
   language: "O'zbek"
});
const loading = ref(false);

const rules = {
   subject: [{ required: true, message: 'Iltimos, fan tanlang!', trigger: 'change' }]
};

const handleSubmitForm = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      const response = await startTest(userRole.value, testType, testId, form.subject.value);
      const redirectUrl = `/test/${testType}/${response._id}`;
      router.push(redirectUrl);
      showToast('Test muvaffaqiyatli boshlandi!', 'success');
   } catch (error) {
      showToast('Sizda tugallanmagan test mavjud!', 'info');
      console.log(error._data);
      const redirectUrl = `/test/${testType}/${error._data?.data?.active_test_id}`;
      router.push(redirectUrl);
   } finally {
      loading.value = false;
   }
};

const { data: subjects } = await useAsyncData('subjects-national-type', async () => {
   return await fetchTestTypeSubject(userRole.value, testId);
});

useSeoMeta({
   title: 'Milliy sertifikat testlari',
   description: "Milliy sertifikat testlari bilan birgalikda, milliy sertifikatingizni qo'lga kiriting"
});
</script>
