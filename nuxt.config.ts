// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   ssr: false,
   app: {
      pageTransition: { name: 'page-change', mode: 'out-in' },
      layoutTransition: { name: 'page-change', mode: 'out-in' },
      head: {
         title: 'TalimPro',
         link: [
            {
               rel: 'icon',
               type: 'image/x-icon',
               href: '/favicon.svg'
            }
         ]
      }
   },
   modules: [
      '@ant-design-vue/nuxt',
      '@nuxtjs/tailwindcss',
      'dayjs-nuxt',
      [
         '@pinia/nuxt',
         {
            autoImports: [
               // automatically imports `defineStore`
               'defineStore', // import { defineStore } from 'pinia'
               ['defineStore', 'definePiniaStore'] // import { defineStore as definePiniaStore } from 'pinia'
            ]
         }
      ]
   ],
   antd: {
      extractStyle: true
   },
   css: ['ant-design-vue/dist/reset.css', '@/assets/css/tailwind.css'],
   build: {
      transpile: ['vue-toastification']
   },
   nitro: {
      serveStatic: true
   },
   devServerHandlers: [],
   runtimeConfig: {
      public: {
         baseURL: 'localhost'
      }
   },

   compatibilityDate: '2024-11-01',
   devtools: { enabled: true }
});
