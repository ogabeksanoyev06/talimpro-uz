<template>
   <div v-lazy="src" :error-state="errorState" class="image-loading overflow-hidden">
      <img :alt="alt" class="object-cover w-full h-full" :class="imageClass" />
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
   src: {
      type: String
   },
   alt: {
      type: String,
      default: 'image'
   },
   errorState: {
      type: String,
      default: ''
   },
   imageClass: {
      type: [String, Array, Object],
      default: ''
   }
});
</script>
