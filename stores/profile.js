import dayjs from 'dayjs';
export const useProfileStore = defineStore('profile', () => {
   // State
   const user = ref({});
   const userRole = useCookie('role');

   const authStore = useAuthStore();
   const { setTokens } = authStore;

   // Actions
   const fetchUser = async (role) => {
      try {
         const apiPath = userRoleApiPath[role];
         const url = `${apiPath}/me`;
         const response = await useApi().$get(url);
         fillUserData(response.data);
         return response.data;
      } catch (error) {
         // setTokens({ access: undefined, role: undefined });
         // navigateTo('/auth/login');
      }
   };
   const fetchUserByRole = async (role, id) => {
      try {
         const url = `schools/${role}/${id}`;
         const response = await useApi().$get(url);
         fillUserData(response.data, role, id);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const updateUser = async (role, form) => {
      try {
         const apiPath = userRoleApiPath[role];
         const response = await useApi().$post(`${apiPath}/profile`, {
            body: form
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };
   const updateUserByRole = async (role, id, form) => {
      try {
         const response = await useApi().$post(`/schools/${role}/${id}`, {
            body: form
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const updatePassword = async (role, form) => {
      try {
         const apiPath = userRoleApiPath[role];
         const url = `${apiPath}/reset-password`;
         const response = await useApi().$post(url, {
            body: form
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };
   const updatePasswordByRole = async (role, id, form) => {
      try {
         const response = await useApi().$post(`/schools/${role}/update-password/${id}`, {
            body: form
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fillUserData = (data, id, byrole) => {
      const isSchool = userRole.value === 'school';
      if (id) {
         otherUser.value = {
            login: data?.login || '',
            name: data?.name || '',
            surname: data?.surname || '',
            father_name: data?.father_name || '',
            phone_number: cleanPhoneNumber(data?.phone_number) || ''
         };
         const schoolData = data.school || {};
         otherUser.value.region = schoolData.region || '';
         otherUser.value.district = schoolData.district || '';
         otherUser.value.school = `${schoolData.number || ''} - ${schoolData.type || ''}`.trim() || '';
         otherUser.value.tariff = schoolData.tarif ? dayjs(schoolData.tarif).format('DD.MM.YYYY HH:mm:ss') : '';

         if (byrole === 'pupil') {
            otherUser.value.class = `${data.class?.number || ''}${data.class?.letter || ''}`.trim() || '';
         }
      } else {
         user.value = {
            login: data.login || '',
            name: isSchool ? data.admin?.name || '' : data.name || '',
            surname: isSchool ? data.admin?.surname || '' : data.surname || '',
            father_name: isSchool ? data.admin?.father_name || '' : data.father_name || '',
            phone_number: cleanPhoneNumber(isSchool ? data.admin?.phone_number : data.phone_number) || ''
         };
         if (isSchool) {
            user.value.region = data.region || '';
            user.value.district = data.district || '';
            user.value.sNumber = data.number || '';
            user.value.sType = data.type || '';
            user.value.school = `${data.number || ''} - ${data.type || ''}`.trim() || '';
            user.value.tariff = data.tarif ? dayjs(data.tarif).format('DD.MM.YYYY HH:mm:ss') : '';
         } else {
            const schoolData = data.school || {};
            user.value.region = schoolData.region || '';
            user.value.district = schoolData.district || '';
            user.value.sNumber = schoolData.number || '';
            user.value.sType = schoolData.type || '';
            user.value.school = `${schoolData.number || ''} - ${schoolData.type || ''}`.trim() || '';
            user.value.tariff = schoolData.tarif ? dayjs(schoolData.tarif).format('DD.MM.YYYY HH:mm:ss') : '';
            if (userRole.value === 'pupil') {
               user.value.class = `${data.class?.number || ''}${data.class?.letter || ''}`.trim() || '';
               user.value.classNumber = `${data.class?.number || ''}`.trim() || '';
            }
         }
      }
   };

   // Getters

   const userFullName = computed(() => {
      const { surname, name } = user.value || {};
      return surname && name ? `${surname} ${name}` : '';
   });
   return { fetchUser, updateUser, updatePassword, fetchUserByRole, updatePasswordByRole, updateUserByRole, user, userFullName };
});
