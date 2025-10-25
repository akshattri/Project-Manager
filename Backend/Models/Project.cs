using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        [Required]
        public int UserId { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}