﻿using Backend.DTOs.Admin.Book;
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
    private IUserService _userService;

    public OrderController(IOrderService orderService, IUserService userService)
    {
        _orderService = orderService;
        _userService = userService;
    }

    [Authorize(Roles = "Regular")]
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

    [Authorize(Roles = "Regular")]
    [HttpPost("confirm-order/{orderId}")]
    public async Task<IActionResult> ConfirmOrder(Guid orderId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _orderService.ConfirmOrderAsync(orderId, userId.Value);
        return success 
            ? Ok(new { success = true, message = "Order confirmed" })
            : BadRequest(new { success = false, message = "Order confirmation failed" });
    }
    
    [Authorize(Roles = "Staff")]
    [HttpPost("complete-order/{orderId}")]
    public async Task<IActionResult> CompleteOrder(Guid orderId, [FromBody] CompleteOrderRequest request)
    {
        var success = await _orderService.CompleteOrderAsync(orderId, request.ClaimCode);
        return success 
            ? Ok(new { success = true, message = "Order completed" })
            : BadRequest(new { success = false, message = "Invalid claim code or order state" });
    }
    
    [Authorize(Roles = "Regular")]
    [HttpPost("cancel-order/{orderId}")]
    public async Task<IActionResult> CancelOrder(Guid orderId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _orderService.CancelOrderAsync(orderId, userId.Value);
        return success 
            ? Ok(new { success = true, message = "Order cancelled" })
            : BadRequest(new { success = false, message = "Order cancellation failed" });
    }
    
    [Authorize(Roles = "Admin, Staff, Regular")]
    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderDetails(Guid orderId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var userDetails = await _userService.GetUserDetailsByIdAsync(userId.Value);
        
        var order = await _orderService.GetOrderDetailsAsync(orderId);
        if (order == null) return NotFound();

        if (userDetails.Roles[0] != "Admin" && userDetails.Roles[0] != "Staff" && order.UserId != userId.Value)
        {
            return StatusCode(403, new { 
                success = false, 
                message = "You don't have permission to view this order",
                requiredRoles = new[] { "Admin", "Staff" },
                isOwner = order.UserId == userId.Value,
            });
        }

        return Ok(new { success = true, order });
    }
    
    [Authorize(Roles = "Admin, Staff, Regular")]
    [HttpGet("user-orders")]
    public async Task<IActionResult> GetUserOrders()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var orders = await _orderService.GetUserOrdersAsync(userId.Value);
        return Ok(new { success = true, orders });
    }
    
    [Authorize(Roles = "Admin, Staff")]
    [HttpGet("admin/all-orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(new { success = true, orders });
    }
    
    [Authorize(Roles = "Admin, Staff")]
    [HttpGet("admin/orders-by-status/{status}")]
    public async Task<IActionResult> GetOrdersByStatus(OrderStatus status)
    {
        var orders = await _orderService.GetOrdersByStatusAsync(status);
        return Ok(new { success = true, orders });
    }
    
    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                          User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
    public record CompleteOrderRequest(string ClaimCode);

}