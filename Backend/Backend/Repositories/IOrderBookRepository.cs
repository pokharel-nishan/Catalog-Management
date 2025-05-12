using Backend.Entities;

namespace Backend.Repositories
{
    public interface IOrderBookRepository
    {
        Task<List<OrderBook>> GetOrderBooksAsync(Guid orderId);
        Task AddOrderBookAsync(OrderBook orderBook);
    }
}
