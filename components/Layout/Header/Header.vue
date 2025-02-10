<script setup lang="ts">
import { navbarLinks } from '../navbar.data'
import { useTourStore } from '~/store/tours'

interface Props {
  dark?: boolean
}
defineProps<Props>()
const localePath = useLocalePath()

const showFullMenu = ref(false)

watch(
  () => showFullMenu.value,
  (value: boolean) => {
    if (value) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }
)
</script>

<template>
  <header
    class="py-4 md:py-5 shadow-[0px_4px_32px_0px_#0000000D] sticky top-0 z-10 duration-300 border-b"
    :class="dark ? 'bg-transparent border-white/10' : 'bg-white border-white'"
  >
    <div class="container flex-center-between relative">
      <div class="flex-y-center gap-2">
        <button @click="showFullMenu = !showFullMenu">
          <Transition name="fade-fast" mode="out-in">
            <SvgoBurger v-if="!showFullMenu" class="text-xl lg:hidden" />
            <SvgoXMark v-else class="text-xl lg:hidden" />
          </Transition>
        </button>
        <NuxtLinkLocale to="/" @click="showFullMenu = false">
          <SvgoLogo
            class="w-[100px] md:w-[140px] h-9 md:h-[50px] duration-300"
            :class="dark ? 'text-white' : 'text-dark'"
            :font-controlled="false"
          />
        </NuxtLinkLocale>
      </div>
      <div class="flex-y-center gap-5">
        <LayoutHeaderLanguageSwitcher class="max-md:hidden" :dark />
        <LayoutHeaderAuthorization :dark @click="showFullMenu = false" />
      </div>
      <nav class="absolute-center flex-y-center gap-6 xl:gap-8 max-lg:hidden">
        <NuxtLinkLocale
          v-for="(item, index) in navbarLinks()"
          :key="index"
          :to="item.route"
          class="text-sm font-medium leading-130 text-dark hover:text-primary duration-300"
          :class="[
            dark ? 'text-white' : 'text-dark',
            localePath(item.route) === $route.fullPath ? '!text-primary' : '',
          ]"
        >
          {{ item.title }}
        </NuxtLinkLocale>
      </nav>
    </div>
    <Teleport to="body">
      <div
        class="fixed bottom-0 w-full h-[calc(100vh_-_69px)] bg-white z-50 transition-all duration-300 px-4 py-6 flex flex-col gap-2 items-center"
        :class="showFullMenu ? 'opacity-100 right-0 ' : 'opacity-0 right-full'"
      >
        <NuxtLinkLocale
          v-for="(item, index) in navbarLinks()"
          :key="index"
          :to="item.route"
          class="text-lg w-full font-semibold leading-130 text-dark hover:text-primary duration-300 border-b border-gray-100 pb-2"
          :class="[
            dark ? 'text-white' : 'text-dark',
            localePath(item.route) === $route.fullPath ? '!text-primary' : '',
          ]"
          @click="showFullMenu = false"
        >
          {{ item.title }}
        </NuxtLinkLocale>
        <LayoutHeaderLanguageSwitcher class="mt-4" />
      </div>
    </Teleport>
  </header>
</template>
