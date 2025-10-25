// DTOs/TaskDTOs.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreateTaskRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskRequest
    {
        [StringLength(200)]
        public string? Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool? IsCompleted { get; set; }
    }

    public class TaskResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProjectId { get; set; }
    }
}