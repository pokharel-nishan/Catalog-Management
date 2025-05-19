using Backend.Entities;
using Microsoft.AspNetCore.Identity;

using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ApplicationDbContext _context;

    public UserRepository(UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
    }

    public async Task<User> CreateUserAsync(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new ApplicationException("Failed to create user.");
        }
        
        // Add user to "Regular" role
        var roleResult = await _userManager.AddToRoleAsync(user, "Regular");
        if (!roleResult.Succeeded)
        {
            throw new ApplicationException("Failed to create regular user.");
        }
        
        return user;
    }

    public async Task<User> CreateStaffUserAsync(User user, string password)
    {
        // Create the user
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new ApplicationException("Failed to create staff user.");
        }

        // Add user to "Staff" role
        var roleResult = await _userManager.AddToRoleAsync(user, "Staff");
        if (!roleResult.Succeeded)
        {
            throw new ApplicationException("Failed to create staff user.");
        }

        return user;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email) != null;
    }

    public async Task<SignInResult> LoginAsync(string email, string password, bool rememberMe = false)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return SignInResult.Failed;
        }

        // use the Identity system to validate the password and sign in
        return await _signInManager.PasswordSignInAsync(user, password, rememberMe, lockoutOnFailure: false);
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

    public async Task<List<User>> getAllRegularUsersAsync()
    {
        return (await _userManager.GetUsersInRoleAsync("Regular")).ToList();
    }
    
    public async Task<List<User>> GetAllStaffUsersAsync()
    {
        return (await _userManager.GetUsersInRoleAsync("Staff")).ToList();
    }
    
    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);
    }
    
    public async Task<List<User>> GetUsersInRoleAsync(string roleName)
    {
        var role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == roleName);
        if (role == null)
        {
            return new List<User>();
        }

        var userIds = await _context.UserRoles
            .Where(ur => ur.RoleId == role.Id)
            .Select(ur => ur.UserId)
            .ToListAsync();

        return await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync();
    }
}