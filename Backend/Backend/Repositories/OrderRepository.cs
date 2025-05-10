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
        
        public async Task<Order> CreateOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }
        
        public async Task<bool> UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
