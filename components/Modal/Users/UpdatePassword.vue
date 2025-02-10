<template>
   <div>
      <div @click="showModal">
         <slot />
      </div>

      <a-modal v-model:open="open" title="Parolni o'zgartirish" ok-text="Saqlash" :confirm-loading="loading" @ok="handleOk" @cancel="resetForm">
         <a-form ref="formRef" :model="form" :rules="rules">
            <a-form-item has-feedback class="w-full" name="pass">
               <a-input-password v-model:value="form.pass" class="w-full" maxlength="6" placeholder="Yangi parolni kiriting" />
            </a-form-item>
         </a-form>
      </a-modal>
   </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const props = defineProps({
   role: String,
   userId: [Number, String]
});

const emit = defineEmits(['showModal']);

const profileStore = useProfileStore();
const { updatePasswordByRole } = profileStore;

const { showToast } = useCustomToast();

const form = reactive({
   pass: ''
});

const formRef = ref(null);
const open = ref(false);
const loading = ref(false);

const rules = {
   pass: [
      { required: true, message: 'Iltimos, parolni kiriting', trigger: 'change' },
      { min: 4, message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak", trigger: 'change' }
   ]
};

const showModal = async () => {
   if (!props.userId) {
      showToast('Foydalanuvchi tanlanmagan', 'error');
      return;
   }
   open.value = true;
};

const handleOk = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      await updatePasswordByRole(props.role, props.userId, {
         password: form.pass
      });
      showToast("O'zgartirildi", 'success');
      formRef.value.resetFields();
      open.value = false;
      emit('showModal');
   } catch (error) {
      showToast(error?._data?.error || 'Xatolik yuz berdi', 'error');
   } finally {
      loading.value = false;
   }
};
</script>
