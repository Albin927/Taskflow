# TaskFlow

A full-stack task management application built with React, Node.js, Express, and PostgreSQL. The project includes JWT authentication, Docker containerization, GitHub Actions CI, and cloud deployment.

## Features

- User registration and JWT-based login
- Secure password hashing with bcrypt
- Create, view, edit, complete, and delete tasks
- Task priority and status management
- Dashboard statistics and filtering
- Protected REST APIs
- Dockerized frontend and backend

## Tech Stack

**Frontend:** React, Vite, JavaScript, Axios, CSS  
**Backend:** Node.js, Express.js, JWT, bcrypt  
**Database:** PostgreSQL, Supabase  
**DevOps:** Docker, Docker Compose, GitHub Actions  
**Deployment:** Vercel, Render, Supabase

## Architecture

```text
React / Vite
     |
   Vercel
     |
  REST API
     |
Node.js / Express
     |
   Render
     |
PostgreSQL
     |
  Supabase
```

## Project Structure

```text
Taskflow/
├── backend/
│   ├── config/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── Dockerfile
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Verify JWT |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get user tasks |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## CI/CD

GitHub Actions automatically:

- Installs frontend and backend dependencies
- Builds the frontend
- Builds backend and frontend Docker images
- Runs on pushes and pull requests to `main`

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Supabase PostgreSQL

Environment variables are used for database credentials, JWT secrets, and API configuration.

## Local Setup

```bash
git clone https://github.com/Albin927/Taskflow.git
cd Taskflow
docker compose up --build
```

The application can also be run separately using `npm install` and `npm run dev` in the frontend and backend directories.

## Key Learning Outcomes

- Full-stack application development
- REST API and JWT authentication
- PostgreSQL integration
- Docker and Docker Compose
- GitHub Actions CI
- Cloud deployment
- Production environment configuration

## Author

**Albin Thankachan**

B.Tech Computer Science and Engineering  
Minor in AI/ML