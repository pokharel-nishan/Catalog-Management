using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Notifications;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Services;

public class OrderNotificationService : IOrderNotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IOrderRepository _orderRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<OrderNotificationService> _logger;

    public OrderNotificationService(
        IHubContext<NotificationHub> hubContext,
        IOrderRepository orderRepository,
        IBookRepository bookRepository,
        IUserRepository userRepository,
        ILogger<OrderNotificationService> logger)
    {
        _hubContext = hubContext;
        _orderRepository = orderRepository;
        _bookRepository = bookRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task NotifyOrderCompletion(Guid orderId)
    {
        try
        {
            _logger.LogInformation("Notifying order completion for order {OrderId}", orderId);
            
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId == Guid.Empty)
            {
                _logger.LogWarning("Cannot notify: Order {OrderId} not found or has no user", orderId);
                return;
            }

            var user = await _userRepository.GetUserByIdAsync(order.UserId);
            if (user == null)
            {
                _logger.LogWarning("Cannot notify: User not found for order {OrderId}", orderId);
                return;
            }

            var books = await _bookRepository.GetBooksByOrderIdAsync(orderId);
            if (books == null || !books.Any())
            {
                _logger.LogWarning("Cannot notify: No books found for order {OrderId}", orderId);
                return;
            }

            var groupName = $"user-{order.UserId}";
            _logger.LogInformation("Sending notification to group {GroupName}", groupName);

            var notification = new
            {
                orderId = order.OrderId.ToString(),
                userName = user.UserName,
                userId = user.Id,
                bookTitles = books.Select(b => b.Title).ToList(),
                completionDate = DateTime.UtcNow.ToString("o"),
                totalPrice = order.TotalPrice
            };

            await _hubContext.Clients.Group(groupName).SendAsync("ReceiveOrderCompletion", notification);
            _logger.LogInformation("Notification sent successfully to user {UserId} for order {OrderId}", user.Id, orderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying order completion for order {OrderId}", orderId);
        }
    }
}