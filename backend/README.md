# JobNest Backend

## Run locally

1. Configure MongoDB and edit `.env`:
   - `MONGO_URI`
   - `JWT_SECRET`
2. Install and seed the database:

```bash
cd backend
npm install
npm run seed
npm run dev
```

The API runs at `http://localhost:5000` and the Vite frontend at `http://localhost:5173`.

## Demo employer

- Email: `employer@jobnest.com`
- Password: `Employer123`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/profile`
- `PUT /api/users/profile/update`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` - Employer
- `PUT /api/jobs/:id` - Employer
- `DELETE /api/jobs/:id` - Employer
- `POST /api/applications` - Job Seeker
- `GET /api/applications` - Job Seeker
- `GET /api/applications/job/:jobId` - Employer
- `PUT /api/applications/:id` - Employer

Send authenticated requests with `Authorization: Bearer <token>`.
