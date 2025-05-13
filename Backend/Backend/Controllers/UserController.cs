using System.Security.Claims;
using Backend.DTOs.Admin.Staff;
using Backend.DTOs.Common;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService, SignInManager<User> signInManager)
    {
        _userService = userService;
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
            return StatusCode(500, "An error occurred while registering user");
        }
    }

    //[Authorize(Roles = "Admin")]
    [HttpPost("createStaffUser")]
    public async Task<IActionResult> CreateStaffUser([FromBody] AddStaffUserDTO addStaffUserDTO)
    {
        try
        {
            var user = await _userService.CreateStaffUserAsync(addStaffUserDTO);
            return Ok(new { Message = "Staff user created successfully", UserId = user.Id });
        }
        catch (ApplicationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while creating staff user");
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
                var user = await _userService.GetUserByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    return StatusCode(500, "User not found after successful login");
                }

                // Generate the token
                var token = await _userService.GenerateTokenAsync(user);
                
                var userDetails = await _userService.GetUserDetailsByEmailAsync(loginDto.Email);
                return Ok(new
                {
                    success = true,
                    Message = "Login successful",
                    Token = token,
                    UserId = userDetails.Id,
                    userDetails.Roles,
                    userDetails.FirstName,
                    userDetails.LastName,
                });
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
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var userDetails = await _userService.GetUserDetailsByIdAsync(userId.Value);
        return Ok(new {success = true,  userDetails});
    }
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}