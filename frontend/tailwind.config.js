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
      // ۱. فونت وزیرمتن (که از layout.tsx فراخوانی شده)
      fontFamily: {
        sans: ['Vazirmatn', ...fontFamily.sans],
      },
      // ۲. پالت رنگی کامل و استاندارد مبتنی بر هویت پردیس
      colors: {
        // خانواده رنگ اصلی (برگرفته از #13b5de)
        'pardis-primary': {
          50: '#f0faff',
          100: '#e0f6fe',
          200: '#b9edfd',
          300: '#7cdffd',
          400: '#38d9fa',
          500: '#13b5de', // رنگ اصلی لوگو
          600: '#0694bd',
          700: '#037699',
          800: '#04617d',
          900: '#07516a',
          950: '#063344',
        },
        // خانواده رنگ ثانویه (برگرفته از #208ea8)
        'pardis-secondary': {
          50: '#f0f9fb',
          100: '#dff3f7',
          200: '#b6e7f0',
          300: '#7cd2e4',
          400: '#3eb4ce',
          500: '#208ea8', // رنگ دوم لوگو
          600: '#19738a',
          700: '#155d71',
          800: '#154e5d',
          900: '#154250',
          950: '#0c2a35',
        },
        // خانواده رنگ خاکستری (برگرفته از #7d888e)
        'pardis-gray': {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#7d888e', // رنگ اصلی خاکستری
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#131517',
        }
      },
    },
  },
  // ۳. اضافه کردن پلاگین تایپوگرافی
  plugins: [
    require('@tailwindcss/typography'),
  ],
};