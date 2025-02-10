export const useClassesStore = defineStore('classes', () => {
   const createClass = async (data) => {
      try {
         const response = await useApi().$post('schools/class', {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchClasses = async () => {
      try {
         const response = await useApi().$get('schools/class');
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchClassById = async (id) => {
      try {
         const response = await useApi().$get(`schools/class/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const deleteClass = async (id) => {
      try {
         const response = await useApi().$delete(`schools/class/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const updateClass = async (id, data) => {
      try {
         const response = await useApi().$put(`schools/class/${id}`, {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   return {
      createClass,
      fetchClasses,
      fetchClassById,
      deleteClass,
      updateClass
   };
});
