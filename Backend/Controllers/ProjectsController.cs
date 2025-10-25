using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponse>>> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _projectService.GetUserProjectsAsync(userId);
            return Ok(projects);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectResponse>> CreateProject([FromBody] CreateProjectRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var project = await _projectService.CreateProjectAsync(userId, request);

            if (project == null)
            {
                return BadRequest(new { message = "Failed to create project" });
            }

            return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();
            var result = await _projectService.DeleteProjectAsync(userId, id);

            if (!result)
            {
                return NotFound(new { message = "Project not found" });
            }

            return NoContent();
        }
    }
}