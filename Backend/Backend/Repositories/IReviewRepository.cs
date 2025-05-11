using Backend.Entities;

namespace Backend.Repositories;

public interface IReviewRepository
{
    Task<Review> AddReviewAsync(Review review);
    Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId);
    Task<bool> HasUserPurchasedBookAsync(Guid userId, Guid bookId);
    Task<IEnumerable<Review>> GetReviewsByBookIdAsync(Guid bookId);

}