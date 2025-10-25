// Services/IProjectService.cs
using Backend.DTOs;

namespace Backend.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectResponse>> GetUserProjectsAsync(int userId);
        Task<ProjectResponse?> CreateProjectAsync(int userId, CreateProjectRequest request);
        Task<bool> DeleteProjectAsync(int userId, int projectId);
    }
}
