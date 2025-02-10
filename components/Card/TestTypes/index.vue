<template>
   <div class="group flex flex-col overflow-hidden rounded-md border bg-white hover:shadow-xl transition-300">
      <div class="relative aspect-video">
         <UIImage :alt="item.title_uz" class="h-full w-full object-cover object-top" src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/images/600x400/1.jpg" />
         <div class="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">Yangi testlar</div>
      </div>
      <div class="flex flex-1 flex-col gap-4 p-4">
         <h3 class="line-clamp-2 text-lg font-semibold">{{ item.title_uz }}</h3>
         <div class="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-book-open h-4 w-4"
               >
                  <path d="M12 7v14"></path>
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
               </svg>
               <span>{{ item.questions_count }} ta savollar</span>
            </div>
            <div class="flex items-center gap-1">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-clock h-4 w-4"
               >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
               </svg>
               <span>{{ item.duration }} daqiqa</span>
            </div>
         </div>
         <a-button type="primary" @click="navigateToTest(item._id, item.test_type)">Test ishlash</a-button>
      </div>
   </div>
</template>

<script setup>
defineProps({
   item: Object
});

const router = useRouter();

const navigateToTest = (test_id, test_type) => {
   let path = '';
   switch (test_type) {
      case 'attestation':
         path = `/opened-tests-for-user/attestation`;
         break;
      case 'national_certificate':
         path = `/opened-tests-for-user/national-cert`;
         break;
      case 'school':
         path = `/opened-tests-for-user/school`;
         break;
      case 'dtm':
         path = `/opened-tests-for-user/abi`;
         break;
   }
   router.push({
      path,
      query: {
         Id: test_id,
         Type: test_type
      }
   });
};
</script>
