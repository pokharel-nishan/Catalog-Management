using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class ReviewService: IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookRepository _bookRepository;
    public ReviewService(IReviewRepository reviewRepository, IBookRepository bookRepository)
    {
        _reviewRepository = reviewRepository;
        _bookRepository = bookRepository;
    }

    public async Task<ReviewDTO> GetReviewById(Guid userId, Guid reviewId)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(reviewId);
        if (review.UserId != userId) return null;

        return new ReviewDTO()
        {
            ReviewId = review.ReviewId,
            Username = review.User.FirstName,
            CreatedAt = review.DateAdded,
            Content = review.Content,
            Rating = review.Rating,
        };
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
    
    public async Task<IEnumerable<ReviewDTO>> GetReviewsByBookIdAsync(Guid bookId)
    {
        var existingBooks = await _bookRepository.GetBookByIdAsync(bookId);
        if (existingBooks == null)
            throw new KeyNotFoundException("Book not found");
        
       var reviews = await _reviewRepository.GetReviewsByBookIdAsync(bookId);

       return reviews.Select(x => new ReviewDTO()
       {
           ReviewId = x.ReviewId,
           Content = x.Content,
           Rating = x.Rating,
           Username = x.User.FirstName,
           CreatedAt = x.DateAdded
       });
    }
    
    public async Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId)
    {
        var reviews = await _reviewRepository.GetReviewsByUserIdAsync(userId);

        return reviews.Select(x => new ReviewDTO()
        {
            ReviewId = x.ReviewId,
            Content = x.Content,
            Rating = x.Rating,
            Username = x.User.FirstName,
            CreatedAt = x.DateAdded
        });
    }
    
    public async Task<bool> UpdateReviewAsync(Guid userId, Guid reviewId, string content, int rating)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(reviewId);
        if (review == null) return false;
        if (review.UserId != userId) return false;

        review.Content = content;
        review.Rating = rating;
        return await _reviewRepository.UpdateReviewAsync(review);
    }
    
    public async Task<bool> DeleteReviewAsync(Guid userId, Guid reviewId)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(reviewId);
        if (review == null) return false;
        if (review.UserId != userId) return false;

        return await _reviewRepository.DeleteReviewAsync(reviewId);
    }
}