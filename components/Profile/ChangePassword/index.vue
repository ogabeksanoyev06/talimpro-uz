<template>
   <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" class="max-w-7xl flex flex-col gap-6" @finish="handleSubmit">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <a-form-item has-feedback label="Hozirgi parol" name="pass" class="mb-0">
            <a-input-password v-model:value="form.pass" />
         </a-form-item>
         <a-form-item has-feedback label="Yangi parol" name="newPass" class="mb-0">
            <a-input-password v-model:value="form.newPass" />
         </a-form-item>
         <div class="max-lg:hidden"></div>
         <a-form-item has-feedback label="Yangi parolni takrorlang" name="checkPass" class="mb-0">
            <a-input-password v-model:value="form.checkPass" />
         </a-form-item>
      </div>

      <div class="flex flex-wrap justify-end gap-1">
         <a-button :loading="loading" type="primary" htmlType="submit">O'zgartirish</a-button>
         <a-button @click="resetForm">Tozalash</a-button>
      </div>
   </a-form>
</template>

<script setup>
const profileStore = useProfileStore();
const { updatePassword } = profileStore;

const { showToast } = useCustomToast();

const userRole = useCookie('role');

const formRef = ref(null);
const loading = ref(false);

const form = reactive({
   pass: '',
   newPass: '',
   checkPass: ''
});

const validatePass = async (_rule, value) => {
   if (value === '') {
      return Promise.reject('Iltimos, parolni kiriting');
   } else {
      if (form.checkPass !== '') {
         formRef.value.validateFields('checkPass');
      }
      return Promise.resolve();
   }
};

const validatePass2 = async (_rule, value) => {
   if (value === '') {
      return Promise.reject('Iltimos, parolni yana bir marta kiriting');
   } else if (value !== form.newPass) {
      return Promise.reject('Ikki parol bir-biriga mos kelmayapti!');
   } else {
      return Promise.resolve();
   }
};

const validateNewPass = async (_rule, value) => {
   if (value === '') {
      return Promise.reject('Iltimos, yangi parolni kiriting');
   } else if (value.length < 6) {
      return Promise.reject("Parol kamida 6 ta belgi bo'lishi kerak");
   } else {
      return Promise.resolve();
   }
};

const rules = {
   pass: [{ required: true, validator: validatePass, trigger: 'change' }],
   checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
   newPass: [{ required: true, validator: validateNewPass, trigger: 'change' }]
};

const handleSubmit = async () => {
   loading.value = true;
   try {
      await updatePassword(userRole.value, {
         old: form.pass,
         new: form.newPass
      });
      formRef.value.resetFields();
      showToast("Parol muvaffaqiyatli o'zgartirildi", 'success');
   } catch (error) {
      console.log(error);
      showToast(error?._data?.error, 'error');
   } finally {
      loading.value = false;
   }
};

const resetForm = () => {
   formRef.value.resetFields();
};
</script>
