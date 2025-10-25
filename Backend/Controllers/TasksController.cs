using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<ActionResult<IEnumerable<TaskResponse>>> GetProjectTasks(int projectId)
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetProjectTasksAsync(userId, projectId);
            return Ok(tasks);
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskResponse>> CreateTask(int projectId, [FromBody] CreateTaskRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(userId, projectId, request);

            if (task == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            return CreatedAtAction(nameof(GetProjectTasks), new { projectId = projectId }, task);
        }

        [HttpPut("tasks/{id}")]
        public async Task<ActionResult<TaskResponse>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(userId, id, request);

            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            return Ok(task);
        }

        [HttpDelete("tasks/{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var userId = GetUserId();
            var result = await _taskService.DeleteTaskAsync(userId, id);

            if (!result)
            {
                return NotFound(new { message = "Task not found" });
            }

            return NoContent();
        }
    }
}