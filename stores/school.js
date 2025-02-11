export const useSchoolStore = defineStore('school', () => {
   const fetchAllTestTypes = async () => {
      try {
         const response = await useApi().$get('schools/tests/types');
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchSubjects = async (id) => {
      try {
         const response = await useApi().$get(`schools/subjects?filter[test_type]=${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchFilterPupilResults = async (params) => {
      try {
         const response = await useApi().$patch(`schools/pupils`, {
            params: params
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };
   const fetchFilterTeacherResults = async (data) => {
      try {
         const response = await useApi().$patch(`schools/teachers`, {
            params: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   return {
      fetchAllTestTypes,
      fetchSubjects,
      fetchFilterPupilResults,
      fetchFilterTeacherResults
   };
});
