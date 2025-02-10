<template>
   <div>
      <div @click="showModal">
         <slot />
      </div>
      <a-modal v-model:open="open" title="Sinfni o'chirish" okType="danger" ok-text="O'chirish" :confirm-loading="confirmLoading" @ok="handleOk">
         <div class="flex items-center gap-2">
            <ExclamationCircleOutlined class="text-red-500" />
            <p>Siz singni o'chirib tashlashni xohlaysizmi?</p>
         </div>
      </a-modal>
   </div>
</template>
<script setup>
import { useCustomToast } from '@/composables/useCustomToast.js';

const props = defineProps({
   classId: [String, Number]
});

const emit = defineEmits(['deleted']);

const classStore = useClassesStore();
const { deleteClass } = classStore;

const { showToast } = useCustomToast();

const loading = ref(false);
const open = ref(false);

const showModal = async () => {
   open.value = true;
};

const handleOk = async () => {
   loading.value = true;
   try {
      await deleteClass(props.classId);
      showToast("Sinf o'chirildi", 'success');
      open.value = false;
      emit('deleted');
   } catch (error) {
      showToast(error?._data?.error || 'Xatolik yuz berdi', 'error');
   } finally {
      loading.value = false;
   }
};
</script>
