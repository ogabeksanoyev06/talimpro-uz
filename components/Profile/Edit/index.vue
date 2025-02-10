<template>
   <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" class="max-w-7xl flex flex-col gap-6" @finish="handleSubmit">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <a-form-item label="Ism" name="name" class="mb-0">
            <a-input v-model:value="form.name" />
         </a-form-item>
         <a-form-item label="Familiya" name="surname" class="mb-0">
            <a-input v-model:value="form.surname" />
         </a-form-item>
         <a-form-item label="Otasining ismi" name="father_name" class="mb-0">
            <a-input v-model:value="form.father_name" />
         </a-form-item>
         <a-form-item label="Telefon raqam" name="phone_number" class="mb-0">
            <a-input v-model:value="form.phone_number" addon-before="+998" v-maska="'#########'" />
         </a-form-item>
      </div>
      <div class="flex flex-wrap gap-1 justify-end">
         <a-button :loading="loading" type="primary" htmlType="submit">Saqlash</a-button>
         <a-button @click="resetForm">Tozalash</a-button>
      </div>
   </a-form>
</template>

<script setup>
const profileStore = useProfileStore();
const { updateUser, fetchUser } = profileStore;
const { user } = storeToRefs(profileStore);

const { showToast } = useCustomToast();

const userRole = useCookie('role');

const formRef = ref(null);

const loading = ref(false);
const form = reactive({
   name: '',
   surname: '',
   father_name: '',
   phone_number: ''
});

const rules = {
   name: [{ required: true, message: 'Iltimos, ismingizni kiriting', trigger: 'blur' }],
   surname: [{ required: true, message: 'Iltimos, familiyangizni kiriting', trigger: 'blur' }],
   father_name: [{ required: true, message: 'Iltimos, otangizning ismini kiriting', trigger: 'blur' }],
   phone_number: [
      { required: true, message: 'Iltimos, telefon raqamingizni kiriting', trigger: 'change' },
      { len: 9, message: "Telefon raqami 9 ta belgidan iborat bo'lishi kerak", trigger: 'change' }
   ]
};

const handleSubmit = async () => {
   loading.value = true;
   try {
      await updateUser(userRole.value, form);
      fetchUser(userRole.value);
      showToast("Ma'lumotlar saqlandi", 'success');
   } catch (error) {
      console.log(error);
      showToast(error?._data?.error, 'error');
   } finally {
      loading.value = false;
   }
};

const resetForm = () => {
   form.name = user.value?.name || '';
   form.surname = user.value?.surname || '';
   form.father_name = user.value?.father_name || '';
   form.phone_number = user.value?.phone_number || '';
};

watchEffect(() => {
   if (user.value) {
      form.name = user.value.name || '';
      form.surname = user.value.surname || '';
      form.father_name = user.value.father_name || '';
      form.phone_number = user.value.phone_number || '';
   }
});
</script>
