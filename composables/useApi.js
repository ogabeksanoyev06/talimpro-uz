export const useApi = (apiUrl) => {
   const baseURL = apiUrl || 'https://api.talimpro.uz/api/';
   const locale = useCookie('locale');
   const loading = ref(false);
   const authStore = useAuthStore();

   function $service(options = {}) {
      const accessToken = useCookie('access');
      const headers = {
         ...options?.headers,
         'Accept-Language': locale.value || 'uz'
      };
      if (accessToken.value) {
         Object.assign(headers, {
            Authorization: `Bearer ${accessToken.value}`
         });
      }
      const fetchInstance = $fetch.create({
         ...options,
         baseURL,
         headers,
         onResponseError({ response }) {
            if (response.status === 401) {
               authStore.logout();
            }
         }
      });
      return fetchInstance;
   }

   function $get(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
         loading.value = true;
         $service(options)(endpoint)
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response);
            })
            .finally(() => {
               loading.value = false;
            });
      });
   }

   function $post(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
         loading.value = true;
         $service({ ...options, method: 'POST' })(endpoint)
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response);
            })
            .finally(() => {
               loading.value = false;
            });
      });
   }

   function $put(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
         loading.value = true;
         $service({ ...options, method: 'PUT' })(endpoint)
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response);
            })
            .finally(() => {
               loading.value = false;
            });
      });
   }

   function $patch(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
         loading.value = true;
         $service({ ...options, method: 'PATCH' })(endpoint)
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response);
            })
            .finally(() => {
               loading.value = false;
            });
      });
   }

   function $delete(endpoint, options = {}) {
      return new Promise((resolve, reject) => {
         loading.value = true;
         $service({ ...options, method: 'DELETE' })(endpoint)
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response);
            })
            .finally(() => {
               loading.value = false;
            });
      });
   }

   return {
      loading,
      baseURL,
      $get,
      $post,
      $put,
      $patch,
      $delete
   };
};
