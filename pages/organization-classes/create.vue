<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const classStore = useClassesStore();
const { createClass } = classStore;

const { showToast } = useCustomToast();

const formRef = ref(null);
const loading = ref(false);

const form = reactive({
   grade: '',
   letter: ''
});
const rules = {
   grade: [{ required: true, message: 'Iltimos, Sinfni kiriting', trigger: 'change' }],
   letter: [{ required: true, message: 'Iltimos, Harfni kiriting', trigger: 'change' }]
};

const handleToSubmit = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      await createClass({
         number: form.grade,
         letter: form.letter
      });
      showToast("Sinf qo'shildi", 'success');
      navigateTo('/organization-classes');
   } catch (error) {
      showToast(error?._data?.error, 'error');
   } finally {
      loading.value = false;
   }
};
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
