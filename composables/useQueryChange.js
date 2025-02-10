export function useQueryChange() {
   const router = useRouter();

   const updateQuery = async (key, value) => {
      const routeQuery = { ...router.currentRoute.value.query };
      const currentQuery = { ...router.currentRoute.value.query };

      if (!value) {
         delete routeQuery[key];
      } else {
         routeQuery[key] = value;
      }

      if (JSON.stringify(routeQuery) !== JSON.stringify(currentQuery)) {
         await router.replace({ query: routeQuery });
      }
   };

   const updateQueryParams = async (params) => {
      const routeQuery = { ...router.currentRoute.value.query };
      const currentQuery = { ...router.currentRoute.value.query };

      Object.keys(params).forEach((key) => {
         if (!params[key]) {
            delete routeQuery[key];
         } else {
            routeQuery[key] = params[key];
         }
      });

      if (JSON.stringify(routeQuery) !== JSON.stringify(currentQuery)) {
         await router.replace({ query: routeQuery });
      }
   };

   return {
      updateQuery,
      updateQueryParams
   };
}
