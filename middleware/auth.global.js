export default defineNuxtRouteMiddleware(async (to, from) => {
   const accessToken = useCookie('access');
   const userRole = useCookie('role');

   if (!accessToken.value || !userRole.value) {
      if (to.path !== '/auth/login') {
         accessToken.value = undefined;
         userRole.value = undefined;
         return navigateTo('/auth/login');
      }
   }

   if (accessToken.value && userRole.value && to.path === '/auth/login') {
      return navigateTo('/');
   }
});
