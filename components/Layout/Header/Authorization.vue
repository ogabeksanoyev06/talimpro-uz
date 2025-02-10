<script setup>
const profileStore = useProfileStore();
const authStore = useAuthStore();

const { user, userFullName } = storeToRefs(profileStore);
const { logout } = authStore;

const userRole = useCookie('role');
</script>

<template>
   <a-dropdown :trigger="['click']" class="flex items-center cursor-pointer gap-x-2">
      <div>
         <a-avatar size="large" />
         <div class="flex flex-col">
            <a-typography-text>
               <strong>{{ userFullName }}</strong>
            </a-typography-text>
            <a-typography-text type="secondary" class="text-xs">{{ user.login }}</a-typography-text>
         </div>
      </div>
      <template #overlay>
         <a-menu class="max-w-80 w-full">
            <div class="px-2 pt-3 text-sm font-semibold">
               <div class="relative mb-2 flex flex-col items-center justify-center gap-y-3 rounded-md bg-muted">
                  <div class="flex flex-col items-center text-center justify-center">
                     <a-typography-text v-if="userRole === 'pupil'" class="text-xs font-normal" type="secondary"> {{ user.district }} {{ user.sNumber }}-{{ user.sType }} o'quvchisi </a-typography-text>
                     <a-typography-text v-else-if="userRole === 'teacher'" class="text-xs font-normal" type="secondary"> {{ user.district }} {{ user.sNumber }}-{{ user.sType }} o'qituvchisi </a-typography-text>
                     <a-typography-text v-else-if="userRole === 'school'" class="text-xs font-normal" type="secondary"> {{ user.district }} {{ user.sNumber }}-{{ user.sType }} admini </a-typography-text>
                  </div>
               </div>
            </div>
            <a-divider class="!my-1" />
            <a-menu-item key="0">
               <NuxtLink to="/profile">
                  <UserOutlined />
                  Mening ma'lumotlarim
               </NuxtLink>
            </a-menu-item>
            <a-menu-item key="1" @click="logout">
               <LoginOutlined />
               Tizimdan Chiqish
            </a-menu-item>
         </a-menu>
      </template>
   </a-dropdown>
</template>
