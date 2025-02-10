<template>
   <div class="ZXhFq relative rounded border overflow-hidden">
      <div class="container mx-auto flex min-h-[calc(100vh-224px)] flex-col items-center justify-center p-4 sm:p-6">
         <div class="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-8">
            <div class="flex flex-col items-center justify-center gap-3 sm:gap-4">
               <h1 class="text-center text-2xl font-bold leading-normal sm:text-4xl md:text-5xl md:leading-120">
                  <span style="display: inline-block; vertical-align: top; text-wrap: balance">Maktab o'quvchilari, o'qituvchilari uchun innovatsion test platformasi</span>
               </h1>
               <p class="max-w-[1200px] text-center text-sm text-muted-foreground sm:text-lg">
                  Ta'limPro — maktab o'quvchilari bilimini sinash, o'qituvchilarga test yaratish imkoniyatini berish va adminlar uchun boshqaruv qulayligini ta'minlaydigan zamonaviy platforma. Testlarni tez va oson
                  yaratish, yechish va tahlil qilish imkoniyatiga ega bo'ling. Ta'lim jarayonini raqamli davrga olib chiqing!",
               </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-2 px-4 text-center">
               <span class="text-sm font-medium sm:text-lg">Testlar</span> / <span class="text-sm font-medium sm:text-lg">Hisobotlar </span> / <span class="text-sm font-medium sm:text-lg">Foydalanuvchilar </span> /
               <span class="text-sm font-medium sm:text-lg">Natijalar </span>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup></script>

<style scoped>
.ZXhFq::after {
   content: '';
   position: absolute;
   inset: 0px;
   background-image: url(/images/svg/guilloche.svg);
   background-repeat: repeat;
   background-position: right top;
   background-size: 40px, 40px;
   z-index: 0;
   opacity: 0.075;
   background-clip: padding-box;
   mask-image: linear-gradient(160deg, rgb(0, 0, 0), rgba(0, 0, 0, 0));
}
</style>
