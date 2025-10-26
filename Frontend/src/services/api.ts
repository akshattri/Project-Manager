// src/services/api.ts
import axios from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Project,
  CreateProjectRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../types';

// Add this at the top of the file
const API_BASE_URL = (import.meta as any).env?.PROD
  ? 'https://project-manager-m4uh.onrender.com'  // Production
  : '/api';  // Development (uses vite proxy)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  create: async (projectId: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Scheduler API (NEW)
export interface ScheduleRequest {
  startDate?: string;
  hoursPerDay?: number;
  tasksPerDay?: number;
}

export interface ScheduledTaskInfo {
  taskId: number;
  taskTitle: string;
  projectTitle: string;
  originalDueDate?: string;
  suggestedDate: string;
  priority: string;
  isOverdue: boolean;
  estimatedHours: number;
}

export interface ScheduleResponse {
  message: string;
  scheduledTasks: ScheduledTaskInfo[];
  totalTasks: number;
  totalDays: number;
  averageTasksPerDay: number;
  overdueTasks: number;
}

export const schedulerAPI = {
  generateSchedule: async (data: ScheduleRequest): Promise<ScheduleResponse> => {
    const response = await api.post<ScheduleResponse>('/scheduler/generate', data);
    return response.data;
  },
};

export default api;