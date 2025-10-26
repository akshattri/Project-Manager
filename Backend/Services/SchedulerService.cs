// Services/SchedulerService.cs
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ApplicationDbContext _context;

        public SchedulerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ScheduleResponse> GenerateScheduleAsync(int userId, ScheduleRequest request)
        {
            // Get all incomplete tasks for the user across all projects
            var tasks = await _context.Tasks
                .Include(t => t.Project)
                .Where(t => t.Project.UserId == userId && !t.IsCompleted)
                .ToListAsync();

            if (!tasks.Any())
            {
                return new ScheduleResponse
                {
                    Message = "No incomplete tasks found to schedule.",
                    ScheduledTasks = new List<ScheduledTaskInfo>()
                };
            }

            // Smart scheduling algorithm
            var scheduledTasks = new List<ScheduledTaskInfo>();
            var currentDate = request.StartDate ?? DateTime.Today;
            var hoursPerDay = request.HoursPerDay ?? 8;
            var dailyTaskLimit = request.TasksPerDay ?? 5;

            // Prioritize tasks with due dates first
            var sortedTasks = tasks
                .OrderBy(t => t.DueDate.HasValue ? 0 : 1) // Tasks with due dates first
                .ThenBy(t => t.DueDate) // Then sort by due date
                .ThenBy(t => t.CreatedAt) // Then by creation date
                .ToList();

            var tasksPerDay = new Dictionary<DateTime, List<ScheduledTaskInfo>>();

            foreach (var task in sortedTasks)
            {
                // Find the next available day that hasn't reached task limit
                var scheduleDate = currentDate;
                while (tasksPerDay.ContainsKey(scheduleDate.Date) && 
                       tasksPerDay[scheduleDate.Date].Count >= dailyTaskLimit)
                {
                    scheduleDate = scheduleDate.AddDays(1);
                }

                // Check if task has a due date and we're scheduling after it
                var isOverdue = task.DueDate.HasValue && scheduleDate > task.DueDate.Value;
                var priority = DeterminePriority(task, scheduleDate);

                var scheduledTask = new ScheduledTaskInfo
                {
                    TaskId = task.Id,
                    TaskTitle = task.Title,
                    ProjectTitle = task.Project.Title,
                    OriginalDueDate = task.DueDate,
                    SuggestedDate = scheduleDate.Date,
                    Priority = priority,
                    IsOverdue = isOverdue,
                    EstimatedHours = CalculateEstimatedHours(task.Title)
                };

                if (!tasksPerDay.ContainsKey(scheduleDate.Date))
                {
                    tasksPerDay[scheduleDate.Date] = new List<ScheduledTaskInfo>();
                }

                tasksPerDay[scheduleDate.Date].Add(scheduledTask);
                scheduledTasks.Add(scheduledTask);

                // Move to next day if we've hit the daily limit
                if (tasksPerDay[scheduleDate.Date].Count >= dailyTaskLimit)
                {
                    currentDate = scheduleDate.AddDays(1);
                }
            }

            // Calculate workload distribution
            var workloadByDay = tasksPerDay.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Sum(t => t.EstimatedHours)
            );

            return new ScheduleResponse
            {
                Message = $"Successfully scheduled {scheduledTasks.Count} tasks across {tasksPerDay.Count} days.",
                ScheduledTasks = scheduledTasks.OrderBy(t => t.SuggestedDate).ToList(),
                TotalTasks = scheduledTasks.Count,
                TotalDays = tasksPerDay.Count,
                AverageTasksPerDay = tasksPerDay.Count > 0 ? (double)scheduledTasks.Count / tasksPerDay.Count : 0,
                OverdueTasks = scheduledTasks.Count(t => t.IsOverdue)
            };
        }

        private string DeterminePriority(TaskItem task, DateTime scheduleDate)
        {
            if (!task.DueDate.HasValue)
                return "Low";

            var daysUntilDue = (task.DueDate.Value - scheduleDate).TotalDays;

            if (daysUntilDue < 0)
                return "Critical";
            else if (daysUntilDue <= 1)
                return "High";
            else if (daysUntilDue <= 3)
                return "Medium";
            else
                return "Low";
        }

        private double CalculateEstimatedHours(string title)
        {
            // Simple heuristic: estimate hours based on title length and keywords
            var baseHours = 2.0;
            var titleLower = title.ToLower();

            if (titleLower.Contains("quick") || titleLower.Contains("small"))
                baseHours = 1.0;
            else if (titleLower.Contains("major") || titleLower.Contains("complete") || titleLower.Contains("implement"))
                baseHours = 6.0;
            else if (titleLower.Contains("review") || titleLower.Contains("update"))
                baseHours = 2.0;
            else if (titleLower.Contains("research") || titleLower.Contains("design"))
                baseHours = 4.0;

            return baseHours;
        }
    }
}