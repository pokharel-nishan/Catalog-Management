using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class BookmarkService: IBookmarkService
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IBookRepository _bookRepository;

    public BookmarkService(IBookmarkRepository bookmarkRepository, IBookRepository bookRepository)
    {
        _bookmarkRepository = bookmarkRepository;
        _bookRepository = bookRepository;
    }

    public async Task<bool> ToggleBookmarkAsync(Guid userId, Guid bookId)
    {
        if (await _bookRepository.GetBookByIdAsync(bookId) == null)
            return false;

        // Get and create user's bookmark
        var bookmark = await _bookmarkRepository.GetUserBookmarkAsync(userId);
        if (bookmark == null)
        {
            bookmark = new Bookmark()
            {
                UserId = userId,
                TotalQuantity = 0
            };
            await _bookmarkRepository.CreateBookmarkAsync(bookmark);
        }

        // change bookmark status
        var isBookmarked = await _bookmarkRepository.IsBookBookmarkedAsync(userId, bookId);
        if (isBookmarked)
        {
            return await _bookmarkRepository.RemoveBookFromBookmarkAsync(bookmark.BookmarkId, bookId);
        }
        
        return await _bookmarkRepository.AddBookToBookmarkAsync(bookmark.BookmarkId, bookId);
    }
}