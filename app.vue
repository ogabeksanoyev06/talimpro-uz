<template>
   <ConfigProvider :theme="themeConfig" :locale="customUzLocale">
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator />
      <NuxtLayout>
         <NuxtPage />
      </NuxtLayout>
   </ConfigProvider>
</template>

<script setup>
import { ConfigProvider } from 'ant-design-vue';
import { ref } from 'vue';

const customUzLocale = {
   Pagination: {
      items_per_page: '/ sahifa',
      jump_to: "O'tish",
      jump_to_confirm: 'Tasdiqlash',
      page: 'Sahifa',
      prev_page: 'Oldingi',
      next_page: 'Keyingi',
      prev_5: 'Oldingi 5',
      next_5: 'Keyingi 5',
      prev_3: 'Oldingi 3',
      next_3: 'Keyingi 3'
   },
   Table: {
      filterTitle: 'Filter',
      filterConfirm: 'Tasdiqlash',
      filterReset: 'Tozalash',
      emptyText: 'Ma’lumot yo‘q',
      cancelSort: 'Saralashni bekor qilish',
      triggerAsc: 'O‘sish tartibida saralash',
      triggerDesc: 'Kamayish tartibida saralash'
   },
   Empty: {
      description: 'Ma’lumot topilmadi'
   },
   DatePicker: {
      lang: {
         locale: 'uz-latn',
         placeholder: 'Sanani tanlang',
         rangePlaceholder: ['Boshlanish sanasi', 'Tugash sanasi'],
         today: 'Bugun',
         now: 'Hozir',
         backToToday: 'Bugunga qaytish',
         ok: 'OK',
         clear: 'Tozalash',
         month: 'Oy',
         year: 'Yil',
         timeSelect: 'Vaqtni tanlang',
         dateSelect: 'Sanani tanlang',
         monthSelect: 'Oyni tanlang',
         yearSelect: 'Yilni tanlang',
         decadeSelect: 'O‘n yillikni tanlang',
         yearFormat: 'YYYY',
         dateFormat: 'DD.MM.YYYY',
         dayFormat: 'D',
         dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
         monthFormat: 'MMMM',
         monthBeforeYear: true,
         previousMonth: 'Oldingi oy',
         nextMonth: 'Keyingi oy',
         previousYear: 'Oldingi yil',
         nextYear: 'Keyingi yil',
         previousDecade: 'Oldingi o‘n yillik',
         nextDecade: 'Keyingi o‘n yillik',
         previousCentury: 'Oldingi asr',
         nextCentury: 'Keyingi asr',
         monthNames: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
         shortMonthNames: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
         shortWeekDays: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
      },
      timePickerLocale: {
         placeholder: 'Vaqtni tanlang'
      },
      dateFormat: 'YYYY-MM-DD',
      dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
      weekFormat: 'YYYY-wo',
      monthFormat: 'YYYY-MM'
   },
   Modal: {
      okText: 'OK',
      cancelText: 'Bekor qilish',
      justOkText: 'Tushunarli'
   },
   Popconfirm: {
      okText: 'Ha',
      cancelText: 'Yo‘q'
   },
   Transfer: {
      searchPlaceholder: 'Bu yerdan qidiring',
      itemUnit: 'element',
      itemsUnit: 'elementlar'
   }
};

const themeConfig = ref({
   token: {
      colorPrimary: '#512bd4',
      colorSuccess: '#52C41A',
      colorText: 'rgba(0, 0, 0)',
      colorBgSpotlight: 'rgba(0, 0, 0)',
      fontFamily: '"Poppins", sans-serif'
   },
   components: {
      Button: {
         contentFontSizeLG: 14,
         borderRadius: 8
      },
      Form: {
         labelHeight: 0,
         fontSizeLG: 14,
         labelPadding: 0
      },
      Input: {
         fontSizeLG: 14
      },
      InputNumber: {
         fontSizeLG: 14
      },
      Select: {
         fontSizeLG: 14
      },
      TreeSelect: {
         fontSizeLG: 14
      },
      Card: {
         paddingLG: 16,
         padding: 12
      }
   }
});
</script>
