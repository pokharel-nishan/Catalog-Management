using Backend.Repositories;

namespace Backend.Services;

public class UserService : IUserService
{
    private IUserRepository _userRepository;
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Guid> GetAdminIdAsync()
    {
        return await _userRepository.GetAdminIdAsync();
    }

}