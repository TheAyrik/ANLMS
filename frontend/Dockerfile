# frontend/Dockerfile

# استفاده از ایمیج رسمی Node.js 20
FROM node:20-alpine

# تنظیم دایرکتوری کار
WORKDIR /app

# کپی کردن فایل‌های پکیج
# این تمپلیت از package-lock.json استفاده می‌کند
COPY package.json package-lock.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی کردن بقیه کدهای پروژه
COPY . .

# اجرای سرور توسعه
CMD ["npm", "run", "dev"]