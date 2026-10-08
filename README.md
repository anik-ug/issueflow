# IssueFlow

IssueFlow is a responsive MERN issue and task management application with JWT
authentication, issue CRUD, filtering, search, dashboard statistics, and
MongoDB persistence.

## Features

- User registration and login with JWT (stored in an HTTP-only cookie)
- Create, view, update and delete issues
- Issue fields: title, description, status, priority, assignee, due date
- Search, filter, sort and pagination on the issue list
- Dashboard with issue statistics
- Assignee search across registered users
- Responsive UI built with React

## Technologies Used

- **Frontend:** React, Vite
- **Backend:** Node.js 20+, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, HTTP-only cookies
- **Tooling:** ESLint, Vitest

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

## AI-Assisted Development

**Tool used:** Code0 (CodeZero) VS Code extension, with the GitHub Copilot CLI as the AI agent.

### How I used it

1. **Project scaffolding:** planned the architecture first (Code0 plan mode, no code changes), reviewed the plan, then approved it to generate the frontend/backend structure.
2. **API creation:** JWT auth, protected routes, issue CRUD, dashboard stats, search/filter/sort.
3. **React components:** pages and reusable UI components for the dashboard and issue management.
4. **Debugging:** fixed JSX parsing errors in `IssuesPage.jsx` and corrected the Express centralized error handler (Express only treats it as an error handler if it has 4 arguments).
5. **Dependencies and verification:** replaced a vulnerable `concurrently` package with a simple Node dev runner, upgraded Vite/Vitest, changed the API port from 5000 to 5001 because macOS uses port 5000, and verified lint, tests, build and a health-check API call.

### Issues I hit along the way

- Code0 initially could not find an AI provider, and its tool connection failed with Codex. I fixed this by installing the Copilot CLI, logging in and switching the agent to Copilot.
