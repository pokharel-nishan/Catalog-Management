using System.Security.Claims;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookmarkController: ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarkController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }
    
    [HttpPost("toggle/{bookId}")]
    public async Task<IActionResult> ToggleBookmark(Guid bookId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _bookmarkService.ToggleBookmarkAsync(userId.Value, bookId);
        return Ok(new { success });
    }
    
    [HttpGet("my-books")]
    public async Task<IActionResult> GetMyBookmarkedBooks()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var books = await _bookmarkService.GetBookmarkedBooksAsync(userId.Value);
        return Ok(new { books });
    }
    
    [HttpGet("check/{bookId}")]
    public async Task<IActionResult> IsBookBookmarked(Guid bookId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var isBookmarked = await _bookmarkService.IsBookBookmarkedAsync(userId.Value, bookId);
        return Ok(new { isBookmarked });
    }
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}