<script setup>
const testStore = useTestStore();
const { fetchTestTypes } = testStore;

const userRole = useCookie('role');

const { data: types, pending } = await useAsyncData('testTypes', async () => {
   return await fetchTestTypes(userRole.value);
});
</script>

<template>
   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
      <CardTestTypes v-for="(item, key) in types" :key :item="item" />
   </div>
</template>
