using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Repositories;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user, string password);
    
    Task<bool> UserExistsAsync(string email);
    
    Task<SignInResult> LoginAsync(string email, string password, bool rememberMe = false);

    Task<Guid> GetAdminIdAsync();

    Task<User> CreateStaffUserAsync(User user, string password);

    Task<List<User>> GetAllStaffUsersAsync();


}