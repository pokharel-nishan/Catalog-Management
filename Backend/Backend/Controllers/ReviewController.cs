using System.Security.Claims;
using Backend.DTOs.User;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController: ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }
    
    [HttpPost("add/{bookId}")]
    public async Task<IActionResult> AddReview(Guid bookId, [FromBody] AddReviewDTO reviewDto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var review = await _reviewService.AddReviewAsync(
                userId.Value, 
                bookId, 
                reviewDto.Content, 
                reviewDto.Rating);
            
            return Ok(new { success = true, review });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
    
    [HttpGet("book/{bookId}")]
    public async Task<IActionResult> GetReviewsByBookId(Guid bookId)
    {
        var reviews = await _reviewService.GetReviewsByBookIdAsync(bookId);
        return Ok(new { success = true, reviews });
    }
    
    [HttpGet("user")]
    public async Task<IActionResult> GetReviewsByUserId()
    {
        var currentUserId = GetUserId();
        if (currentUserId == null) return Unauthorized();

        var targetUserId = currentUserId.Value;
        
        // Only allow admins or the reviewer to view all users' reviews 
        if (targetUserId != currentUserId && !User.IsInRole("Admin"))
            return Forbid();

        var reviews = await _reviewService.GetReviewsByUserIdAsync(targetUserId);
        return Ok(new { success = true, reviews });
    }
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
    
}