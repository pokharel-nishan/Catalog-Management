using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ReviewRepository: IReviewRepository
{
    private readonly ApplicationDbContext _context;

    public ReviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Review> AddReviewAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId)
    {
        return await _context.Reviews
            .Include(r => r.Book)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.DateAdded)
            .ToListAsync();
    }
    
    public async Task<bool> HasUserPurchasedBookAsync(Guid userId, Guid bookId)
    {
        return await _context.OrderBooks
            .Include(ob => ob.Order)
            .AnyAsync(ob => 
                ob.BookId == bookId && 
                ob.Order.UserId == userId && 
                ob.Order.Status == OrderStatus.Completed);
    }
}