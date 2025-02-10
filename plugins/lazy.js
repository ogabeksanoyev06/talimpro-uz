import { VLazyLoad } from '@/directives/lazy-load'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', VLazyLoad)
})
