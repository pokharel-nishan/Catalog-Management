using Backend.Entities;
using System.Net;

namespace Backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private ApplicationDbContext _context;
        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Order> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders.FindAsync(orderId);
        }
    }
}
