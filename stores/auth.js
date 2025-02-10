export const useAuthStore = defineStore('auth', () => {
   // State

   // Actions
   const login = async (form) => {
      try {
         const loginType = form.login.charAt(0).toLowerCase();
         const loginUrl = loginTypeMap[loginType];
         const response = await useApi().$post(loginUrl, {
            body: form
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   function setTokens(data) {
      return new Promise((resolve) => {
         useCookie('access').value = data.access;
         useCookie('role').value = data.role;
         resolve(1);
      });
   }

   function logout() {
      useCookie('access').value = undefined;
      useCookie('role').value = undefined;
      navigateTo('/auth/login');
   }

   // Getters
   return { login, setTokens, logout };
});
