<script setup>
definePageMeta({
   layout: 'test'
});

const testStore = useTestStore();
const { fetchActiveTest, finishTest, selectedQuestion } = testStore;
const { testTimer, tests } = storeToRefs(testStore);

const { showToast } = useCustomToast();
const { updateQuery } = useQueryChange();
const userRole = useCookie('role');

const route = useRoute();
const router = useRouter();

const testType = route.params.test_type;
const testId = route.params.test_id;

const answerLabels = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
const optionIds = ref('');
const questions = ref([]);
const currentIndex = ref(0);
const timerInterval = ref(null);

const sLoading = ref(false);
const fLoading = ref(false);

const toggleQuestion = async (userRole, test_type, test_id, questionId, optionId, test_type_secondary) => {
   sLoading.value = true;
   try {
      optionIds.value = optionId;
      const response = await selectedQuestion(userRole, test_type, test_id, questionId, optionId, test_type_secondary);
      tests.value?.blogs?.forEach((blog) => {
         const question = blog?.questions.find((q) => q._id === questionId);
         if (question) {
            question.options.forEach((opt) => {
               opt.is_selected = opt._id === optionId;
            });
         }
      });
      tests.value = { ...tests.value };
   } catch (error) {
      showToast(error._data?.message, 'error');
      console.log(error);
   } finally {
      sLoading.value = false;
   }
};
const goToQuestion = (index) => {
   currentIndex.value = index;
   updateQuery('questionNumber', currentIndex.value + 1);
};
const nextQuestion = () => {
   if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
      updateQuery('questionNumber', currentIndex.value + 1);
   }
};
const previousQuestion = () => {
   if (currentIndex.value > 0) {
      currentIndex.value--;
      updateQuery('questionNumber', currentIndex.value + 1);
   }
};

const showFinishModal = () => {
   Modal.confirm({
      title: 'Testni yakunlashni xohlaysizmi',
      okText: 'Ha',
      okType: '',
      cancelText: 'Bekor qilish',
      async onOk() {
         try {
            await finishTest(userRole.value, testType, testId);
            showToast('Test muvaffaqiyatli yakunlandi!', 'success');
            router.push(`/test-attempt-results/result/?attemptId=${testId}`);
         } catch (error) {
            showToast(error.response._data.message || 'Xatolik', 'error');
         }
      },
      onCancel() {}
   });
};

const setTimer = () => {
   if (timerInterval.value) {
      clearInterval(timerInterval.value);
   }
   timerInterval.value = setInterval(() => {
      if (testTimer.value <= 0) {
         clearInterval(timerInterval.value);
         timerInterval.value = null;
         // finishTest();
      } else {
         testTimer.value--;
      }
   }, 1000);
};

const currentQuestion = computed(() => {
   return questions.value[currentIndex.value];
});
const isSelected = (options) => {
   return options.some((option) => option.is_selected);
};

const { data, pending } = await useAsyncData('test-start', () => fetchActiveTest(userRole.value, testType, testId));
questions.value = tests.value?.blogs?.flatMap((blog) =>
   blog.questions.map((question) => ({
      ...question,
      _id: question._id,
      science: blog.science,
      type: blog.test_type
   }))
);
currentIndex.value = Number(route.query.questionNumber - 1) || 0;

onMounted(() => {
   setTimer();
});

onUnmounted(() => {
   clearInterval(timerInterval.value);
});
</script>

