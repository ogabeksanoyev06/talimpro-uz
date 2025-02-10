<template>
   <div class="flex h-screen items-center justify-between">
      <div class="w-full h-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-10 overflow-y-auto">
         <img alt="Logo" src="/assets/svg/logo.svg" class="h-[75px] w-[200px] mx-auto mb-10" />
         <div class="max-w-lg w-full border border-gray-100 rounded-lg py-10 px-3 sm:px-6 shadow-[0_0px_1px_0px_rgba(93,96,127,0.2)]">
            <slot />
         </div>
      </div>
      <div class="h-screen bg-[#000842] p-8 hidden lg:flex lg:w-1/2">
         <img src="/assets/images/signin-image.webp" class="w-full aspect-[12/12] object-contain" alt="login" />
      </div>
   </div>
</template>

<script setup></script>
