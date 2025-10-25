// Services/TaskService.cs
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskResponse>> GetProjectTasksAsync(int userId, int projectId)
        {
            // Verify project belongs to user
            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == projectId && p.UserId == userId);

            if (!projectExists)
            {
                return Enumerable.Empty<TaskResponse>();
            }

            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskResponse
                {
                    Id = t.Id,
                    Title = t.Title,
                    DueDate = t.DueDate,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    ProjectId = t.ProjectId
                })
                .ToListAsync();

            return tasks;
        }

        public async Task<TaskResponse?> CreateTaskAsync(int userId, int projectId, CreateTaskRequest request)
        {
            // Verify project belongs to user
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return null;
            }

            var task = new TaskItem
            {
                Title = request.Title,
                DueDate = request.DueDate,
                ProjectId = projectId,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<TaskResponse?> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                return null;
            }

            // Update only provided fields
            if (request.Title != null)
            {
                task.Title = request.Title;
            }

            if (request.DueDate.HasValue)
            {
                task.DueDate = request.DueDate;
            }

            if (request.IsCompleted.HasValue)
            {
                task.IsCompleted = request.IsCompleted.Value;
            }

            await _context.SaveChangesAsync();

            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<bool> DeleteTaskAsync(int userId, int taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                return false;
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}