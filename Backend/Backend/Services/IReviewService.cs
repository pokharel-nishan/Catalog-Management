using Backend.Entities;

namespace Backend.Services;

public interface IReviewService
{
    Task<Review> AddReviewAsync(Guid userId, Guid bookId, string content, int rating);

}