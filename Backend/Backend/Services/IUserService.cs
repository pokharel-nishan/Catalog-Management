using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public interface IUserService
{
    Task<User> RegisterUserAsync(RegisterDTO request);
    
    Task<SignInResult> LoginUserAsync(LoginDTO loginDto);


}