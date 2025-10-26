# Project Management System with Smart Scheduler

A comprehensive full-stack project management application with intelligent task scheduling, built with .NET 8 and React + TypeScript.

## Live Demo

- **Frontend (Vercel)**: [https://project-management-eight-delta.vercel.app](https://project-management-eight-delta.vercel.app)
- **Backend API (Render)**: [https://project-manager-m4uh.onrender.com](https://project-manager-m4uh.onrender.com)

<!-- > **Note**: First request to backend may take 30-60 seconds as the free tier spins up from sleep mode. -->

## 🧪 Local testing (localhost)

If you can't deploy to Render yet, you can run and test the full app locally (backend + frontend).

Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- (Optional) sqlite3 CLI to inspect the DB

1) Start the backend
```bash
cd /Users/akshat/Desktop/Appsian/Backend
# restore & build once
dotnet restore
dotnet build

# Run (dev)
dotnet run
```
- Default local URLs (check console when running):
  - HTTP: http://localhost:5070
  - HTTPS: https://localhost:7093
- If you see "Failed to create task" or NOT NULL errors, delete the DB (dev only):
```bash
cp projectmanagement.db projectmanagement.db.bak
rm projectmanagement.db
dotnet run
```
- To inspect the DB schema or content:
```bash
sqlite3 projectmanagement.db ".schema Tasks"
sqlite3 projectmanagement.db "SELECT id, username, email FROM Users;"
```

2) Start the frontend
```bash
cd /Users/akshat/Desktop/Appsian/Frontend
npm install
npm run dev
```
- Frontend dev server default: http://localhost:5173
- Ensure `Frontend/vite.config.ts` proxy points to the backend HTTP port (http://localhost:5070) or HTTPS port if you have dev certs.

3) Quick API smoke tests (use the backend port reported by dotnet)
- Register:
```bash
curl -s -X POST http://localhost:5070/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"localuser","email":"local@example.com","password":"Password123!"}' | jq
```
- Login (get token):
```bash
curl -s -X POST http://localhost:5070/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"local@example.com","password":"Password123!" }' | jq
# copy "token" from response
```
- Create a project:
```bash
curl -s -X POST http://localhost:5070/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Local Project","description":"test"}' | jq
```
- Create a task:
```bash
curl -s -X POST http://localhost:5070/api/projects/<PROJECT_ID>/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Local Task","dueDate":"2025-11-01T00:00:00Z"}' | jq
```

4) Troubleshooting tips
- If frontend shows "Registration failed" or UI errors, open DevTools → Network to inspect request/response.
- Confirm Authorization header contains Bearer token on protected calls.
- If DB schema mismatches cause errors, either recreate DB (dev) or add an EF migration to drop unwanted columns.
- Check backend console/log for full EF exception stack traces; they point to the failing column or constraint.

---

## Screenshots

<div align="center">
<!-- 
### Login
![Login](/docs/screenshots/login.png) -->

### Dashboard
![Dashboard](/Frontend/public/Screenshots/Dashboard.png)

### Project details (tasks)
![Project Details](/Frontend/public/Screenshots/project-details.png)

### Smart Scheduler
![Project Details](/Frontend/public/Screenshots/Smart-Scheduler.png)

</div>

## 👤 Test Credentials

You can register a new account or use these test credentials:
- **Email**: demo@example.com
- **Password**: Demo123!

---

## Features

### Core Functionality
- **User Authentication** - Secure JWT-based registration and login
- **Project Management** - Create, view, and delete projects
- **Task Management** - Add, edit, delete, and toggle task completion
- **Task Dependencies** - Define which tasks must be completed before others
- **Estimated Hours** - Track time estimates for each task

### Advanced Features
- **Smart Scheduler API** - AI-powered task scheduling using topological sort
  - Automatically orders tasks based on dependencies
  - Detects and prevents circular dependencies
  - Optimizes work sequence for maximum efficiency
- **Dark Mode** - Toggle between light and dark themes
- **Mobile-Friendly** - Responsive design for all screen sizes
- **Modern UI** - Clean, intuitive interface with smooth animations
- **Progress Tracking** - Visual progress bars and statistics
- **Real-time Updates** - Instant feedback on all operations

---

## Tech Stack

### Backend
- **Framework**: .NET 8 Core (C#)
- **ORM**: Entity Framework Core
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful
- **Validation**: DataAnnotations
- **Architecture**: Layered (Controllers → Services → Data)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API + Hooks
- **Styling**: Inline styles with theme support

---

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "email": "john@example.com",
  "userId": 1
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer {token}
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Complete redesign of company website"
}
```

#### Delete Project
```http
DELETE /api/projects/{projectId}
Authorization: Bearer {token}
```

### Task Endpoints

#### Get Project Tasks
```http
GET /api/projects/{projectId}/tasks
Authorization: Bearer {token}
```

#### Create Task
```http
POST /api/projects/{projectId}/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Design API",
  "dueDate": "2025-10-25",
  "estimatedHours": 5,
  "dependencies": []
}
```

#### Update Task
```http
PUT /api/tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "estimatedHours": 8,
  "isCompleted": true,
  "dependencies": ["Design API"]
}
```

#### Delete Task
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}
```

### 🤖 Smart Scheduler Endpoint 

#### Generate Schedule
```http
POST /api/v1/projects/{projectId}/schedule
Authorization: Bearer {token}
Content-Type: application/json

{
  "tasks": [
    {
      "title": "Design API",
      "estimatedHours": 5,
      "dueDate": "2025-10-25",
      "dependencies": []
    },
    {
      "title": "Implement Backend",
      "estimatedHours": 12,
      "dueDate": "2025-10-28",
      "dependencies": ["Design API"]
    },
    {
      "title": "Build Frontend",
      "estimatedHours": 10,
      "dueDate": "2025-10-30",
      "dependencies": ["Design API"]
    },
    {
      "title": "End-to-End Test",
      "estimatedHours": 8,
      "dueDate": "2025-10-31",
      "dependencies": ["Implement Backend", "Build Frontend"]
    }
  ]
}
```

**Response:**
```json
{
  "recommendedOrder": [
    "Design API",
    "Implement Backend",
    "Build Frontend",
    "End-to-End Test"
  ]
}
```

**Algorithm**: Uses topological sort with DFS to resolve task dependencies and detect circular dependencies.

---

## 📁 Project Structure

```
project-management-system/
├── Backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   ├── TasksController.cs
│   │   └── SchedulerController.cs
│   ├── DTOs/
│   │   ├── AuthDTOs.cs
│   │   ├── ProjectDTOs.cs
│   │   ├── TaskDTOs.cs
│   │   └── SchedulerDTOs.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Project.cs
│   │   └── TaskItem.cs
│   ├── Services/
│   │   ├── IAuthService.cs
│   │   ├── AuthService.cs
│   │   ├── IProjectService.cs
│   │   ├── ProjectService.cs
│   │   ├── ITaskService.cs
│   │   ├── TaskService.cs
│   │   ├── ISchedulerService.cs
│   │   └── SchedulerService.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProjectDetails.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## Developer Information

**Author**: Akshat

**Contact**: 
- Email: akshatattri22@gmail.com
- GitHub: [akshattri](https://github.com/akshattri)
- LinkedIn: [Akshat](https://www.linkedin.com/in/akshat-attri-a0746424b/)

