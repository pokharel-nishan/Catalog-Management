using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;

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
            UserName = registerDto.FirstName.ToLower() + registerDto.LastName.ToLower()
        };
        
        return await _userRepository.CreateUserAsync(user, registerDto.Password);
    }
}