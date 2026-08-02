# DevTrack

DevTrack is a lightweight Agile project and task management platform. It provides secure team-based projects, a Kanban workflow, task comments, and a concise dashboard—without introducing unnecessary infrastructure.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, dnd-kit
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens and bcrypt

## Features

- JWT registration, login, logout, and editable user profile
- Projects with admin/member roles and email-based team invitations
- Project CRUD, membership management, and project progress
- Task CRUD with priority, assignee, due date, and four-stage Kanban workflow
- Drag-and-drop task movement between Todo, In Progress, Review, and Done
- Comments, removable only by their author
- Dashboard metrics, recent tasks, overdue work, and progress visualisation

## Local setup

Prerequisites: Node.js 20+ and PostgreSQL 15+.

1. Copy environment templates:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Create a PostgreSQL database named `devtrack`, then update `backend/.env`.
3. Install all workspace dependencies:

   ```bash
   npm install
   ```

4. Apply the migration and generate Prisma client:

   ```bash
   npm run prisma:migrate --workspace backend
   ```

5. Start both applications:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Deployment

Deploy `frontend` to Vercel with `VITE_API_URL` set to the deployed API URL. Deploy `backend` to Render or Railway, configure its environment variables, run `npm run prisma:deploy`, and point `DATABASE_URL` to a Neon PostgreSQL database.

## API overview

| Area | Base route |
| --- | --- |
| Authentication | `/api/auth` |
| Current user | `/api/users/me` |
| Projects and members | `/api/projects` |
| Tasks | `/api/projects/:projectId/tasks` |
| Comments | `/api/tasks/:taskId/comments` |
| Dashboard | `/api/dashboard` |

All routes except registration and login require `Authorization: Bearer <token>`.
