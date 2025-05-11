using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class ReviewService: IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<Review> AddReviewAsync(Guid userId, Guid bookId, string content, int rating)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentException("Rating must be between 1 and 5");

        // Check if user has purchased the book
        if (!await _reviewRepository.HasUserPurchasedBookAsync(userId, bookId))
            throw new UnauthorizedAccessException("You must purchase the book before reviewing");

        // Check if user already reviewed this book
        var existingReview = (await _reviewRepository.GetReviewsByUserIdAsync(userId))
            .FirstOrDefault(r => r.BookId == bookId);
        
        if (existingReview != null)
            throw new InvalidOperationException("You have already reviewed this book");

        var review = new Review
        {
            UserId = userId,
            BookId = bookId,
            Content = content,
            Rating = rating,
            DateAdded = DateTime.UtcNow
        };

        return await _reviewRepository.AddReviewAsync(review);
    }
}