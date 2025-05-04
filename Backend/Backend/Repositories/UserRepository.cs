using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Repositories;

public class UserRepository : IUserRepository
{
    private UserManager<User> _userManager;

    public UserRepository(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Guid> GetAdminIdAsync()
    {
        var admins = await _userManager.GetUsersInRoleAsync("Admin");
        var admin = admins.FirstOrDefault();

        if (admin == null)
        {
            Console.WriteLine("Admin user not found");
        }
        return admin.Id;
    }
}