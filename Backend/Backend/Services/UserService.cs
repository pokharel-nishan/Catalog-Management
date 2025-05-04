using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class UserService: IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;

    public UserService(IUserRepository userRepository, UserManager<User> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
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
    
    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }
    
    public async Task<string> GenerateTokenAsync(User user)
    {
        // Generate  token using the Identity API
        var tokenProvider = _userManager.Options.Tokens.PasswordResetTokenProvider;
        return await _userManager.GenerateUserTokenAsync(
            user, 
            tokenProvider, 
            "Authentication");
    }

     public async Task<Guid> GetAdminIdAsync()
    {
        return await _userRepository.GetAdminIdAsync();
    }
}