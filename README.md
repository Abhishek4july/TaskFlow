# TaskFlow – Full-Stack Task Management Application

TaskFlow is a full-stack task management application that helps users organize, track, and manage their daily tasks. Users can create an account, securely log in, manage their personal tasks, and monitor their progress through a dashboard.

## Features

- **User Authentication** – Register and log in using JWT-based authentication.
- **Password Security** – Passwords are hashed using bcrypt.
- **Task Management** – Create, view, update, and delete tasks.
- **Task Status** – Track tasks using TODO, IN_PROGRESS, and DONE.
- **Task Priority** – Organize tasks by LOW, MEDIUM, and HIGH priority.
- **Search and Filtering** – Search tasks and filter by status and priority.
- **Dashboard** – View task statistics and manage tasks from one place.
- **Task Details** – View individual task information.
- **User Profile** – View account information.
- **Protected APIs** – Users can access and manage only their own tasks.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication
- Passport.js
- bcrypt

### Database
- PostgreSQL

### Tools
- Git and GitHub
- pgAdmin
- Postman

## Project Structure

```text
TaskFlow/
│
├── taskflow-frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       ├── dashboard/
│   │       ├── login/
│   │       ├── register/
│   │       ├── profile/
│   │       ├── tasks/
│   │       └── lib/
│   └── package.json
│
├── taskflow-backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── prisma/
│   ├── prisma/
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek4july/TaskFlow.git
cd TaskFlow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd taskflow-backend
npm install
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_jwt_secret"
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma Client if needed:

```bash
npx prisma generate
```

Start the backend development server:

```bash
npm run start:dev
```

Backend runs at:

`http://localhost:3000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd taskflow-frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev -- -p 3001
```

Frontend runs at:

`http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in |
| GET | `/auth/profile` | Get authenticated user profile |

### Tasks

All task endpoints require JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get user's tasks |
| GET | `/tasks/:id` | Get a specific task |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

For protected endpoints, include the access token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Database Design

The application uses PostgreSQL with Prisma ORM.

Main models:

- **User** – Stores user account information.
- **Task** – Stores task details, status, priority, and ownership.

Each task is associated with its owner through a user relationship.

## Security

- Passwords are hashed using bcrypt.
- JWT tokens protect authenticated routes.
- DTO validation is implemented using class-validator.
- Task ownership is checked before accessing or modifying individual tasks.
- Environment files containing secrets are excluded from Git.

## Future Improvements

- Task due dates and reminders.
- Pagination and sorting.
- Improved authentication using secure HttpOnly cookies.
- Task activity history.
- Enhanced dashboard analytics.

## Author

**Abhishek Singh**

GitHub: [Abhishek4july](https://github.com/Abhishek4july)

---

*TaskFlow – Stay organized. Stay productive.*
