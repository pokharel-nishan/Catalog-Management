using Backend.DTOs.Common;
using Backend.Entities;

namespace Backend.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(Guid orderId);
        Task<Order> CreateOrderAsync(Order order);
        Task<bool> UpdateOrderAsync(Order order);
        Task<Order> GetOrderWithDetailsAsync(Guid orderId);
        Task<IEnumerable<Order>> GetUserOrdersAsync(Guid userId);
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
    }
}
