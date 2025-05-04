using Backend.DTOs.User;
using Backend.Entities;

namespace Backend.Services;

public interface IUserService
{
    Task<User> RegisterUserAsync(RegisterDTO request);

}