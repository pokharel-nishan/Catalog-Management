using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Repositories;

public class UserRepository: IUserRepository
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;


    public UserRepository(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
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
}