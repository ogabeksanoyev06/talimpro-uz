export const useUniversitiesStore = defineStore('universities', () => {
   const fetchSearchUniversity = async (params) => {
      try {
         const response = await useApi().$get('pupils/universities', { params: params });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchUniversitiesBySubjectsIds = async (params) => {
      try {
         const response = await useApi().$patch('pupils/universities', {
            body: params
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchAllFaculty = async (data) => {
      try {
         const response = await useApi().$patch('pupils/facutets', {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   return { fetchAllFaculty, fetchSearchUniversity, fetchUniversitiesBySubjectsIds };
});
