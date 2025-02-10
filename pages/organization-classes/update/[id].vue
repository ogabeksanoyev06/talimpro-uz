<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const classStore = useClassesStore();
const { updateClass, fetchClassById } = classStore;

const { showToast } = useCustomToast();
const route = useRoute();

const form = reactive({
   grade: '',
   letter: ''
});
const formRef = ref(null);
const loading = ref(false);

const classId = route.params.id;

const rules = {
   grade: [{ required: true, message: 'Iltimos, sinfni kiriting', trigger: 'change' }],
   letter: [{ required: true, message: 'Iltimos, harfni kiriting', trigger: 'change' }]
};

const handleToSubmit = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      await updateClass(classId, {
         number: form.grade,
         letter: form.letter
      });
      showToast("Sinf o'zgartirildi", 'success');
      navigateTo('/organization-classes');
   } catch (error) {
      showToast(error?._data?.error, 'error');
   } finally {
      loading.value = false;
   }
};

const { data: classById, pending } = await useAsyncData(`classes-${classId}`, async () => {
   return await fetchClassById(classId);
});

form.grade = classById.value.number;
form.letter = classById.value.letter;
</script>

<template>
   <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="max-w-[500px] mx-auto" @finish="handleToSubmit">
      <a-form-item class="w-full" name="grade">
         <template #label>
            <span class="text-primary">Sinf</span>
         </template>
         <a-select v-model:value="form.grade" :options="classes" class="w-full"></a-select>
      </a-form-item>
      <a-form-item class="w-full" name="letter">
         <template #label>
            <span class="text-primary">Harf</span>
         </template>
         <a-input v-model:value="form.letter" class="w-full" />
      </a-form-item>
      <a-form-item>
         <a-button :loading="loading" type="primary" html-type="submit">Saqlash</a-button>
      </a-form-item>
   </a-form>
</template>
