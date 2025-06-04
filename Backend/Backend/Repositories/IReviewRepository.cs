using Backend.Entities;

namespace Backend.Repositories;

public interface IReviewRepository
{
    Task<Review> AddReviewAsync(Review review);
    Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId);
    Task<bool> HasUserPurchasedBookAsync(Guid userId, Guid bookId);
    Task<List<Review>> GetReviewsByBookIdAsync(Guid bookId);
    Task<Review> GetReviewByIdAsync(Guid reviewId);
    Task<bool> UpdateReviewAsync(Review review);
    Task<bool> DeleteReviewAsync(Guid reviewId);
}