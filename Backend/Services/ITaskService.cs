using Backend.DTOs;

namespace Backend.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponse>> GetProjectTasksAsync(int userId, int projectId);
        Task<TaskResponse?> CreateTaskAsync(int userId, int projectId, CreateTaskRequest request);
        Task<TaskResponse?> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request);
        Task<bool> DeleteTaskAsync(int userId, int taskId);
    }
}