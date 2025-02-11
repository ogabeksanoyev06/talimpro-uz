<template>
   <div class="max-w-7xl">
      <a-form layout="vertical" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <a-form-item label="Viloyat" name="region" class="mb-0">
            <a-input v-model:value="formState.region" readonly />
         </a-form-item>

         <a-form-item label="Tuman" name="district" class="mb-0">
            <a-input v-model:value="formState.district" readonly />
         </a-form-item>

         <a-form-item label="Maktab" name="school" class="mb-0">
            <a-input v-model:value="formState.school" readonly />
         </a-form-item>

         <a-form-item label="Sinf" name="class" class="mb-0" v-if="userRole === 'pupil'">
            <a-input v-model:value="formState.class" readonly />
         </a-form-item>

         <a-form-item label="Login" name="login" class="mb-0">
            <a-input v-model:value="formState.login" readonly />
         </a-form-item>

         <a-form-item label="Tarif muddati" name="tariff" class="mb-0">
            <a-input v-model:value="formState.tariff" readonly />
         </a-form-item>
      </a-form>
   </div>
</template>

<script setup>
const profileStore = useProfileStore();
const { user } = storeToRefs(profileStore);

const userRole = useCookie('role');

const formState = reactive({
   region: user.value?.region || '',
   district: user.value?.district || '',
   school: user.value?.school || '',
   class: user.value?.class || '',
   login: user.value?.login || '',
   tariff: user.value?.tariff || ''
});
</script>
