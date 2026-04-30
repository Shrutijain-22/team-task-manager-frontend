# Team Task Manager - Frontend

The client-side application for the Team Task Manager platform. Built with React and Vite, it provides a clean, responsive interface for managing projects, assigning tasks, and tracking progress across teams.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Features](#features)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## Project Overview

This frontend is the user-facing layer of the Team Task Manager. It communicates with the backend REST API to provide authentication, project management, task tracking, and a real-time analytics dashboard.

The application enforces project-level role logic entirely in the UI — buttons and controls are shown or hidden based on whether the logged-in user is the creator of a given project, matching the backend's authorization model.

---

## Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Framework     | React 18                      |
| Build Tool    | Vite                          |
| Routing       | React Router v6               |
| HTTP Client   | Axios (with request interceptor) |
| Styling       | Tailwind CSS v3               |
| Deployment    | Railway                       |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- The backend server running locally or deployed

### Installation

```bash
# Clone the repository
git clone <your-frontend-repo-url>
cd team-task-manager-frontend

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

---

## Connecting to the Backend

All API calls are routed through a single Axios instance configured in:

```
src/api/axios.js
```

To point the frontend at a different backend, update the `baseURL`:

```js
const api = axios.create({
  baseURL: 'https://your-backend-url.up.railway.app',
});
```

The Axios interceptor automatically attaches the JWT token from `localStorage` to every outgoing request:

```js
config.headers.Authorization = `Bearer ${token}`;
```

For local development, set the `baseURL` to `http://localhost:5000`.

---

## Features

### Authentication
- User registration and login with JWT-based session management
- Token stored in `localStorage`, cleared on logout
- Automatic redirect to `/login` when token is missing or expired

### Dashboard
- Personal task metrics: total, completed, pending, overdue
- Tasks by status breakdown (To Do, In Progress, In Review, Done)
- Admin overview section (visible only to project creators): total projects, team task breakdown, tasks per user

### Projects
- View all projects the user is a member of or has created
- Create new projects (available to all authenticated users)
- Add team members via dropdown (names with emails, pre-filtered to exclude existing members)
- Remove team members (project creator only, cannot remove self)
- All member management controls hidden for non-creator users

### Tasks
- View tasks assigned to the user or within owned projects
- Create tasks with title, description, project, assignee, priority, and due date (project creators only)
- Status update dropdown visible only to the assigned user; all others see a read-only badge
- Task statuses: To Do, In Progress, In Review, Done
- Priority color coding: High (red), Medium (yellow), Low (blue)

### Navigation
- Active page highlighted dynamically in the navbar using `useLocation`
- Logout clears session and redirects to login

---

## Project Structure

```
src/
  api/
    axios.js          # Axios instance with base URL and auth interceptor
  components/
    Navbar.jsx        # Navigation bar with dynamic active state
  pages/
    Login.jsx         # Login form
    Signup.jsx        # Registration form
    Dashboard.jsx     # Analytics dashboard
    Projects.jsx      # Project list with member management
    Tasks.jsx         # Task table with status controls
  main.jsx            # App entry point
  App.jsx             # Route definitions
  index.css           # Global styles and Tailwind directives
```

---

## Deployment

The frontend is deployed on **Railway**, served as a static site using the `serve` package.

**Live URL:** `https://your-frontend-url.up.railway.app`

### How it Works

Railway runs the following sequence on every push to `main`:

1. `npm ci` — clean install of all dependencies
2. `npm run build` — Vite builds the app into `dist/`
3. `npm start` — `serve -s dist -l $PORT` starts a static file server in SPA mode

The `railway.json` file in the repository root configures this explicitly:

```json
{
  "build": {
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

### Environment Note

There are no secret environment variables required for the frontend. The backend URL is hardcoded in `src/api/axios.js`. If you need to make this configurable per environment, create a `.env` file:

```env
VITE_API_BASE_URL=https://your-backend-url.up.railway.app
```

And update `axios.js`:

```js
baseURL: import.meta.env.VITE_API_BASE_URL,
```
