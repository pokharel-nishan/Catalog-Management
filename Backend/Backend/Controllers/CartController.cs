using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.DTOs.User;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController: ControllerBase
{
    private readonly ICartService _cartService;
    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }
    
    [Authorize(Roles = "Regular")]
    [HttpPost("add-to-cart/{bookId}")]
    public async Task<IActionResult> AddTToCart(Guid bookId)
    {
        var userId = GetUserId();
        if (userId == null){
            return Unauthorized("Invalid user identification");
        }
        
        try
        {
            var cartItem = await _cartService.AddBookToCartAsync(userId.Value, bookId);
            return Ok(new { 
                success = true,
                message = "Book added to cart",
                cartItem = new CartItemDTO() {
                    BookId = cartItem.BookId,
                    Quantity = cartItem.Quantity,
                    BookTitle = cartItem.Book.Title
                }
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { 
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new {
                success = false,
                message = "An error occurred while adding book to cart"
            });
        }
    }
    
    [Authorize(Roles = "Regular")]
    [HttpDelete("remove-item/{bookId}")]
    public async Task<IActionResult> RemoveItemFromCart(Guid bookId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        var success = await _cartService.RemoveItemFromCartAsync(userId.Value, bookId);
        return success ? Ok(new { success = true }) : BadRequest(new { success = false });
    }
    
    [Authorize(Roles = "Regular")]
    [HttpPut("update-quantity/{bookId}/{newQuantity}")]
    public async Task<IActionResult> UpdateCartItemQuantity(Guid bookId, int newQuantity)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        try
        {
            var success = await _cartService.UpdateCartItemQuantityAsync(userId.Value, bookId, newQuantity);
            return success ? Ok(new { success = true }) : BadRequest(new { success = false });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    } 
    
    [Authorize(Roles = "Regular")]
    [HttpGet("cart-items")]
    public async Task<IActionResult> GetCartItems()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        var items = await _cartService.GetCartItemsAsync(userId.Value);
        return Ok(new { success = true, items });
    }
    
    
    [Authorize(Roles = "Regular")]
    [HttpPost("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        
        var success = await _cartService.ClearCartAsync(userId.Value);
        return success ? Ok(new { success = true }) : BadRequest(new { success = false });
    }
    
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}