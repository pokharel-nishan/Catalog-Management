using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.DTOs.User;
using Backend.Services;
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
    
    [HttpPost("add-to-cart/{bookId}")]
    public async Task<IActionResult> AddTToCart(Guid bookId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
    
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized("Invalid user identification");
        }
        
        try
        {
            var cartItem = await _cartService.AddBookToCartAsync(userId, bookId);
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
    
    [HttpDelete("remove-from-cart/{cartId}")]
    public async Task<IActionResult> RemoveProdutFromCart(Guid cartId)
    {
        return Ok("Success");
    }  
    
    [HttpPut("update-to-cart/{cartId}")]
    public async Task<IActionResult> UpdateCartItems(Guid cartId)
    {
        return Ok("Success");
    } 
    
    [HttpGet("cart-items/{cartId}")]
    public async Task<IActionResult> CartItems(Guid cartId)
    {
        return Ok("Success");
    } 
}