# JobNest

JobNest is a campus careers portal for students and employers. Students can browse and search jobs, create an account, and submit applications. Employers can publish listings and review applicants.

## Requirements

- Node.js
- MongoDB connection string

## Run locally

1. Configure the backend environment in `backend/.env`:

   ```env
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-long-random-secret
   PORT=5000
   CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
   ```

2. Install dependencies and start the backend:

   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

   The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it is available.

3. In a separate terminal, install frontend dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

The frontend defaults to `http://localhost:5000/api`. To use another API URL, set `VITE_API_URL` in the root `.env.local` file and restart Vite.

## Demo employer account

Seeding creates or updates this employer account:

- Email: `employer@jobnest.com`
- Password: `Employer123`

## Main API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` (employer)
- `PUT /api/jobs/:id` (employer)
- `DELETE /api/jobs/:id` (employer)
- `POST /api/applications` (job seeker)
- `GET /api/applications` (job seeker)
- `GET /api/applications/job/:jobId` (employer)
- `PUT /api/applications/:id` (employer)

Authenticated API requests use the `Authorization: Bearer <token>` header.
