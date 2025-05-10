using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var order = await _orderService.CreateOrderFromCartAsync(userId.Value);
        if (order == null)
            return BadRequest(new { success = false, message = "Cannot checkout with empty cart" });

        return Ok(new { 
            success = true, 
            message = "Order created and pending confirmation",
            orderId = order.OrderId
        });
    }


    [HttpPost("processClaimCode/{orderId}")]
    //[Authorize(Roles = "Staff")]
    public async Task<IActionResult> ProcessClaimCodeAsync(Guid orderId, string claimCode)
    {
        var isClaimCodeValid = await _orderService.ProcessClaimCodeAsync(orderId, claimCode);

        if (!isClaimCodeValid)
        {
            return Ok($"Success: Order {orderId} processed successfully!");
        }
        return BadRequest($"Error: Invalid claim code for order {orderId}!");
    }
    
    [HttpPost("confirm-order/{orderId}")]
    public async Task<IActionResult> AddProductToCart(Guid orderId)
    {
        return Ok("Success");
    }   
    
    [HttpDelete("cancel-order/{orderId}")]
    public async Task<IActionResult> RemoveProdutFromCart(Guid orderId)
    {
        return Ok("Success");
    }  
    
    
    [HttpGet("order-items/{orderId}")]
    public async Task<IActionResult> CartItems(Guid orderId)
    {
        return Ok("Success");
    }
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}