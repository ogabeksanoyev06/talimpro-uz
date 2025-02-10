<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const teachersStore = useTeachersStore();
const pupilsStore = usePupilsStore();
const classStore = useClassesStore();
const { updatePupil, fetchPupilById } = pupilsStore;
const { updateTeacher, fetchTeacherById } = teachersStore;
const { fetchClasses } = classStore;

const route = useRoute();

const { showToast } = useCustomToast();

const formRef = ref(null);
const loading = ref(false);
const userId = route.params.id;
const userRole = route.query.role;

const form = reactive({
   userRole: userRole || '',
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
         await updatePupil(userId, {
            class: form.places.value,
            name: form.firstName,
            surname: form.lastName,
            father_name: form.middleName,
            phone_number: form.phoneNumber
         });
         showToast("O'quvchi ma'lumoti o'zgartirildi", 'success');
      } else if (form.userRole === 'teacher') {
         await updateTeacher(userId, {
            name: form.firstName,
            surname: form.lastName,
            father_name: form.middleName,
            phone_number: form.phoneNumber
         });
         showToast("O'qituvchi ma'lumoti o'zgartirildi", 'success');
      }
      form.firstName = '';
      form.lastName = '';
      form.middleName = '';
      form.phoneNumber = '';
   } catch (error) {
      showToast(error?._data?.error || 'Xatolik yuz berdi', 'error');
   } finally {
      loading.value = false;
   }
};

const filterOption = (input, option) => {
   return option.value.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const { data } = await useAsyncData('userInfo', async () => (userRole === 'pupil' ? await fetchPupilById(userId) : await fetchTeacherById(userId)));
if (data) {
   form.firstName = data.value.name || '';
   form.lastName = data.value.surname || '';
   form.middleName = data.value.father_name || '';
   form.phoneNumber = data.value.phone_number || '';
   form.places = { value: data.value.class?.number, label: data.value.class?.number + '-' + data.value.class?.letter } || undefined;
}
// const { data: classes } = await useAsyncData('classes', async () => await fetchClasses());
</script>

<template>
   <a-form ref="formRef" :model="form" :rules="rules" v-bind="layout" @finish="handleToSubmit" style="max-width: 800px">
      <!-- <a-form-item class="w-full" name="places" v-if="form.userRole === 'pupil'">
         <template #label>
            <span class="text-primary">Joy</span>
         </template>
         <a-select show-search @change="handleChange" :filter-option="filterOption" v-model:value="form.places" :label-in-value="true" class="w-full">
            <a-select-option v-for="item in classes" :key="item._id" :value="{ value: item._id, label: item.number + '-' + item.letter }">
               {{ item.number + '-' + item.letter }}
            </a-select-option>
         </a-select>
      </a-form-item> -->
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
         <a-button :loading="loading" type="primary" htmlType="submit">Saqlash</a-button>
      </a-form-item>
   </a-form>
</template>
