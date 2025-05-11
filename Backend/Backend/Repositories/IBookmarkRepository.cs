using Backend.Entities;

namespace Backend.Repositories;

public interface IBookmarkRepository
{
    Task<Bookmark> GetUserBookmarkAsync(Guid userId);
    Task<Bookmark> CreateBookmarkAsync(Bookmark bookmark);
    Task<bool> AddBookToBookmarkAsync(Guid bookmarkId, Guid bookId);
    Task<bool> RemoveBookFromBookmarkAsync(Guid bookmarkId, Guid bookId);
    Task<bool> IsBookBookmarkedAsync(Guid userId, Guid bookId);
}