<script setup>
const columns = [
   {
      title: 'Fan',
      dataIndex: 'subject',
      key: 'subject'
   },
   {
      title: 'Testlar soni',
      dataIndex: 'count',
      key: 'count'
   },
   {
      title: "To'g'ri javoblar soni",
      dataIndex: 'corrAns',
      key: 'corrAns'
   },
   {
      title: 'Xato javoblar soni',
      dataIndex: 'incAns',
      key: 'incAns'
   },
   {
      title: 'Belgilanmagan',
      dataIndex: 'unSelAns',
      key: 'unSelAns'
   },
   {
      title: 'Ball',
      key: 'bal',
      dataIndex: 'bal'
   }
];
const columnsNationalCert = [
   { title: 'Daraja', dataIndex: 'grade', key: 'grade' },
   { title: 'Tashxis', dataIndex: 'diagnosis', key: 'diagnosis' }
];
const route = useRoute();
const userRole = useCookie('role');

const testStore = useTestStore();
const { fetchAttemptResultById } = testStore;
const { result } = storeToRefs(testStore);

const attemptId = route.query.attemptId;
const allQuestions = ref([]);

const diagnosisRules = {
   highest: {
      passed: {
         minScore: 80,
         message: 'Attestatsiyadan o‘tdi, oliy malaka toifasi (bosh o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 79,
         message: 'Attestatsiyadan o‘tmadi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) ga tushirilsin'
      }
   },
   first: {
      passedHighest: {
         minScore: 80,
         message: 'Attestatsiyadan o‘tdi, oliy malaka toifasi (bosh o‘qituvchi lavozimi) berilsin'
      },
      passedFirst: {
         minScore: 70,
         maxScore: 79,
         message: 'Attestatsiyadan o‘tdi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 69,
         message: 'Attestatsiyadan o‘tmadi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) ga tushirilsin'
      }
   },
   second: {
      passedFirst: {
         minScore: 70,
         message: 'Attestatsiyadan o‘tdi, birinchi malaka toifasi (yetakchi o‘qituvchi lavozimi) berilsin'
      },
      passedSecond: {
         minScore: 60,
         maxScore: 69,
         message: 'Attestatsiyadan o‘tdi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) saqlansin'
      },
      failed: {
         maxScore: 59,
         message: 'Attestatsiyadan o‘tmadi, mutaxassis (oliy ma’lumotli o‘qituvchi) lavozimiga tushirilsin'
      }
   },
   specialist: {
      passedSecond: {
         minScore: 60,
         message: 'Attestatsiyadan o‘tdi, ikkinchi malaka toifasi (katta o‘qituvchi lavozimi) berilsin'
      },
      failed: {
         maxScore: 59,
         message: 'Attestatsiyadan o‘tmadi, mutaxassis (oliy ma’lumotli o‘qituvchi) saqlansin'
      }
   }
};

const calculateCorrectAnswers = (questions) => {
   return questions.reduce((count, question) => {
      return count + question.options.filter((option) => option.is_correct && option.is_selected).length;
   }, 0);
};
const calculateIncorrectAnswers = (questions) => {
   return questions.reduce((count, question) => {
      return count + question.options.filter((option) => !option.is_correct && option.is_selected).length;
   }, 0);
};
const calculateUnselectedAnswers = (questions) => {
   return questions.reduce((count, question) => {
      // Agar barcha javoblar tanlanmagan bo'lsa, 1 ga oshirish
      return count + (question.options.every((option) => !option.is_selected) ? 1 : 0);
   }, 0);
};
const getDiagnosisResult = (category, totalScore, isExceptional) => {
   const rules = diagnosisRules[category];
   if (isExceptional && totalScore < 60) {
      return 'Siz yetarlicha ball to‘play olmaganligingiz uchun amaldagi toifangiz o‘zgarishsiz qoladi va sizga yangi sertifikat berilmaydi.';
   }
   switch (category) {
      case 'highest':
         return totalScore >= rules.passed.minScore ? rules.passed.message : rules.failed.message;
      case 'first':
         if (totalScore >= rules.passedHighest.minScore) {
            return rules.passedHighest.message;
         } else if (totalScore >= rules.passedFirst.minScore && totalScore <= rules.passedFirst.maxScore) {
            return rules.passedFirst.message;
         } else {
            return rules.failed.message;
         }
      case 'second':
         if (totalScore >= rules.passedFirst.minScore) {
            return rules.passedFirst.message;
         } else if (totalScore >= rules.passedSecond.minScore && totalScore <= rules.passedSecond.maxScore) {
            return rules.passedSecond.message;
         } else {
            return rules.failed.message;
         }
      case 'specialist':
         return totalScore >= rules.passedSecond.minScore ? rules.passedSecond.message : rules.failed.message;
      default:
         return 'Tashxis aniqlanmadi';
   }
};
const calculateGrade = (score) => {
   let gradeInfo = [];
   switch (true) {
      case score >= 70:
         gradeInfo.push({ grade: 'A+', message: 'OTMning bakalavriatiga kirish test sinovlarida ushbu fandan maksimal ball beriladi' });
         break;
      case score >= 65:
         gradeInfo.push({ grade: 'A', message: 'OTMning bakalavriatiga kirish test sinovlarida ushbu fandan maksimal ball beriladi' });
         break;
      case score >= 60:
         gradeInfo.push({ grade: 'B+', message: 'OTMning bakalavriatiga kirish test sinovlarida mos ravishda maksimal ballga nisbatan proporsional ball beriladi' });
         break;
      case score >= 55:
         gradeInfo.push({ grade: 'B', message: 'OTMning bakalavriatiga kirish test sinovlarida mos ravishda maksimal ballga nisbatan proporsional ball beriladi' });
         break;
      case score >= 50:
         gradeInfo.push({ grade: 'C+', message: 'OTMning bakalavriatiga kirish test sinovlarida mos ravishda maksimal ballga nisbatan proporsional ball beriladi' });
         break;
      case score >= 46:
         gradeInfo.push({ grade: 'C', message: 'OTMning bakalavriatiga kirish test sinovlarida mos ravishda maksimal ballga nisbatan proporsional ball beriladi' });
         break;
      default:
         gradeInfo.push({ grade: 'Mavjud emas', message: 'Sizning balingiz yetarli emas, sizga sertifikat taqdim etilmaydi!' });
   }

   return gradeInfo;
};
const duration = computed(() => {
   if (results.value) {
      const startedAt = result.value.startedAt;
      const endedAt = result.value.endedAt;
      return (endedAt - startedAt) / 1000;
   }
   return 0;
});

