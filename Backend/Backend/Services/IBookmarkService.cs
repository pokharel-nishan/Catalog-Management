using Backend.Entities;

namespace Backend.Services;

public interface IBookmarkService
{
    Task<bool> ToggleBookmarkAsync(Guid userId, Guid bookId);
    Task<IEnumerable<Book>> GetBookmarkedBooksAsync(Guid userId);

}