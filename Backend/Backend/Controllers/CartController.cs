using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController: ControllerBase
{
    [HttpPost("add-to-cart")]
    public async Task<IActionResult> AddProductToCart(Guid productId)
    {
        return Ok("Success");
    }   
    
    [HttpDelete("remove-from-cart")]
    public async Task<IActionResult> RemoveProdutFromCart(Guid ProductId)
    {
        return Ok("Success");
    }  
    
    [HttpPut("update-to-cart")]
    public async Task<IActionResult> UpdateCartItems(Guid ProductId)
    {
        return Ok("Success");
    } 
    
    [HttpGet("cart-items")]
    public async Task<IActionResult> CartItems(Guid cartId)
    {
        return Ok("Success");
    } 
}