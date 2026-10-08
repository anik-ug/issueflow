# IssueFlow

IssueFlow is a responsive MERN issue and task management application with JWT
authentication, issue CRUD, filtering, search, dashboard statistics, and
MongoDB persistence.

## Local development

1. Install Node.js 20+ and MongoDB, and start the MongoDB service.
2. From the repository root, install dependencies:
   `npm install && npm install --prefix backend && npm install --prefix frontend`.
3. Copy `backend/.env.example` to `backend/.env` and
   `frontend/.env.example` to `frontend/.env`.
4. Set a strong random `JWT_SECRET` in `backend/.env`. Keep the default local
   `MONGODB_URI` unless MongoDB runs elsewhere.
5. Start both applications with `npm run dev`.

The API runs on `http://localhost:5001` and the Vite client on
`http://localhost:5173`. Run `npm run lint`, `npm run test`, and
`npm run build` for checks. Never commit `.env` files or real credentials.

## API overview

Authentication endpoints are available at `/api/v1/auth/register`,
`/api/v1/auth/login`, `/api/v1/auth/logout`, and `/api/v1/auth/me`. Authenticated
clients can create and manage issues through `/api/v1/issues`, inspect
`/api/v1/dashboard/stats`, and search assignable users through `/api/v1/users`.
The session JWT is stored in an HTTP-only cookie; browser clients must send
credentials with requests.

Issue list requests support `search`, `status`, `priority`, `sort`, `order`,
`page`, and `limit`. MongoDB must be running locally or `MONGODB_URI` must
point to an accessible database. In production, use a long random JWT secret,
HTTPS, a specific client origin, and a managed MongoDB deployment.
