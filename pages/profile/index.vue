<template>
   <div>
      <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition" class="w-full" @change="onEdit">
         <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.label">
            <a-card>
               <component :is="tab.component" />
            </a-card>
         </a-tab-pane>
      </a-tabs>
   </div>
</template>

<script setup>
import ProfileEdit from '@/components/Profile/Edit';
import ProfileChangePassword from '@/components/Profile/ChangePassword';
import ProfileInformation from '@/components/Profile/Information';

import { useQueryChange } from '@/composables/useQueryChange';

const route = useRoute();

const { updateQuery } = useQueryChange();
const tabPosition = ref('left');

const tabs = ref([
   { label: "Asosiy ma'lumotlar", key: 'profile', component: ProfileEdit },
   { label: "Parolni o'zgartirish", key: 'change-password', component: ProfileChangePassword },
   // { label: "Abiturient ma'lumotlari", component: ProfileAbi },
   { label: 'Batafsil', key: 'info', component: ProfileInformation }
]);
const activeKey = ref(route.query.tab || tabs.value[0].key);

const onEdit = (targetKey) => {
   console.log(targetKey);
   updateQuery('tab', targetKey !== 'profile' ? targetKey : undefined);
};

const updateTabPosition = () => {
   tabPosition.value = window.innerWidth < 768 ? 'top' : 'left';
};

onMounted(() => {
   updateTabPosition();
   window.addEventListener('resize', updateTabPosition);
});

onUnmounted(() => {
   window.removeEventListener('resize', updateTabPosition);
});
</script>
