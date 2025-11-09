// neo-lms/frontend/tailwind.config.js

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // اضافه کردن فونت فارسی به عنوان فونت پیش‌فرض
      fontFamily: {
        sans: ['Vazirmatn', ...fontFamily.sans],
      },
      // اضافه کردن پالت رنگی اختصاصی پردیس
      colors: {
        'pardis-primary': '#13b5de',
        'pardis-secondary': '#208ea8',
        'pardis-gray': '#7d888e',
      },
    },
  },
  plugins: [],
};