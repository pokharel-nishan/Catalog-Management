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
            .Include(r => r.User)
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
    
    public async Task<List<Review>> GetReviewsByBookIdAsync(Guid bookId)
{
    var reviews = await _context.Reviews
        .Include(r => r.User)
        .Where(r => r.BookId == bookId)
        .ToListAsync();

    // Applying manual bubble sort to sort by DateAdded in descending order
    for (int i = 0; i < reviews.Count - 1; i++)
    {
        for (int j = 0; j < reviews.Count - i - 1; j++)
        {
            if (reviews[j].DateAdded < reviews[j + 1].DateAdded)
            {
                var temp = reviews[j];
                reviews[j] = reviews[j + 1];
                reviews[j + 1] = temp;
            }
        }
    }

    return reviews;
}

    
    public async Task<Review> GetReviewByIdAsync(Guid reviewId)
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Book)
            .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
    }
    
    public async Task<bool> UpdateReviewAsync(Review review)
    {
        _context.Reviews.Update(review);
        return await _context.SaveChangesAsync() > 0;
    }
    
    public async Task<bool> DeleteReviewAsync(Guid reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null) return false;
        
        _context.Reviews.Remove(review);
        return await _context.SaveChangesAsync() > 0;
    }
}