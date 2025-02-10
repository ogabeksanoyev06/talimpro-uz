<script setup>
import { useQueryChange } from '@/composables/useQueryChange';
import { useCustomToast } from '@/composables/useCustomToast.js';

const pupilsStore = usePupilsStore();
const { fetchPupilsClassById, deletePupil } = pupilsStore;

const { updateQuery } = useQueryChange();
const { showToast } = useCustomToast();

const route = useRoute();

const search = ref(route.query.search || '');
const classId = route.query.classId;

const activeRow = ref(null);
const rowSelection = ref({
   type: 'radio',
   onSelect: (record) => {
      activeRow.value = record;
   }
});
const columns = [
   {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 200,
      sorter: (a, b) => a._id - b._id,
      fixed: 'left'
   },
   {
      title: 'Viloyat',
      dataIndex: 'region',
      key: 'region',
      width: 200
   },
   {
      title: 'Tuman',
      dataIndex: 'district',
      key: 'district',
      width: 200
   },
   {
      title: 'Tashkilot',
      dataIndex: 'school',
      key: 'school',
      width: 200
   },
   // {
   //    title: 'Sinf',
   //    dataIndex: 'letter',
   //    key: 'letter',
   //    width: 200
   // },
   {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name)
   },

   {
      title: 'Familiya',
      dataIndex: 'surname',
      key: 'surname',
      width: 200
   },
   {
      title: 'Otasining ismi',
      dataIndex: 'father_name',
      key: 'father_name',
      width: 200
   },
   {
      title: 'Login',
      dataIndex: 'login',
      key: 'login',
      width: 200,
      sorter: (a, b) => a._id - b._id
   },
   {
      title: 'Tarif muddati',
      dataIndex: 'tariff',
      key: 'tariff',
      width: 200,
      sorter: (a, b) => a._id - b._id
   },
   // {
   //    title: 'Parol',
   //    dataIndex: 'password',
   //    key: 'password',
   //    width: 200
   // },
   {
      title: 'Telefon raqam',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 200
   },
   {
      title: 'Yaratilgan vaqti',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      sorter: (a, b) => a._id - b._id
   },

   {
      title: 'Amallar',
      key: 'action',
      width: 200,
      fixed: 'right'
   }
];

const onSearch = (searchValue) => {
   updateQuery('search', searchValue);
};

const onInputChange = (event) => {
   const searchValue = event.target.value;
   updateQuery('search', searchValue);
};

const confirm = async (id) => {
   try {
      await deletePupil(id);
      refresh();
   } catch (error) {
      showToast(error?._data?.message, 'error');
   }
};

const showModal = async () => {
   await refresh();
   activeRow.value = null;
   rowSelection.value.selectedRowKeys = [];
};

const { data: users, refresh } = await useAsyncData('users-pupils', async () => {
   return await fetchPupilsClassById(classId);
});

const filteredUsers = computed(() => {
   if (!search.value || !users.value) return users.value;
   return users.value.filter((item) => {
      const searchText = search.value.toLowerCase();
      return (
         item.name.toLowerCase().includes(searchText) ||
         item.surname.toLowerCase().includes(searchText) ||
         item.father_name.toLowerCase().includes(searchText) ||
         item.login.toLowerCase().includes(searchText) ||
         item.phone_number.includes(searchText) ||
         item.school.number.toString().includes(searchText) ||
         item.school.type.toLowerCase().includes(searchText)
      );
   });
});
</script>

<template>
   <div>
      <div class="flex flex-wrap gap-2 border p-3 rounded-lg mb-2">
         <div class="flex grow">
            <div class="flex flex-wrap gap-3">
               <NuxtLink to="/users/create">
                  <a-button class="text-primary border-primary"> <PlusOutlined /> Qo'shish </a-button>
               </NuxtLink>
               <NuxtLink>
                  <a-button disabled class="text-green border-green"> <FileExcelFilled /> Yuklash </a-button>
               </NuxtLink>
               <ModalUsersUpdatePassword :role="'pupil'" :user-id="activeRow?._id" @show-modal="showModal">
                  <a-button> Parolni o'zgartirish </a-button>
               </ModalUsersUpdatePassword>
            </div>
         </div>
         <a-input-search @input="onInputChange" @search="onSearch" v-model:value="search" placeholder="Qidirish" style="width: 200px" />
      </div>
      <a-table :dataSource="filteredUsers" :columns="columns" :row-selection="rowSelection" row-key="_id" bordered :scroll="{ x: 1000 }">
         <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'more'">
               <NuxtLink :to="{ path: '/users/pupils', query: { classId: record._id } }" class="text-primary"> Ko'rish </NuxtLink>
            </template>
            <template v-if="column.key === 'region'">
               {{ record.school.region }}
            </template>
            <template v-if="column.key === 'district'">
               {{ record.school.district }}
            </template>

            <template v-if="column.key === 'createdAt'">
               {{ $dayjs(record.school.createdAt).format('DD.MM.YYYY HH:mm') }}
            </template>

            <template v-if="column.key === 'phone_number'">
               <a :href="'tel:' + record.phone_number">{{ '+998' + record.phone_number }}</a>
            </template>
            <template v-if="column.key === 'school'">
               {{ record.school.number + '-' + record.school.type }}
            </template>

            <template v-if="column.key === 'tariff'">
               {{ $dayjs(record.school.tarif).format('DD.MM.YYYY HH:mm') }}
            </template>

            <template v-if="column.key === 'action'">
               <div class="flex items-center gap-2">
                  <NuxtLink :to="`/users/update/${record._id}?role=pupil`">
                     <EditFilled class="text-primary cursor-pointer" />
                  </NuxtLink>
                  <a-popconfirm title="O'chirish" description="Rostdan ham o'chirmoqchimisiz?" @confirm="confirm(record._id)" @cancel="cancel">
                     <DeleteFilled class="text-red-500 cursor-pointer" />
                  </a-popconfirm>
               </div>
            </template>
         </template>
      </a-table>
   </div>
</template>