const { data: results } = await useAsyncData('results', async () => {
   return await fetchAttemptResultById(userRole.value, attemptId);
});
allQuestions.value = [...results.value.data?.main_test, ...results.value.data?.third_test, ...results.value.data?.secondary_test];
</script>

<template>
   <div>
      <div class="flex w-full gap-3 flex-wrap justify-center items-center my-5">
         <div class="text-3xl md:text-3xl lg:text-4xl font-semibold text-center text-green bg-white border-2 border-green p-1 sm:p-2 rounded-xl flex justify-center shadow-md max-w-80 w-full">
            {{ calculateTotalScore(allQuestions, results?.data?.test_type).totalScore }} / {{ calculateTotalScore(allQuestions, results?.data?.test_type).maxBall }}
         </div>
         <div class="text-3xl md:text-3xl lg:text-4xl digital-font text-center bg-white border-2 p-1 sm:p-2 rounded-xl shadow-md flex justify-center max-w-80 w-full">{{ timerFormat(duration) }}</div>
      </div>
      <a-table :columns="columns" :data-source="result.results" :pagination="false" bordered :scroll="{ x: true }" class="whitespace-nowrap max-w-4xl mx-auto">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'subject'"> {{ record.science?.name_uz }} </template>
            <template v-if="column.key === 'count'"> {{ record.questions?.length }} </template>
            <template v-if="column.key === 'corrAns'"> {{ calculateCorrectAnswers(record.questions) }} </template>
            <template v-if="column.key === 'incAns'"> {{ calculateIncorrectAnswers(record.questions) }} </template>
            <template v-if="column.key === 'unSelAns'"> {{ calculateUnselectedAnswers(record.questions) }} </template>
            <template v-if="column.key === 'bal'">
               <span class="text-green font-medium">{{ record.ball * calculateCorrectAnswers(record.questions) }}</span>
            </template>
         </template>
      </a-table>
      <a-table
         v-if="result.test_type === 'national_certificate'"
         :columns="columnsNationalCert"
         :data-source="calculateGrade(calculateTotalScore(allQuestions, results?.data?.test_type).totalScore)"
         :pagination="false"
         bordered
         :scroll="{ x: true }"
         class="whitespace-nowrap max-w-4xl mx-auto mt-5"
      >
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'grade'"> {{ record.grade }}</template>
            <template v-if="column.key === 'diagnosis'">
               <span :class="calculateTotalScore(allQuestions, results?.data?.test_type).maxBall >= 45 ? 'text-red-500' : 'text-green'">{{ record.message }}</span>
            </template>
         </template>
      </a-table>
      <a-card v-if="result.test_type === 'attestation'" class="mt-5 max-w-4xl mx-auto text-center">
         <p class="!text-red-500">
            {{ getDiagnosisResult(result?.comments?.toifa, result.correct_answers * 2, result?.comments?.attestation_type === 'extraordinary') }}
         </p>
      </a-card>

      <div class="text-center mt-4 flex flex-wrap gap-2 justify-center">
         <NuxtLink :to="`/test-attempt/?attemptId=${attemptId}`">
            <a-button type="primary">Ko'rish</a-button>
         </NuxtLink>
         <NuxtLink
            :to="{
               path: `/test-attempt-results/compare`,
               query: {
                  testAttemptId: attemptId,
                  subjects: [results?.data.subject?._id, results?.data.subject_2?._id].join(',')
               }
            }"
            v-if="result.test_type === 'dtm'"
         >
            <a-button type="primary" class="!bg-green !border-green">Solishtirish</a-button>
         </NuxtLink>
         <a-button disabled>Fikr bildirish</a-button>
      </div>
   </div>
</template>
