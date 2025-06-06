using Backend.DTOs.User;
using Backend.Entities;

namespace Backend.Services;

public interface IReviewService
{
    Task<ReviewDTO> GetReviewById(Guid userId, Guid reviewId);
    Task<Review> AddReviewAsync(Guid userId, Guid bookId, string content, int rating);
    Task<IEnumerable<ReviewDTO>> GetReviewsByBookIdAsync(Guid bookId);
    Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId);
    Task<bool> UpdateReviewAsync(Guid userId, Guid reviewId, string content, int rating);
    Task<bool> DeleteReviewAsync(Guid userId, Guid reviewId);


}