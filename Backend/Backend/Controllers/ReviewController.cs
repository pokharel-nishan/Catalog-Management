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
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
    
}