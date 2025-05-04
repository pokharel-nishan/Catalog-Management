using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class UserService: IUserService
{
    private readonly IUserRepository _userRepository;
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<User> RegisterUserAsync(RegisterDTO registerDto)
    {
        if (await _userRepository.UserExistsAsync(registerDto.Email))
        {
            throw new Exception($"Email {registerDto.Email} already exists");
        }

        var user = new User()
        {
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Address = registerDto.Address,
            DateJoined = DateTime.Now.ToString("yyyy-MM-dd"),
            UserName = registerDto.Email
        };
        
        return await _userRepository.CreateUserAsync(user, registerDto.Password);
    }
    
    public async Task<SignInResult> LoginUserAsync(LoginDTO loginDto)
    {
        return await _userRepository.LoginAsync(loginDto.Email, loginDto.Password, loginDto.RememberMe);
    }
}