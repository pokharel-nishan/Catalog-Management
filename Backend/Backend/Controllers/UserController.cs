using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;


    public UserController(IUserService userService, SignInManager<User> signInManager)
    {
        _userService = userService;
        _signInManager = signInManager;

    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
    {
        try
        {
            var user = await _userService.RegisterUserAsync(registerDto);
            return Ok(new { Message = "User registered successfully", UserId = user.Id });
        }
        catch (ApplicationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while registering user" );
        }
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
    {
        try
        {
            var result = await _userService.LoginUserAsync(loginDto);
            
            if (result.Succeeded)
            {
                return Ok(new { Message = "Login successful" });
            }
            
            if (result.IsLockedOut)
            {
                return StatusCode(403, "Account locked out");
            }
            
            if (result.RequiresTwoFactor)
            {
                return StatusCode(401, "Requires two-factor authentication");
            }
            
            return Unauthorized("Invalid login attempt");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred during login: {ex.Message}");
        }
    }
    
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        return Ok(new { Message = "You are authenticated", UserId = User.Identity.Name });
    }
}