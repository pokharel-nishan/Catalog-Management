using Backend.DTOs.User;
using Backend.Entities;

namespace Backend.Services;

public interface IReviewService
{
    Task<Review> AddReviewAsync(Guid userId, Guid bookId, string content, int rating);
    Task<IEnumerable<ReviewDTO>> GetReviewsByBookIdAsync(Guid bookId);
    Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId);

}