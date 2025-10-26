# 📊 Project Management System with Smart Scheduler

A comprehensive full-stack project management application with intelligent task scheduling, built with .NET 8 and React + TypeScript.

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://project-manager-git-main-akshats-projects-bcb9d98f.vercel.app](https://project-manager-git-main-akshats-projects-bcb9d98f.vercel.app)
<!-- - **Backend API (Render)**: [https://your-api.onrender.com](https://your-api.onrender.com) -->

<!-- > **Note**: First request to backend may take 30-60 seconds as the free tier spins up from sleep mode. -->

## 👤 Test Credentials

You can register a new account or use these test credentials:
- **Email**: demo@example.com
- **Password**: Demo123!

---

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based registration and login
- ✅ **Project Management** - Create, view, and delete projects
- ✅ **Task Management** - Add, edit, delete, and toggle task completion
- ✅ **Task Dependencies** - Define which tasks must be completed before others
- ✅ **Estimated Hours** - Track time estimates for each task

### Advanced Features
- 🤖 **Smart Scheduler API** - AI-powered task scheduling using topological sort
  - Automatically orders tasks based on dependencies
  - Detects and prevents circular dependencies
  - Optimizes work sequence for maximum efficiency
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Mobile-Friendly** - Responsive design for all screen sizes
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 📊 **Progress Tracking** - Visual progress bars and statistics
- ⚡ **Real-time Updates** - Instant feedback on all operations

---

## 🛠️ Tech Stack

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

### 🤖 Smart Scheduler Endpoint (Bonus Feature)

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

## 🏗️ Local Development Setup

### Prerequisites
- .NET 8 SDK ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- Node.js 18+ ([Download](https://nodejs.org/))
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system

# Navigate to backend directory
cd Backend

# Restore dependencies
dotnet restore

# Run the application
dotnet run

# Backend will be available at https://localhost:7000
```

### Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd Frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend will be available at http://localhost:5173
```

### Database Setup

The SQLite database is created automatically on first run. If you need to reset:

```bash
cd Backend
rm projectmanagement.db
dotnet run
```

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

## 🧪 Testing the Smart Scheduler

### Example Workflow

1. **Create a Project**
   - Login to the application
   - Click "+ New Project"
   - Enter: "Software Development"

2. **Add Tasks with Dependencies**

   | Order | Task Title | Est. Hours | Due Date | Dependencies |
   |-------|-----------|------------|----------|--------------|
   | 1 | Design API | 5 | 2025-10-25 | None |
   | 2 | Implement Backend | 12 | 2025-10-28 | Design API |
   | 3 | Build Frontend | 10 | 2025-10-30 | Design API |
   | 4 | End-to-End Test | 8 | 2025-10-31 | Implement Backend, Build Frontend |

3. **Generate Schedule**
   - Click "🤖 Smart Schedule" button
   - View the recommended order
   - Tasks are automatically sorted by dependencies

4. **Expected Result**
   ```
   Recommended Order:
   1. Design API
   2. Implement Backend
   3. Build Frontend
   4. End-to-End Test
   ```

### Circular Dependency Detection

If you create tasks with circular dependencies (A → B → C → A), the Smart Scheduler will detect and reject them with an error message.

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Configure:
   - **Build Command**: `dotnet restore && dotnet publish -c Release -o out`
   - **Start Command**: `cd out && dotnet Backend.dll`
   - **Environment Variables**:
     - `ASPNETCORE_ENVIRONMENT=Production`
     - `ASPNETCORE_URLS=http://0.0.0.0:$PORT`
     - `Jwt__Key=YOUR_SECRET_KEY`

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL=https://your-backend.onrender.com`

### Post-Deployment

Update backend CORS to include your Vercel URL:

```csharp
// Backend/Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://your-app.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

---

## 🎯 Assignment Requirements Met

### Home Assignment 2 - Mini Project Manager (20 Credits)

✅ **Authentication**
- User registration with validation
- Login with JWT tokens
- Protected routes and endpoints

✅ **Projects**
- Create projects with title and description
- List all user's projects
- Delete projects (cascading to tasks)

✅ **Tasks**
- Create tasks with title, due date, and completion status
- Update tasks (including completion toggle)
- Delete tasks
- Link tasks to parent projects

✅ **Backend Requirements**
- RESTful API with .NET 8 Core
- Entity Framework Core with SQLite
- JWT authentication
- DataAnnotations for validation
- Separation of concerns (DTOs, Services, Models, Controllers)

✅ **Frontend Requirements**
- React + TypeScript
- Login/Register pages
- Dashboard (project list)
- Project details with task management
- React Router for navigation
- Form validation and error handling
- JWT storage and reuse

### Smart Scheduler API (10 Bonus Credits)

✅ **Endpoint Implementation**
- POST /api/v1/projects/{projectId}/schedule
- Accepts tasks with dependencies
- Returns recommended order

✅ **Algorithm**
- Topological sort with DFS
- Circular dependency detection
- Handles complex dependency graphs

✅ **Additional Features**
- Loading indicators
- User feedback and error messages
- Mobile-friendly design
- Deployed on Render + Vercel

---

## 🔒 Security Features

- **Password Hashing**: BCrypt with salt
- **JWT Tokens**: Secure authentication with 24-hour expiry
- **Authorization**: User-specific data isolation
- **Input Validation**: Server-side and client-side
- **CORS Configuration**: Restricted to specific origins
- **SQL Injection Prevention**: Entity Framework parameterized queries

---

## 📊 Key Algorithms

### Topological Sort (Smart Scheduler)

**Purpose**: Order tasks based on dependencies

**Approach**: Depth-First Search (DFS)

**Time Complexity**: O(V + E) where V = tasks, E = dependencies

**Features**:
- Detects circular dependencies
- Handles multiple independent paths
- Respects all dependency constraints

**Example**:
```
Input: A → B → D
       A → C → D

Output: [A, B, C, D] or [A, C, B, D]
```

---

## 🐛 Known Limitations

- Free tier backend (Render) has cold start delay (~30-60 seconds)
- SQLite not recommended for high-concurrency production use
- No email verification for registration
- No password reset functionality
- No task priority levels (future enhancement)

---

## 🔮 Future Enhancements

- [ ] Task priority levels (High, Medium, Low)
- [ ] Email notifications for due dates
- [ ] Task comments and attachments
- [ ] Team collaboration features
- [ ] Calendar view for tasks
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF
- [ ] Task templates
- [ ] Time tracking integration
- [ ] Mobile apps (iOS/Android)

---

## 👨‍💻 Developer Information

**Author**: [Your Name]

**Contact**: 
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

**Assignment**: PLC Home Coding Assignment - October 2025

**Credits Earned**: 
- Home Assignment 2: 20 credits
- Smart Scheduler API: 10 credits
- **Total**: 30 credits

---

## 📄 License

This project was created as part of a coding assignment. All rights reserved.

---

## 🙏 Acknowledgments

- .NET 8 and Entity Framework Core documentation
- React and TypeScript communities
- Render and Vercel for free hosting
- Claude AI for development assistance

---

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/project-management-system/issues) page
2. Ensure all environment variables are set correctly
3. Verify backend is running (may take 30-60s on first request)
4. Check browser console for frontend errors
5. Review API responses in Network tab

For questions or bug reports, please open an issue on GitHub.

---

## ✅ Quick Start Checklist

- [ ] Clone repository
- [ ] Install .NET 8 SDK
- [ ] Install Node.js 18+
- [ ] Run backend: `cd Backend && dotnet run`
- [ ] Run frontend: `cd Frontend && npm install && npm run dev`
- [ ] Open http://localhost:5173
- [ ] Register a new account
- [ ] Create a project
- [ ] Add tasks with dependencies
- [ ] Test Smart Scheduler

---

**⭐ If you find this project helpful, please star the repository!**

**🚀 Ready to deploy? Follow the deployment guide in the documentation.**

**📚 Happy coding!**