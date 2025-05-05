using Backend.Entities;

namespace Backend.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(Guid orderId);
    }
}
