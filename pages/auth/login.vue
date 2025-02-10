<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

definePageMeta({
   layout: 'auth'
});
const authStore = useAuthStore();
const { login, setTokens } = authStore;

const { showToast } = useCustomToast();

const formRef = ref(null);
const loading = ref(false);
const form = reactive({
   login: '',
   password: ''
});
const rules = {
   login: [{ required: true, message: 'Iltimos, Loginni kiriting', trigger: 'change' }],
   password: [{ required: true, message: 'Iltimos, Parolni kiriting', trigger: 'change' }]
};

const loginToSystem = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      const response = await login(form);
      const loginType = form.login.charAt(0).toLowerCase();
      const token = response.token;
      setTokens({ access: token, role: userRoles[loginType] });
      navigateTo('/');
      showToast('Tizimga kirdingiz', 'success');
   } catch (error) {
      showToast(error?._data?.error, 'error');
   } finally {
      loading.value = false;
   }
};

useSeoMeta({
   title: "Ta'limPro",
   description: 'Online test platformasi'
});
</script>

<template>
   <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" :size="'large'" class="flex flex-col gap-5 w-full items-center" @finish="loginToSystem">
      <div class="text-center mb-6">
         <h1 class="text-2xl font-bold lg:text-3xl">Kirish</h1>
         <p class="text-sm lg:text-base">Kirish uchun login va parolni kiriting</p>
      </div>
      <a-form-item class="mb-0 w-full" name="login">
         <template #label>
            <span class="text-primary">Login</span>
         </template>
         <a-input v-model:value="form.login" class="w-full"></a-input>
      </a-form-item>
      <a-form-item class="mb-0 w-full" name="password">
         <template #label>
            <span class="text-primary">Parol</span>
         </template>
         <a-input-password v-model:value="form.password" class="w-full" />
      </a-form-item>
      <a-form-item class="mb-0 w-full">
         <a-button :loading="loading" type="primary" html-type="submit" class="w-full">Tizimga kirish</a-button>
      </a-form-item>
   </a-form>
</template>
