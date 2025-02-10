<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const teachersStore = useTeachersStore();
const pupilsStore = usePupilsStore();
const classStore = useClassesStore();

const { createPupil } = pupilsStore;
const { createTeacher } = teachersStore;
const { fetchClasses } = classStore;

const { showToast } = useCustomToast();

const formRef = ref(null);
const loading = ref(false);

const userRoleOptions = [
   {
      value: 'pupil',
      label: "O'quvchi"
   },
   {
      value: 'teacher',
      label: "O'qituvchi"
   }
];

const form = reactive({
   userRole: 'pupil',
   places: undefined,
   firstName: '',
   lastName: '',
   middleName: '',
   phoneNumber: ''
});

const rules = {
   firstName: [
      { required: true, message: 'Iltimos, ismni kiriting', trigger: 'change' },
      { min: 2, max: 50, message: "Ism 2 dan 50 gacha bo'lishi kerak", trigger: 'change' }
   ],
   lastName: [
      { required: true, message: 'Iltimos, familiyani kiriting', trigger: 'change' },
      { min: 2, max: 50, message: "Familiya 2 dan 50 gacha bo'lishi kerak", trigger: 'change' }
   ],
   middleName: [
      { required: true, message: "Iltimos, maydonni to'ldiring ", trigger: 'change' },
      { min: 2, max: 50, message: "Familiya 2 dan 50 gacha bo'lishi kerak", trigger: 'change' }
   ],
   phoneNumber: [
      { required: true, message: 'Iltimos, telefon raqamini kiriting', trigger: 'change' },
      { min: 9, message: "Telefon raqam 9 belgidan iborat bo'lishi kerak", trigger: 'change' }
   ],
   userRole: [{ required: true, message: 'Iltimos, rolni tanlang', trigger: 'change' }],
   places: [{ required: true, message: 'Iltimos, joyni tanlang', trigger: 'change' }]
};

const layout = {
   labelCol: { xs: { span: 24 }, sm: { span: 8 } },
   wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
};
const tailLayout = {
   wrapperCol: { xs: { span: 24 }, sm: { offset: 8, span: 16 } }
};

const handleToSubmit = async () => {
   loading.value = true;
   try {
      await formRef.value.validate();
      if (form.userRole === 'pupil') {
         await createPupil({
            class: form.places.value,
            name: form.firstName,
            surname: form.lastName,
            father_name: form.middleName,
            phone_number: form.phoneNumber
         });
         showToast("O'quvchi qo'shildi", 'success');
      } else if (form.userRole === 'teacher') {
         await createTeacher({
            name: form.firstName,
            surname: form.lastName,
            father_name: form.middleName,
            phone_number: form.phoneNumber
         });
         showToast("O'qituvchi qo'shildi", 'success');
      }
      formRef.value.resetFields();
   } catch (error) {
      showToast(error?._data?.error || 'Xatolik yuz berdi', 'error');
   } finally {
      loading.value = false;
   }
};

const filterOption = (input, option) => {
   return option.value.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const { data: classes, pending } = await useAsyncData('classes', async () => {
   return await fetchClasses();
});
</script>

<template>
   <a-form ref="formRef" :model="form" :rules="rules" v-bind="layout" @finish="handleToSubmit" style="max-width: 800px">
      <a-form-item class="w-full" name="userRole">
         <template #label>
            <span class="text-primary">Rol</span>
         </template>
         <a-select v-model:value="form.userRole" class="w-full">
            <a-select-option v-for="item in userRoleOptions" :key="item.value">
               {{ item.label }}
            </a-select-option>
         </a-select>
      </a-form-item>
      <a-form-item class="w-full" name="places" v-if="form.userRole === 'pupil'">
         <template #label>
            <span class="text-primary">Joy</span>
         </template>
         <a-select show-search @change="handleChange" :filter-option="filterOption" v-model:value="form.places" :label-in-value="true" class="w-full">
            <a-select-option v-for="item in classes" :key="item._id" :value="{ value: item._id, label: item.number + '-' + item.letter }">
               {{ item.number + '-' + item.letter }}
            </a-select-option>
         </a-select>
      </a-form-item>
      <a-form-item class="w-full" name="firstName">
         <template #label>
            <span class="text-primary">Ism</span>
         </template>
         <a-input v-model:value="form.firstName" class="w-full" />
      </a-form-item>
      <a-form-item class="w-full" name="lastName">
         <template #label>
            <span class="text-primary">Familiya</span>
         </template>
         <a-input v-model:value="form.lastName" class="w-full" />
      </a-form-item>
      <a-form-item class="w-full" name="middleName">
         <template #label>
            <span class="text-primary">Otasining ismi</span>
         </template>
         <a-input v-model:value="form.middleName" class="w-full" />
      </a-form-item>
      <a-form-item class="w-full" name="phoneNumber">
         <template #label>
            <span class="text-primary">Telefon raqami</span>
         </template>
         <a-input v-model:value="form.phoneNumber" addon-before="+998" v-maska="'#########'" class="w-full" />
      </a-form-item>
      <a-form-item v-bind="tailLayout">
         <a-button :loading="loading" type="primary" htmlType="submit">Qo'shish</a-button>
      </a-form-item>
   </a-form>
</template>
