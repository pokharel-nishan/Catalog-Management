using Backend.Entities;

namespace Backend.Repositories;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user, string password);
    
    Task<bool> UserExistsAsync(string email);
}