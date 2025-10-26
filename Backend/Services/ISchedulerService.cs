
// Services/ISchedulerService.cs
using Backend.DTOs;

namespace Backend.Services
{
    public interface ISchedulerService
    {
        Task<ScheduleResponse> GenerateScheduleAsync(int userId, ScheduleRequest request);
    }
}