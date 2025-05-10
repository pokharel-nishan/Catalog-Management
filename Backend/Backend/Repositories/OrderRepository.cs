using Backend.Entities;
using System.Net;
using Microsoft.EntityFrameworkCore;

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
        
        public async Task<Order> GetOrderWithDetailsAsync(Guid orderId)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Cart)
                .Include(o => o.OrderBooks)
                .ThenInclude(ob => ob.Book)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }
        
        public async Task<IEnumerable<Order>> GetUserOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderBooks)
                .ThenInclude(ob => ob.Book)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
}
