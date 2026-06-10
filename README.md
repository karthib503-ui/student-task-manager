# Student Task Manager — Docker Setup

A full-stack task management app for students, containerised with Docker.

| Layer     | Technology                              | Internal port |
|-----------|-----------------------------------------|--------------|
| Frontend  | React 18 + Vite, served by Nginx        | 80 (→ 3000)  |
| Backend   | Node.js 22 + Express + SQLite (built-in)| 3001         |
| Database  | SQLite file, persisted in a Docker volume| —           |

---

## Prerequisites

Install **Docker Desktop** (includes Docker Engine + Docker Compose):

- **macOS / Windows** → [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Linux** → [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/) then [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

Verify your installation:

```bash
docker --version          # Docker version 24+ recommended
docker compose version    # v2.x recommended
```

---

## Project Structure

Place all Docker files at the **root** of your project, alongside the `backend/` and `frontend/` folders:

```
Studentstask/
├── backend.Dockerfile      ← backend image definition
├── frontend.Dockerfile     ← frontend image definition
├── docker-compose.yml      ← orchestrates both services
├── nginx.conf              ← Nginx config (SPA routing + API proxy)
├── .dockerignore           ← speeds up builds, keeps images clean
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── database/
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
```

---

## Running the Application

### 1. Start everything with one command

```bash
docker compose up --build
```

This command:
1. Builds the **backend** image (installs Node deps, copies source).
2. Builds the **frontend** image (runs `npm run build`, bundles into Nginx).
3. Starts both containers on an isolated Docker network.
4. Waits for the backend health check before starting the frontend.

> First build takes ~2–3 minutes because it downloads base images and installs packages. Subsequent builds are much faster thanks to Docker layer caching.

### 2. Open the app

| What              | URL                             |
|-------------------|---------------------------------|
| React frontend    | http://localhost:3000           |
| Backend API       | http://localhost:3000/api/tasks |
| Backend (direct)  | not exposed — internal only     |

### 3. Stop the application

```bash
# Stop containers (data is preserved in the Docker volume)
docker compose down

# Stop AND delete all data (SQLite volume)
docker compose down -v
```

---

## Running in Detached (Background) Mode

```bash
docker compose up --build -d      # start in background
docker compose logs -f            # stream logs
docker compose down               # stop
```

---

## Rebuilding After Code Changes

```bash
# Rebuild only the service that changed
docker compose up --build backend
docker compose up --build frontend

# Or rebuild everything
docker compose up --build
```

---

## Environment Variables

The backend reads the following environment variables (with built-in defaults):

| Variable   | Default      | Description                    |
|------------|--------------|--------------------------------|
| `NODE_ENV` | `production` | Node environment               |
| `PORT`     | `3001`       | Port the Express server binds to |

To override, create a `.env` file in the project root:

```dotenv
# .env  (never commit this file)
NODE_ENV=production
PORT=3001
```

Docker Compose automatically loads `.env` from the project root.

---

## Data Persistence

SQLite data is stored in a **named Docker volume** called `student-task-sqlite`. This means:

- Data **survives** `docker compose down` and `docker compose up`.
- Data is **deleted** only with `docker compose down -v`.

To back up the database:

```bash
docker cp student-task-backend:/app/database/tasks.db ./tasks-backup.db
```

---

## Troubleshooting

**Port 3000 already in use**

```bash
# Change the host port in docker-compose.yml:
ports:
  - "8080:80"   # now accessible at http://localhost:8080
```

**Backend container crashes on startup**

```bash
docker compose logs backend
```

Look for `node:sqlite` errors — this module requires **Node 22+**. The Dockerfile already uses `node:22-alpine`, so this should not occur unless you change the base image.

**"Cannot connect to the Docker daemon"**

Make sure Docker Desktop is running before executing `docker compose` commands.

**Inspect a running container**

```bash
docker exec -it student-task-backend sh
docker exec -it student-task-frontend sh
```
