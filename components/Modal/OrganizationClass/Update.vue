<template>
   <div>
      <div @click="showModal">
         <slot />
      </div>
      <a-modal v-model:open="open" title="Sinfni tahrirlash" ok-text="Saqlash" :confirm-loading="loading" @ok="handleOk" @cancel="resetForm">
         <a-skeleton active v-if="loadingClassById" />
         <a-form v-else ref="formRef" :model="form" :rules="rules" layout="vertical" class="max-w-[500px] mx-auto" @finish="handleToSubmit">
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
         </a-form>
      </a-modal>
   </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const props = defineProps({
   classId: [String, Number]
});

const classStore = useClassesStore();
const { updateClass, fetchClassById } = classStore;

const { showToast } = useCustomToast();

const form = reactive({
   grade: '',
   letter: ''
});

const formRef = ref(null);
const open = ref(false);
const loading = ref(false);
const loadingClassById = ref(false);

const rules = {
   grade: [{ required: true, message: 'Iltimos, sinfni kiriting', trigger: 'change' }],
   letter: [{ required: true, message: 'Iltimos, harfni kiriting', trigger: 'change' }]
};

const showModal = async () => {
   open.value = true;
   loadingClassById.value = true;
   if (props.classId) {
      try {
         const classData = await fetchClassById(props.classId);
         form.grade = classData?.number || '';
         form.letter = classData?.letter || '';
      } catch (error) {
         showToast("Ma'lumot yuklashda xatolik!", 'error');
      }
   }
   loadingClassById.value = false;
};

const handleOk = async () => {
   await handleToSubmit();
};

const handleToSubmit = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      await updateClass(props.classId, {
         number: form.grade,
         letter: form.letter
      });
      showToast("Sinf o'zgartirildi", 'success');
      open.value = false;
      resetForm();
   } catch (error) {
      showToast(error?._data?.error || 'Xatolik yuz berdi', 'error');
   } finally {
      loading.value = false;
   }
};

const resetForm = () => {
   formRef.value.resetFields();
};
</script>
