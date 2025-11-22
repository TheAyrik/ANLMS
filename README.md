# Environment Setup
- Copy `backend/.env.example` to `backend/.env` (and optionally `backend/.env.docker` for local Docker runs), then fill in real values; keep these files local and untracked.
- Copy `frontend/.env.local.example` to `frontend/.env.local` and edit it locally; keep it untracked.
- Real values for `DJANGO_SECRET_KEY`, database credentials, and `NEXT_PUBLIC_API_BASE_URL` live only in those local env files or in your hosting panel (e.g., Liara), never in git.

## Running the stack (Docker)
```bash
docker-compose up --build -d        # build and start backend/frontend/db
docker-compose exec backend python manage.py migrate  # apply migrations
docker-compose exec backend python manage.py createsuperuser  # optional admin
```

If migrations conflict with an old DB volume, reset it (data loss):
```bash
docker-compose down -v
docker-compose up --build -d
docker-compose exec backend python manage.py migrate
```

### Optional: محیط برای ساخت سوپریوزر خودکار
- در `backend/.env` یا `backend/.env.docker` مقداردهی کنید:
  - `DJANGO_SUPERUSER_USERNAME=admin`
  - `DJANGO_SUPERUSER_EMAIL=admin@example.com`
  - `DJANGO_SUPERUSER_PASSWORD=your-strong-password`
- سپس فرمان زیر فقط اولین بار اجرا می‌شود (اگر کاربر وجود نداشته باشد):
```bash
docker-compose exec backend python manage.py createsuperuser --noinput
```

## Local npm/lint (frontend)
```bash
cd frontend
npm install
npm run lint
```
