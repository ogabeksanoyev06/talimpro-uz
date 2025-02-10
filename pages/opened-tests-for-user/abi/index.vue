<script setup>
const testStore = useTestStore();
const universitiesStore = useUniversitiesStore();

const { fetchSearchUniversity, fetchAllFaculty } = universitiesStore;
const { startTest } = testStore;

const route = useRoute();
const router = useRouter();
const userRole = useCookie('role');

const { showToast } = useCustomToast();

const testId = route.query.Id;
const testType = route.query.Type;

const formRef = ref();
const loading = ref(false);
const dirLoading = ref(false);
const form = reactive({
   langnm: 'O`zbek',
   emnm: undefined,
   university: undefined,
   direction: undefined,
   subject1: 'Ona tili (majburiy)',
   subject2: 'Matematika (majburiy)',
   subject3: "O'zbekiston tarixi (majburiy)",
   subject4: '',
   subject5: ''
});
const search = ref('');

const studyTypeTest = [
   { label: 'Kunduzgi', value: 'Kunduzgi' },
   { label: 'Sirtqi', value: 'Sirtqi' },
   { label: 'Kechki', value: 'Kechki' }
];

const directions = ref([]);
const selectedDirection = ref();

const rules = {
   langnm: [{ required: true, message: "Ta'lim tilini tanlang", trigger: 'change' }],
   emnm: [{ required: true, message: "O'qish turini tanlang", trigger: 'change' }],
   university: [{ required: true, message: 'Universitetni tanlang', trigger: 'change' }],
   direction: [{ required: true, message: "Yo'nalishni tanlang", trigger: 'change' }]
};

const filterOption = (input, option) => {
   return option.value.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChange = async () => {
   form.direction = undefined;
   dirLoading.value = true;
   try {
      directions.value = await fetchAllFaculty({
         OTM: form.university.label,
         emnm: form.emnm,
         langnm: form.langnm
      });
   } catch (error) {
      console.log(error);
   } finally {
      dirLoading.value = false;
   }
};

const handleSubmitForm = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      if (!form.subject4 && !form.subject5) return;
      const response = await startTest(userRole.value, testType, testId, form.direction.value);
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

const handleChangeDirection = () => {
   selectedDirection.value = directions.value?.find((faculty) => faculty._id === form.direction.value);
   if (selectedDirection.value) {
      form.subject4 = selectedDirection.value.subject_1?.name_uz || '';
      form.subject5 = selectedDirection.value.subject_2?.name_uz || '';
   }
};

const { data: universities } = await useAsyncData('universities', async () => {
   return await fetchSearchUniversity({ search: search.value });
});
</script>

<template>
   <div>
      <a-card>
         <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" :size="'large'" class="flex flex-col items-center gap-4 max-w-7xl mx-auto" @finish="handleSubmitForm">
            <a-form-item class="mb-0 max-w-96 w-full" name="langnm" required>
               <template #label>
                  <span class="text-primary">Ta'lim tili</span>
               </template>
               <a-select v-model:value="form.langnm" :options="languageTest" class="w-full" />
            </a-form-item>
            <a-form-item class="mb-0 max-w-96 w-full" name="emnm">
               <template #label>
                  <span class="text-primary">O'qish turini tanlang</span>
               </template>
               <a-select v-model:value="form.emnm" :options="studyTypeTest" class="w-full" />
            </a-form-item>
            <a-form-item class="mb-0 max-w-96 w-full" name="university">
               <template #label>
                  <span class="text-primary">Universitetni tanlang</span>
               </template>
               <a-select :disabled="!form.emnm" show-search :filter-option="filterOption" @change="handleChange" v-model:value="form.university" :label-in-value="true" class="w-full">
                  <a-select-option v-for="university in universities" :key="university._id" :value="{ value: university._id, label: university.OTM }">
                     {{ university.OTM }}
                  </a-select-option>
               </a-select>
            </a-form-item>
            <a-form-item class="mb-0 max-w-96 w-full" name="direction">
               <template #label>
                  <span class="text-primary">Yo'nalishni tanlang</span>
               </template>
               <a-select @change="handleChangeDirection" :disabled="!form.university" show-search :filter-option="filterOption" v-model:value="form.direction" :label-in-value="true" :loading="dirLoading" class="w-full">
                  <a-select-option v-for="direction in directions" :key="direction._id" :value="{ value: direction._id, label: direction.dirnm }">
                     {{ direction.dirnm }}
                  </a-select-option>
               </a-select>
            </a-form-item>
            <div class="flex justify-center max-w-52 w-full">
               <a-button type="primary" html-type="submit" class="max-w-52 w-full mx-auto">Testni boshlash</a-button>
            </div>
         </a-form>
         <a-form
            v-if="form.direction && selectedDirection && form.subject4 && form.subject5"
            layout="vertical"
            :size="'large'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto items-center mt-10"
         >
            <a-form-item class="mb-0" name="subject1">
               <template #label>
                  <span class="text-primary">1-fan (10 ta savol)</span>
               </template>
               <a-input v-model:value="form.subject1" placeholder="Ona tili (majburiy)" readonly />
            </a-form-item>

            <a-form-item class="mb-0" name="subject2">
               <template #label>
                  <span class="text-primary">2-fan (10 ta savol)</span>
               </template>
               <a-input v-model:value="form.subject2" placeholder="Matematika (majburiy)" readonly />
            </a-form-item>

            <a-form-item class="mb-0" name="subject3">
               <template #label>
                  <span class="text-primary">3-fan (10 ta savol)</span>
               </template>
               <a-input v-model:value="form.subject3" placeholder="O'zbekiston tarixi (majburiy)" readonly />
            </a-form-item>

            <a-form-item class="mb-0" name="subject4">
               <template #label>
                  <span class="text-primary">4-fan (30 ta savol)</span>
               </template>
               <a-input v-model:value="form.subject4" placeholder="4-fan" readonly />
            </a-form-item>

            <a-form-item class="mb-0" name="subject5">
               <template #label>
                  <span class="text-primary">5-fan (30 ta savol)</span>
               </template>
               <a-input v-model:value="form.subject5" placeholder="5-fan" readonly />
            </a-form-item>
         </a-form>
      </a-card>
      <a-card v-if="form.direction && selectedDirection && !form.subject4 && !form.subject5" class="text-center text-orange-500 mt-5"> Tizimda tanlangan yo'nalish mavjud emas, tez orada qo'shiladi. </a-card>
   </div>
</template>
