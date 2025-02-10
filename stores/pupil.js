export const usePupilsStore = defineStore('pupils', () => {
   const createPupil = async (data) => {
      try {
         const response = await useApi().$post('schools/pupil', {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchPupils = async () => {
      try {
         const response = await useApi().$get('schools/pupil');
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchPupilsClassById = async (id) => {
      try {
         const response = await useApi().$get(`schools/pupils/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchPupilById = async (id) => {
      try {
         const response = await useApi().$get(`schools/pupil/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const deletePupil = async (id) => {
      try {
         const response = await useApi().$delete(`schools/pupil/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const updatePupil = async (id, data) => {
      try {
         const response = await useApi().$put(`schools/pupil/${id}`, {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   return {
      createPupil,
      fetchPupils,
      fetchPupilById,
      fetchPupilsClassById,
      deletePupil,
      updatePupil
   };
});
