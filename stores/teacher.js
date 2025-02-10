export const useTeachersStore = defineStore('teachers', () => {
   const createTeacher = async (data) => {
      try {
         const response = await useApi().$post('schools/teacher', {
            body: data
         });
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const fetchTeachers = async () => {
      try {
         const response = await useApi().$get('schools/teacher');
         return response.data;
      } catch (error) {
         console.log(error);
      }
   };

   const fetchTeacherById = async (id) => {
      try {
         const response = await useApi().$get(`schools/teacher/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const deleteTeacher = async (id) => {
      try {
         const response = await useApi().$delete(`schools/teacher/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   const updateTeacher = async (id, data) => {
      try {
         const response = await useApi().$put(`schools/teacher/${id}`, data);
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   return {
      createTeacher,
      fetchTeachers,
      fetchTeacherById,
      deleteTeacher,
      updateTeacher
   };
});
