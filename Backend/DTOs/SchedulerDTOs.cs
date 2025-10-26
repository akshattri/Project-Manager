// DTOs/SchedulerDTOs.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ScheduleRequest
    {
        public DateTime? StartDate { get; set; }
        
        [Range(1, 24)]
        public int? HoursPerDay { get; set; }
        
        [Range(1, 20)]
        public int? TasksPerDay { get; set; }
    }

    public class ScheduleResponse
    {
        public string Message { get; set; } = string.Empty;
        public List<ScheduledTaskInfo> ScheduledTasks { get; set; } = new();
        public int TotalTasks { get; set; }
        public int TotalDays { get; set; }
        public double AverageTasksPerDay { get; set; }
        public int OverdueTasks { get; set; }
    }

    public class ScheduledTaskInfo
    {
        public int TaskId { get; set; }
        public string TaskTitle { get; set; } = string.Empty;
        public string ProjectTitle { get; set; } = string.Empty;
        public DateTime? OriginalDueDate { get; set; }
        public DateTime SuggestedDate { get; set; }
        public string Priority { get; set; } = string.Empty;
        public bool IsOverdue { get; set; }
        public double EstimatedHours { get; set; }
    }
}