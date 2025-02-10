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
const loading = ref(false);

const form = reactive({
   subject: undefined,
   language: "O'zbek",
   attestType: 'next',
   attestLevel: 'specialist'
});
const subjects = ref([]);

const rules = {
   subject: [{ required: true, message: 'Iltimos, fanni tanlang', trigger: 'change' }],
   attestType: [{ required: true, message: 'Iltimos, Attestatsiya turini tanlang', trigger: 'change' }],
   attestLevel: [{ required: true, message: 'Iltimos, toifani tanlang', trigger: 'change' }]
};

const handleSubmitForm = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      const response = await startTest(userRole.value, testType, testId, form.subject.value, {
         attestation_type: form.attestType,
         toifa: form.attestLevel
      });
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

const { data } = await useAsyncData('subjects-attestation-type', async () => {
   return await fetchTestTypeSubject(userRole.value, testId);
});

subjects.value = data.value.filter((subject) => subject._id !== 162);

useSeoMeta({
   title: 'Attestatsiya testlari',
   description: 'Attestatsiya testlari bilan toifangizni oshirib boring'
});
</script>

<template>
   <a-card>
      <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" :size="'large'" class="flex flex-col gap-4 max-w-full items-center" @finish="handleSubmitForm">
         <a-form-item class="mb-0 max-w-96 w-full" name="subject">
            <template #label>
               <span class="text-primary">Fan</span>
            </template>
            <a-select v-model:value="form.subject" :label-in-value="true" class="w-full">
               <a-select-option v-for="subject in subjects" :key="subject._id" :value="{ value: subject._id, label: subject.name_uz }">
                  {{ subject.name_uz }}
               </a-select-option>
            </a-select>
         </a-form-item>
         <a-form-item class="max-w-96 w-full mb-0" name="language" required>
            <template #label>
               <span class="text-primary">Til</span>
            </template>
            <a-select v-model:value="form.language" :options="languageTest" class="w-full"></a-select>
         </a-form-item>
         <a-form-item class="max-w-96 w-full mb-0" name="attestType">
            <template #label>
               <span class="text-primary">Attestatsiya turi</span>
            </template>
            <a-select v-model:value="form.attestType" class="w-full">
               <a-select-option value="next">Navbatdagi</a-select-option>
               <a-select-option value="extraordinary">Navbatdan tashqari</a-select-option>
            </a-select>
         </a-form-item>
         <a-form-item class="max-w-96 w-full mb-0" name="attestLevel">
            <template #label>
               <span class="text-primary">Amaldagi toifangiz</span>
            </template>
            <a-select v-model:value="form.attestLevel" class="w-full">
               <a-select-option value="specialist">Mutaxassis toifa</a-select-option>
               <a-select-option value="second">Ikkinchi toifa</a-select-option>
               <a-select-option value="first">Birinchi toifa</a-select-option>
               <a-select-option value="highest">Oliy toifa</a-select-option>
            </a-select>
         </a-form-item>
         <AButton type="primary" html-type="submit" class="max-w-52 w-full">Testni boshlash</AButton>
      </a-form>
   </a-card>
</template>
