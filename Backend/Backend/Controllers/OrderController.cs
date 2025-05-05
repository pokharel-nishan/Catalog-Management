using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderController : ControllerBase
{
    private IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
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
}