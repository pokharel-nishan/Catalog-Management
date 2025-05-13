using Backend.DTOs.Admin.Staff;
using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public interface IUserService
{
    Task<User> RegisterUserAsync(RegisterDTO request);
    Task<User> CreateStaffUserAsync(AddStaffUserDTO addStaffUserDTO);

    Task<LoginResponseDTO> GetUserDetailsByEmailAsync(string email);

    Task<User> GetUserByEmailAsync(string email);

    Task<SignInResult> LoginUserAsync(LoginDTO loginDto);

    Task<string> GenerateTokenAsync(User user);

    public Task<Guid> GetAdminIdAsync();

    Task<UserDetailsDTO> GetUserDetailsByIdAsync(Guid userId);

    Task<List<UserDetailsDTO>> GetAllUsers();
}