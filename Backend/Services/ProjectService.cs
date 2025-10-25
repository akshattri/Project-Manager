// Services/ProjectService.cs
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectResponse>> GetUserProjectsAsync(int userId)
        {
            var projects = await _context.Projects
                .Where(p => p.UserId == userId)
                .Include(p => p.Tasks)
                .Select(p => new ProjectResponse
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    TaskCount = p.Tasks.Count
                })
                .ToListAsync();

            return projects;
        }

        public async Task<ProjectResponse?> CreateProjectAsync(int userId, CreateProjectRequest request)
        {
            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                TaskCount = 0
            };
        }

        public async Task<bool> DeleteProjectAsync(int userId, int projectId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}