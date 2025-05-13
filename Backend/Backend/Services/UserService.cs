using Backend.DTOs.Admin.Staff;
using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;

namespace Backend.Services;

public class UserService : IUserService
{
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;
    private readonly ICartService _cartService;


    public UserService(IUserRepository userRepository, UserManager<User> userManager, IConfiguration configuration, ICartService cartService)
    {
        _userRepository = userRepository;
        _userManager = userManager;
        _cartService = cartService;
        _configuration = configuration;
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

        var createdUser = await _userRepository.CreateUserAsync(user, registerDto.Password);
        
        try
        {
            await _cartService.CreateCartForUserAsync(createdUser.Id);
        }
        catch (Exception ex)
        {
            throw new Exception("User registration completed but cart creation failed", ex);
        }

        return createdUser;
    }

    public async Task<User> CreateStaffUserAsync(AddStaffUserDTO addStaffUserDTO)
    {
        if (await _userRepository.UserExistsAsync(addStaffUserDTO.Email))
        {
            throw new Exception($"Email {addStaffUserDTO.Email} already exists");
        }

        var staffUser = new User()
        {
            Email = addStaffUserDTO.Email,
            FirstName = addStaffUserDTO.FirstName,
            LastName = addStaffUserDTO.LastName,
            Address = addStaffUserDTO.Address,
            DateJoined = DateTime.Now.ToString("yyyy-MM-dd"),
            UserName = addStaffUserDTO.Email
        };

        return await _userRepository.CreateStaffUserAsync(staffUser, addStaffUserDTO.Password);
    }

    public async Task<SignInResult> LoginUserAsync(LoginDTO loginDto)
    {
        return await _userRepository.LoginAsync(loginDto.Email, loginDto.Password, loginDto.RememberMe);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<LoginResponseDTO> GetUserDetailsByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new LoginResponseDTO()
        {
            Id = user.Id,
            Email = user.Email,
            Roles = roles,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }
    
    public async Task<string> GenerateTokenAsync(User user)
    {
        // Create claims
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? "Regular")
        };

        // Create token signature
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        // Encrypt the token signature
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create and return the token
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    public async Task<Guid> GetAdminIdAsync()
    {
        return await _userRepository.GetAdminIdAsync();
    }
}