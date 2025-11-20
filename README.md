# Environment Setup
- Copy `backend/.env.example` to `backend/.env` (and optionally `backend/.env.docker` for local Docker runs), then fill in real values; keep these files local and untracked.
- Copy `frontend/.env.local.example` to `frontend/.env.local` and edit it locally; keep it untracked.
- Real values for `DJANGO_SECRET_KEY`, database credentials, and `NEXT_PUBLIC_API_BASE_URL` live only in those local env files or in your hosting panel (e.g., Liara), never in git.
