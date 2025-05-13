
using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Notifications;
using Microsoft.AspNetCore.SignalR;
namespace Backend.Services;

public class OrderNotificationService: IOrderNotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IOrderRepository _orderRepository;
    private readonly IBookRepository _bookRepository;
    private readonly IUserRepository _userRepository;

    public OrderNotificationService(
        IHubContext<NotificationHub> hubContext,
        IOrderRepository orderRepository,
        IBookRepository bookRepository,
        IUserRepository userRepository)
    {
        _hubContext = hubContext;
        _orderRepository = orderRepository;
        _bookRepository = bookRepository;
        _userRepository = userRepository;
    }
    
    public async Task NotifyOrderCompletion(Guid orderId)
    {
        try
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId == Guid.Empty)
            {
                return;
            }

            var user = await _userRepository.GetUserByIdAsync(order.UserId);
            if (user == null)
            {
                return;
            }

            var books = await _bookRepository.GetBooksByOrderIdAsync(orderId);
            if (books == null || !books.Any())
            {
                return;
            }

            await _hubContext.Clients.Group($"user-{order.UserId}").SendAsync("ReceiveOrderCompletion", 
                new {
                    orderId = order.OrderId,
                    userName = user.UserName,
                    bookTitles = books.Select(b => b.Title).ToList(),
                    completionDate = DateTime.UtcNow,
                    totalPrice = order.TotalPrice
                });
        }
        catch (Exception ex)
        {
            Console.WriteLine( $"{ex} Error notifying order completion for order {orderId}" );
        }
    }

}