<script setup>
import { useQueryChange } from '@/composables/useQueryChange';

const testStore = useTestStore();
const { fetchAttemptResultById } = testStore;
const { result } = storeToRefs(testStore);

const route = useRoute();
const userRole = useCookie('role');
const { updateQuery } = useQueryChange();

const answerLabels = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
const attemptId = route.query.attemptId;
const currentIndex = ref(0);
const questions = ref([]);

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
function isCorrect(question) {
   return question.options.some((option) => option.is_selected && option.is_correct);
}
function isSelectedIncorrect(question) {
   return question.options.some((option) => option.is_selected && !option.is_correct);
}

const currentQuestion = computed(() => {
   return questions.value[currentIndex.value];
});

const { data: results } = await useAsyncData('results', async () => {
   return await fetchAttemptResultById(userRole.value, attemptId);
});
questions.value = [...results.value.data?.main_test, ...results.value.data?.third_test, ...results.value.data?.secondary_test];
currentIndex.value = Number(route.query.questionNumber - 1) || 0;
</script>

<template>
   <a-watermark :content="attemptId">
      <div class="flex flex-col gap-6">
         <a-card>
            <div class="mb-5">
               <h3 class="text-base font-bold">{{ currentIndex + 1 }}. Sizning javobingiz</h3>
               <div v-katex:auto v-html="currentQuestion.question_text" class="font-medium mb-2" />
            </div>
            <ul class="grid grid-cols-1 gap-3">
               <li
                  v-for="(option, i) in currentQuestion.options"
                  v-katex:auto
                  class="transition-300 flex min-h-10 cursor-pointer items-center justify-between gap-1 overflow-x-auto overflow-y-hidden rounded-xl border-2 border-transparent px-4 py-1 sm:min-h-14 sm:text-base"
                  :class="
                     option.is_selected && option.is_correct
                        ? 'shadow-card shadow-green bg-green text-white'
                        : option.is_selected && !option.is_correct
                        ? 'shadow-card shadow-red-700 bg-red-500 text-white'
                        : ' bg-gray-100'
                  "
               >
                  <div class="flex flex-1 items-center gap-1">
                     <span class="font-bold">{{ answerLabels[i] }}.</span>
                     <span v-html="option.text"></span>
                  </div>
               </li>
            </ul>
         </a-card>
         <a-card>
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
               <a-tooltip placement="bottom" v-for="(question, key) in questions" :key="key">
                  <template #title>
                     <span>{{ isCorrect(question) ? "To'g'ri" : isSelectedIncorrect(question) ? "Noto'g'ri" : 'Belgilanmagan' }}</span>
                  </template>

                  <a-button
                     type="primary"
                     class="w-10 h-8 m-1 p-0"
                     :class="[
                        isCorrect(question) ? '!bg-green' : isSelectedIncorrect(question) ? '!bg-red-500' : '!bg-gray-500',
                        Number(currentIndex) === key && isCorrect(question)
                           ? 'shadow-card shadow-green'
                           : Number(currentIndex) === key && isSelectedIncorrect(question)
                           ? 'shadow-card shadow-red-700'
                           : Number(currentIndex) === key
                           ? 'shadow-card shadow-gray-700'
                           : ''
                     ]"
                     @click="goToQuestion(key)"
                  >
                     {{ key + 1 }}
                  </a-button>
               </a-tooltip>
            </div>
            <div class="flex justify-center gap-3 mt-3">
               <a-button @click="nextQuestion" danger class="flex items-center h-8" disabled>
                  <ArrowUpOutlined />
                  E'tiroz yuborish
               </a-button>
            </div>
         </a-card>
      </div>
   </a-watermark>
</template>
