<template>
   <div class="flex items-center grow gap-x-3">
      <a-button type="text" @click="goBack" class="flex items-center justify-center" v-if="status">
         <ArrowLeftOutlined />
      </a-button>
      <h2 class="text-base font-semibold">{{ title }}</h2>
   </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
   title: String,
   status: Boolean
});

const router = useRouter();

const goBack = () => {
   router.back();
};
</script>
