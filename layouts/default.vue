<template>
   <a-layout style="min-height: 100vh">
      <a-layout-sider :style="{ backgroundColor: '#000', color: '#fff' }" v-model:collapsed="collapsed" breakpoint="lg" collapsible width="250" class="overflow-y-auto h-[calc(-48px+100vh)] left-0 top-0 bottom-0 !sticky">
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

      <a-layout>
         <a-layout-header class="!sticky top-0 !bg-white !px-4 sm:!px-6 z-[999]">
            <div class="flex items-center h-full">
               <UIPageHeader />
               <LayoutHeaderAuthorization />
            </div>
         </a-layout-header>

         <a-layout-content class="flex-1 !mt-4 mx-0 md:!mx-3 bg-white p-4"> <slot></slot> </a-layout-content>

         <a-layout-footer style="text-align: center"> {{ selectedKeys }} © 2020-2025 Assessment Program </a-layout-footer>
      </a-layout>
   </a-layout>
</template>

<script setup>
import { HomeOutlined, FileOutlined, DesktopOutlined, UserOutlined, BarChartOutlined, PieChartOutlined, ApartmentOutlined } from '@ant-design/icons-vue';

const route = useRoute();

const profileStore = useProfileStore();
const { fetchUser } = profileStore;

const userRole = useCookie('role');

const collapsed = ref(false);
const selectedKeys = ref([route.path]);
const openKeys = ref([]);

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
   // {
   //    label: 'Hisobotlar',
   //    icon: UserOutlined,
   //    roles: ['school'],
   //    children: [
   //       {
   //          route: '/reports/attest',
   //          label: 'Attestatsiya'
   //       },
   //       {
   //          route: '/reports/abi',
   //          label: 'Abituriyent'
   //       }
   //    ]
   // }
];

const filteredMenu = computed(() => {
   return menu.filter((item) => item.roles.includes(userRole.value));
});

watch(
   () => route.path,
   async (newPath) => {
      const activeMenu = filteredMenu.value.find((item) => item.route === newPath);
      selectedKeys.value = activeMenu ? [newPath] : [];
      openKeys.value = activeMenu ? [newPath] : [];
   },
   { immediate: true }
);

const token = useCookie('access');
if (token.value) fetchUser(userRole.value);
</script>

<style scoped></style>
