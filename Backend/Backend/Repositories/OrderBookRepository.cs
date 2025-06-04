using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class OrderBookRepository : IOrderBookRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderBookRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderBook>> GetOrderBooksAsync(Guid orderId)
        {
            var orderBooks = await _context.OrderBooks
                .Where(oi  => oi.OrderId == orderId)
                .Include(oi => oi.Book)
                .ToListAsync();

            return orderBooks;
        }

        public async Task AddOrderBookAsync(OrderBook orderBook)
        {
            await _context.OrderBooks.AddAsync(orderBook);
            await _context.SaveChangesAsync();
        }
    }
}
