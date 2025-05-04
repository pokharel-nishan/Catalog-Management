using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Repositories;

public class UserRepository: IUserRepository
{
    private readonly UserManager<User> _userManager;

    public UserRepository(UserManager<User> userManager)
    {
        _userManager = userManager;
    }
    public async Task<User> CreateUserAsync(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new ApplicationException("Failed to create user.");
        }

        return user;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
       return await _userManager.FindByEmailAsync(email) != null;
    }
}