<template>
   <!-- <a-skeleton v-if="pending" /> -->
   <div>
      <div class="sticky top-0 z-40 bg-gray-100 py-3">
         <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between gap-5">
               <span class="font-medium">Qolgan vaqt</span>
               <div class="flex flex-nowrap items-center gap-1 text-nowrap rounded-xl">
                  <span class="shrink-0">
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_711_2387)">
                           <path
                              d="M13.332 5.0602C14.3368 5.6403 15.1727 6.47256 15.7573 7.47472C16.3418 8.47687 16.6547 9.61423 16.665 10.7744C16.6754 11.9345 16.3827 13.0772 15.8161 14.0896C15.2495 15.102 14.4285 15.949 13.4342 16.5469C12.44 17.1448 11.3069 17.4729 10.147 17.4987C8.98709 17.5245 7.84054 17.2472 6.82067 16.6941C5.80079 16.1411 4.9429 15.3314 4.33179 14.3452C3.72068 13.3591 3.37751 12.2305 3.3362 11.071L3.33203 10.8335L3.3362 10.596C3.37719 9.44665 3.71484 8.32743 4.31632 7.34714C4.9178 6.36685 5.76265 5.55884 6.76877 5.00164C7.77489 4.44444 8.90805 4.157 10.0581 4.16726C11.2082 4.17752 12.336 4.48513 13.332 5.0602ZM9.9987 7.5002C9.77768 7.5002 9.56572 7.58799 9.40944 7.74427C9.25316 7.90055 9.16536 8.11252 9.16536 8.33353V10.8335L9.1712 10.931C9.19508 11.1337 9.29252 11.3206 9.44505 11.4563C9.59758 11.5919 9.79459 11.6668 9.9987 11.6669H11.6654L11.7629 11.661C11.9656 11.6371 12.1525 11.5397 12.2881 11.3872C12.4237 11.2346 12.4987 11.0376 12.4987 10.8335L12.4929 10.736C12.469 10.5333 12.3715 10.3464 12.219 10.2108C12.0665 10.0752 11.8695 10.0002 11.6654 10.0002H10.832V8.33353L10.8262 8.23603C10.8023 8.03332 10.7049 7.84642 10.5523 7.71079C10.3998 7.57516 10.2028 7.50022 9.9987 7.5002Z"
                              fill="#5B5B5B"
                           ></path>
                           <path
                              d="M5.34224 2.65941C5.51362 2.53215 5.7273 2.4755 5.93922 2.50116C6.15114 2.52682 6.34513 2.63282 6.48119 2.79731C6.61725 2.9618 6.68499 3.17222 6.67046 3.38519C6.65592 3.59816 6.56022 3.79744 6.40307 3.94191L6.32224 4.00858L4.03057 5.67525C3.85925 5.80451 3.64467 5.8627 3.43152 5.83768C3.21837 5.81267 3.02308 5.70638 2.88635 5.54097C2.74961 5.37555 2.68197 5.16376 2.6975 4.94971C2.71303 4.73566 2.81055 4.53585 2.96974 4.39191L3.05057 4.32525L5.34224 2.65941Z"
                              fill="#5B5B5B"
                           ></path>
                           <path
                              d="M13.4908 2.84328C13.6101 2.67913 13.7853 2.56418 13.9834 2.51999C14.1814 2.47581 14.3888 2.50542 14.5666 2.60328L14.655 2.65911L16.9466 4.32578C17.118 4.45043 17.2355 4.6357 17.2751 4.84388C17.3147 5.05207 17.2736 5.26754 17.1599 5.44644C17.0463 5.62534 16.8688 5.75424 16.6636 5.80691C16.4583 5.85958 16.2407 5.83205 16.055 5.72994L15.9666 5.67411L13.675 4.00745C13.5865 3.94304 13.5115 3.86184 13.4544 3.76848C13.3973 3.67513 13.3592 3.57143 13.3422 3.46333C13.3252 3.35523 13.3296 3.24483 13.3552 3.13844C13.3809 3.03205 13.4264 2.93176 13.4908 2.84328Z"
                              fill="#5B5B5B"
                           ></path>
                        </g>
                        <defs>
                           <clipPath id="clip0_711_2387"><rect width="20" height="20" fill="white"></rect></clipPath>
                        </defs>
                     </svg>
                  </span>
                  <span class="text-2xl font-semibold text-primary digital-font"> {{ timerFormat(testTimer) }}</span>
               </div>
            </div>
         </div>
      </div>
      <div class="relative lg:min-h-[calc(100vh-56px)] py-10">
         <div class="max-w-7xl mx-auto px-4">
            <div class="relative grid lg:grid-cols-[minmax(0,1fr)_450px] gap-5 lg:gap-10">
               <main class="flex grow flex-col gap-2.5">
                  <a-card>
                     <p class="text-lg md:text-2xl font-semibold">{{ currentQuestion?.science?.name_uz }}</p>
                  </a-card>
                  <a-card>
                     <div class="pb-8 [&_p]:mt-1">
                        <h3 class="text-base font-bold">{{ currentIndex + 1 }}. Mos keluvchi javobni tanlang.</h3>
                        <div v-katex:auto v-html="currentQuestion.question_text" class="font-medium mb-2" />
                     </div>
                     <ul class="grid grid-cols-1 gap-3">
                        <li
                           v-for="(option, i) in currentQuestion.options"
                           @click="toggleQuestion(userRole, testType, testId, currentQuestion._id, option._id, currentQuestion?.type)"
                           v-katex:auto
                           class="transition-300 flex min-h-10 cursor-pointer items-center justify-between gap-1 overflow-x-auto overflow-y-hidden rounded-xl border-2 border-transparent bg-gray-50 px-4 py-1 sm:min-h-14 sm:text-base hover:border-current"
                           :class="{ 'shadow-card !border-black': option.is_selected }"
                        >
                           <div class="flex flex-1 items-center gap-1">
                              <span class="font-bold">{{ answerLabels[i] }}.</span>
                              <span v-html="option.text"></span>
                           </div>
                           <span class="loader" v-if="sLoading && option._id === optionIds"></span>
                        </li>
                     </ul>
                  </a-card>
               </main>
               <aside class="sticky top-20 flex w-full flex-col gap-2.5 h-full lg:h-[calc(100vh-140px)]">
                  <a-card class="lg:overflow-y-auto invisible-scroll">
                     <div class="flex justify-center gap-3 mb-3">
                        <a-button @click="previousQuestion" :disabled="currentIndex === 0" class="h-8">
                           <ArrowLeftOutlined />
                           Oldingi
                        </a-button>

                        <a-button @click="nextQuestion" :disabled="currentIndex === questions.length - 1" class="h-8">
                           Keyingi
                           <ArrowRightOutlined />
                        </a-button>
                     </div>
                     <div class="flex flex-wrap justify-center">
                        <a-button
                           v-for="(question, key) in questions"
                           @click="goToQuestion(key)"
                           :type="isSelected(question.options) ? 'primary' : 'default'"
                           class="w-10 h-8 m-1 p-0"
                           :class="{ 'border-primary': currentIndex === key }"
                        >
                           {{ key + 1 }}
                        </a-button>
                     </div>
                  </a-card>
                  <a-card>
                     <div class="flex flex-col items-center !w-full justify-center">
                        <div class="text-5xl mb-3 digital-font num">{{ timerFormat(testTimer) }}</div>
                        <a-button danger class="w-full flex items-center justify-center" :size="'large'" @click="showFinishModal">
                           <LoginOutlined />
                           Testni yakunlash
                        </a-button>
                     </div>
                  </a-card>
               </aside>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.num {
   font-variant-numeric: tabular-nums;
}
.loader {
   width: 20px;
   height: 20px;
   border: 3px solid rgba(0, 0, 0, 0.3);
   border-top: 3px solid #000;
   border-radius: 50%;
   animation: spin 1s linear infinite;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }
   100% {
      transform: rotate(360deg);
   }
}
</style>
