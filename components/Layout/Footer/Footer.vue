<script setup lang="ts">
import {
  SvgoFacebook,
  SvgoInstagram,
  SvgoTelegram,
  SvgoWhatsapp,
  SvgoYoutube,
} from '#components'
import { navbarLinks } from '~/components/Layout/navbar.data'
import { useContactStore } from '~/store/contact'

const { contact } = useContactStore()
const localePath = useLocalePath()

const socials = computed(() => [
  {
    link: contact.whatsapp,
    component: SvgoWhatsapp,
  },
  {
    link: contact.instagram,
    component: SvgoInstagram,
  },
  {
    link: contact.facebook,
    component: SvgoFacebook,
  },
  {
    link: contact.youtube,
    component: SvgoYoutube,
  },
  {
    link: contact.telegram,
    component: SvgoTelegram,
  },
])
</script>

<template>
  <footer class="pt-4 md:pt-8 pb-5 md:pb-10 bg-white">
    <div class="container">
      <div class="flex-center-between max-lg:items-start max-lg:flex-col gap-4">
        <NuxtLinkLocale to="/">
          <SvgoLogo
            class="w-[100px] md:w-[140px] h-9 md:h-[50px]"
            :font-controlled="false"
            filled
          />
        </NuxtLinkLocale>
        <div
          class="flex gap-y-2 gap-x-16 lg:text-right max-lg:w-full max-md:flex-col"
        >
          <div class="max-lg:w-full flex flex-col">
            <p class="text-sm md:text-base font-semibold leading-130 text-dark">
              {{ $t('reception_phone_number') }}
            </p>
            <a
              :href="`tel:${contact.primary_phone}`"
              class="text-xs md:text-sm font-medium text-[#5C6670] leading-130 hover:text-primary duration-300"
            >
              {{ formatPhoneNumber(contact.primary_phone) }}
            </a>
          </div>
          <div class="max-lg:w-full flex flex-col">
            <p class="text-sm md:text-base font-semibold leading-130 text-dark">
              {{ $t('location') }}
            </p>
            <a
              :href="`https://yandex.ru/maps/?pt=${contact.longitude}%2C${contact.latitude}&z=16`"
              target="_blank"
              class="text-xs md:text-sm font-medium text-[#5C6670] leading-130 hover:text-primary duration-300"
            >
              {{ contact.address }}
            </a>
          </div>
        </div>
      </div>
      <div
        class="flex-between items-center md:items-end mt-4 md:mt-6 max-md:flex-col gap-4"
      >
        <nav
          class="flex max-md:justify-center gap-y-2 gap-x-6 lg:gap-x-8 flex-wrap"
        >
          <NuxtLinkLocale
            v-for="(item, index) in navbarLinks()"
            :key="index"
            :to="item.route"
            class="text-sm font-medium leading-130 text-dark hover:text-primary duration-300"
            :class="
              localePath(item.route) === $route.fullPath ? '!text-primary' : ''
            "
          >
            {{ item.title }}
          </NuxtLinkLocale>
        </nav>
        <div class="flex gap-5">
          <a
            v-for="(item, key) in socials"
            :key
            :href="item.link"
            class="text-xl md:text-2xl text-primary hover:text-primary-dark hover:-translate-y-0.5 duration-300"
            target="_blank"
          >
            <component :is="item.component" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
