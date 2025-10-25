using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        [Required]
        public int ProjectId { get; set; }

        // Navigation property
        public Project Project { get; set; } = null!;
    }
}