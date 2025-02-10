export function cleanPhoneNumber(phoneNumber) {
   if (!phoneNumber) {
      return '';
   }
   return phoneNumber.replace(/^\+998/, '').replace(/[^\d]/g, '');
}

export const attesType = [
   { value: 'next', name: 'Navbatdagi' },
   { value: 'extraordinary', name: 'Navbatdan tashqari' }
];

export const attesLevel = [
   { value: 'specialist', name: 'Mutaxassis toifa' },
   { value: 'second', name: 'Ikkinchi toifa' },
   { value: 'first', name: 'Birinchi toifa' },
   { value: 'highest', name: 'Oliy toifa' }
];

export const languageTest = [{ value: 'O`zbek', label: "O'zbek" }];

export const loginTypeMap = {
   s: 'schools/login',
   t: 'teachers/login',
   p: 'pupils/login'
};

export const userRoleApiPath = {
   school: 'schools',
   teacher: 'teachers',
   pupil: 'pupils',
   default: 'users'
};

export const userRoles = {
   s: 'school',
   t: 'teacher',
   p: 'pupil',
   r: 'region',
   d: 'district'
};

export const points = {
   teacher_intern: 2.5,
   attestation: 2.0,
   school: 1.0,
   national_certificate: 2.0
};
export const timerFormat = (time) => {
   let sec_num = parseInt(time, 10);
   let hours = Math.floor(sec_num / 3600);
   let minutes = Math.floor((sec_num - hours * 3600) / 60);
   let seconds = sec_num - hours * 3600 - minutes * 60;
   const format = (num) => (num < 10 ? `0${num}` : num);
   return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
};

export const calculateTotalScore = (questions, type) => {
   let totalScore = 0;
   let counter = 0;
   const points = {
      teacher_intern: { point: 2, maxBall: 100 },
      attestation: { point: 2, maxBall: 100 },
      school: { point: 1, maxBall: 20 },
      national_certificate: { point: 2, maxBall: 90 }
   };

   const getDTMPoints = () => {
      if (counter < 30) return 1.1;
      if (counter < 60) return 2.1;
      if (counter < 90) return 3.1;
      return 0;
   };

   if (type === 'dtm') {
      questions.forEach((question) => {
         const hasCorrectAnswer = question.options.some((option) => option.is_correct && option.is_selected);
         if (hasCorrectAnswer) {
            totalScore += getDTMPoints();
         }
         counter++;
      });
   } else {
      const point = points[type]?.point || 0;
      questions.forEach((question) => {
         question.options.forEach((option) => {
            if (option.is_correct && option.is_selected) {
               totalScore += point;
            }
         });
      });
   }

   return {
      totalScore: totalScore.toFixed(1),
      maxBall: (type === 'dtm' ? 189 : points[type]?.maxBall || 0).toFixed(1)
   };
};

export const AG_GRID_LOCALE_UZ = {
   // Umumiy matnlar
   noRowsToShow: "Ma'lumot topilmadi",
   loadingOoo: 'Yuklanmoqda...',
   page: 'Sahifa',
   of: 'dan',
   more: 'Ko‘proq',
   to: 'gacha',
   next: 'Keyingi',
   previous: 'Oldingi',
   loading: 'Yuklanmoqda...',
   selectAll: 'Hammasini tanlash',
   searchOoo: 'Qidirish...',

   // Filterlar
   filterOoo: 'Filter...',
   applyFilter: 'Qo‘llash',
   equals: 'Teng',
   notEqual: 'Teng emas',
   lessThan: 'Kichik',
   greaterThan: 'Katta',
   inRange: 'Oraliqda',
   contains: 'O‘z ichiga oladi',
   notContains: 'O‘z ichiga olmaydi',
   startsWith: 'Bilan boshlanadi',
   endsWith: 'Bilan tugaydi',

   // Yangi filterlar
   andCondition: 'Va',
   orCondition: 'Yoki',
   notBlank: 'Bo‘sh emas',
   blank: 'Bo‘sh',

   // Jadval ustunlari
   columnMenuMain: 'Ustun sozlamalari',
   pinColumn: 'Ustunni qotirish',
   autoSizeThiscolumn: 'Avtomatik o‘lcham',
   resetColumns: 'Ustunlarni tiklash',

   // Excel eksport
   export: 'Eksport',
   csvExport: 'CSV formatida yuklash',
   excelExport: 'Excel formatida yuklash',

   // Oynalar
   cancel: 'Bekor qilish',
   confirm: 'Tasdiqlash',
   save: 'Saqlash',
   close: 'Yopish'
};

export const classes = [
   { value: 1, label: 1 },
   { value: 2, label: 2 },
   { value: 3, label: 3 },
   { value: 4, label: 4 },
   { value: 5, label: 5 },
   { value: 6, label: 6 },
   { value: 7, label: 7 },
   { value: 8, label: 8 },
   { value: 9, label: 9 },
   { value: 10, label: 10 },
   { value: 11, label: 11 }
];
