// Services/IAuthService.cs
using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
    }
}