<template>
   <a-layout style="min-height: 100vh">
      <a-layout-sider
         v-if="!isMobile"
         :style="{ backgroundColor: '#000', color: '#fff' }"
         v-model:collapsed="collapsed"
         breakpoint="lg"
         collapsible
         width="250"
         class="overflow-y-auto h-[calc(-48px+100vh)] left-0 top-0 bottom-0 !sticky"
      >
         <NuxtLink to="/">
            <div class="p-[10px] h-[64px] flex items-center justify-start border-e border-b border-gray-800">
               <img alt="logo" src="/public/images/svg/logo.svg" class="w-[120px]" v-if="!collapsed" />
               <img alt="logo" src="/public/images/svg/logo-x.svg" v-else />
            </div>
         </NuxtLink>

         <a-menu :style="{ backgroundColor: '#000' }" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" class="mt-2" mode="inline">
            <template v-for="(item, i) in filteredMenu" :key="item.route">
               <a-sub-menu v-if="item.children" :key="i">
                  <template #title>
                     <component :is="item.icon" />
                     <span>{{ item.label }}</span>
                  </template>
                  <a-menu-item v-for="sub in item.children" :key="sub.route">
                     <span>
                        <NuxtLink :to="sub.route">{{ sub.label }}</NuxtLink>
                     </span>
                  </a-menu-item>
               </a-sub-menu>
               <a-menu-item v-else :key="item.route">
                  <component :is="item.icon" />
                  <span>
                     <NuxtLink :to="item.route">{{ item.label }}</NuxtLink>
                  </span>
               </a-menu-item>
            </template>
         </a-menu>
      </a-layout-sider>
      <a-drawer
         v-model:open="open"
         v-if="isMobile"
         :closeIcon="null"
         :headerStyle="{ backgroundColor: '#000', color: '#fff', padding: '0px' }"
         :bodyStyle="{ backgroundColor: '#000', color: '#fff', padding: '0px' }"
         width="250"
         placement="left"
         @after-open-change="afterOpenChange"
      >
         <template #title>
            <NuxtLink to="/">
               <div class="p-[10px] h-[64px] flex flex-col justify-center">
                  <img alt="logo" src="/public/images/svg/logo.svg" class="w-[120px]" />
               </div>
            </NuxtLink>
         </template>
         <template #extra>
            <a-button type="text" @click="open = false" style="color: #fff" class="me-2 p-0">
               <CloseOutlined style="font-size: 20px" />
            </a-button>
         </template>

         <a-menu :style="{ backgroundColor: '#000' }" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" class="mt-2" mode="inline">
            <template v-for="(item, i) in filteredMenu" :key="item.route">
               <a-sub-menu v-if="item.children" :key="i">
                  <template #title>
                     <component :is="item.icon" />
                     <span>{{ item.label }}</span>
                  </template>
                  <a-menu-item v-for="sub in item.children" :key="sub.route">
                     <span>
                        <NuxtLink :to="sub.route">{{ sub.label }}</NuxtLink>
                     </span>
                  </a-menu-item>
               </a-sub-menu>
               <a-menu-item v-else :key="item.route">
                  <component :is="item.icon" />
                  <span>
                     <NuxtLink :to="item.route">{{ item.label }}</NuxtLink>
                  </span>
               </a-menu-item>
            </template>
         </a-menu>
      </a-drawer>

      <a-layout>
         <a-layout-header class="!sticky top-0 !bg-white !px-4 sm:!px-6 z-[999]">
            <div class="flex items-center h-full">
               <div class="flex items-center grow gap-x-3">
                  <MenuOutlined v-if="isMobile" class="trigger" @click="showDrawer" style="font-size: 20px" />
               </div>
               <LayoutHeaderAuthorization />
            </div>
         </a-layout-header>

         <a-layout-content class="flex-1 !mt-4 mx-0 md:!mx-3 bg-white p-4"> <slot></slot> </a-layout-content>
         <a-layout-footer style="text-align: center"> © 2024-2025 Assessment Program </a-layout-footer>
      </a-layout>
   </a-layout>
</template>

<script setup>
import { MenuOutlined } from '#components';
import { HomeOutlined, FileOutlined, DesktopOutlined, UserOutlined, BarChartOutlined, PieChartOutlined, ApartmentOutlined } from '@ant-design/icons-vue';

const route = useRoute();

const profileStore = useProfileStore();
const { fetchUser } = profileStore;

const userRole = useCookie('role');

const collapsed = ref(false);
const open = ref(true);
const selectedKeys = ref([route.path]);
const openKeys = ref([]);
const isMobile = ref(false);

const menu = [
   {
      route: '/',
      label: 'Asosiy',
      icon: HomeOutlined,
      roles: ['pupil', 'teacher', 'school']
   },
   // {
   //    route: '/teacher-info',
   //    label: "O'qituvchi ma'lumotlari",
   //    icon: FileOutlined,
   //    roles: ['school']
   // },
   {
      route: '/opened-tests-for-user',
      label: 'Test ishlash',
      icon: DesktopOutlined,
      roles: ['pupil', 'teacher']
   },
   {
      label: 'Foydalanuvchilar',
      icon: UserOutlined,
      roles: ['school'],
      children: [
         {
            route: '/users/classes',
            label: "O'quvchi"
         },
         {
            route: '/users/teachers',
            label: "O'qituvchi"
         }
      ]
   },
   {
      route: '/test-attempt-results',
      label: 'Natijalar',
      icon: BarChartOutlined,
      roles: ['pupil', 'teacher']
   },
   {
      route: '/spaces',
      label: "Bo'shliqlar",
      icon: PieChartOutlined,
      roles: ['pupil', 'teacher']
   },
   {
      route: '/organization-classes',
      label: 'Sinflar',
      icon: ApartmentOutlined,
      roles: ['school']
   },
   {
      label: 'Hisobotlar',
      icon: UserOutlined,
      roles: ['school'],
      children: [
         {
            route: '/reports/attest',
            label: 'Attestatsiya'
         },
         {
            route: '/reports/pupil',
            label: "O'quvchi"
         }
         // {
         //    route: '/reports/abi',
         //    label: 'Abituriyent'
         // }
      ]
   }
];

const showDrawer = () => {
   open.value = true;
};

const filteredMenu = computed(() => {
   return menu.filter((item) => item.roles.includes(userRole.value));
});

const checkScreenSize = () => {
   isMobile.value = window.innerWidth < 768; // md dan kichik bo'lsa true
};

watch(
   () => route.path,
   async (newPath) => {
      const activeMenu = filteredMenu.value.find((item) => item.route === newPath);
      selectedKeys.value = activeMenu ? [newPath] : [];
      openKeys.value = activeMenu ? [newPath] : [];
      open.value = false;
   },
   { immediate: true }
);

onMounted(() => {
   checkScreenSize();
   window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
   window.removeEventListener('resize', checkScreenSize);
});

const token = useCookie('access');
if (token.value) fetchUser(userRole.value);
</script>

<style scoped></style>
