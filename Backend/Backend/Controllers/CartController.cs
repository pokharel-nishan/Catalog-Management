using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController: ControllerBase
{
    [HttpPost("add-to-cart/{cartId}")]
    public async Task<IActionResult> AddProductToCart(Guid cartId, Guid productId)
    {
        return Ok("Success");
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