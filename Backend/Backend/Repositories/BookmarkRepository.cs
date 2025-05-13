using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class BookmarkRepository: IBookmarkRepository
{
    private readonly ApplicationDbContext _context;

    public BookmarkRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Bookmark> GetUserBookmarkAsync(Guid userId)
    {
        return await _context.Bookmarks
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.UserId == userId);
    }

    public async Task<Bookmark> CreateBookmarkAsync(Bookmark bookmark)
    {
        await _context.Bookmarks.AddAsync(bookmark);
        await _context.SaveChangesAsync();
        return bookmark;
    }

    public async Task<bool> AddBookToBookmarkAsync(Guid bookmarkId, Guid bookId)
    {
        if (await _context.BookmarkBooks.AnyAsync(bb => bb.BookmarkId == bookmarkId && bb.BookId == bookId))
            return false;

        await _context.BookmarkBooks.AddAsync(new BookmarkBook
        {
            BookmarkId = bookmarkId,
            BookId = bookId
        });

        var bookmark = await _context.Bookmarks.FindAsync(bookmarkId);
        bookmark.TotalQuantity += 1;
        _context.Bookmarks.Update(bookmark);

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveBookFromBookmarkAsync(Guid bookmarkId, Guid bookId)
    {
        var bookmarkBook = await _context.BookmarkBooks
            .FirstOrDefaultAsync(bb => bb.BookmarkId == bookmarkId && bb.BookId == bookId);
        
        if (bookmarkBook == null) return false;

        _context.BookmarkBooks.Remove(bookmarkBook);

        var bookmark = await _context.Bookmarks.FindAsync(bookmarkId);
        bookmark.TotalQuantity -= 1;
        _context.Bookmarks.Update(bookmark);

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> IsBookBookmarkedAsync(Guid userId, Guid bookId)
    {
        return await _context.BookmarkBooks
            .AnyAsync(bb => bb.Bookmark.UserId == userId && bb.BookId == bookId);
    }
    
    public async Task<IEnumerable<Book>> GetBookmarkedBooksAsync(Guid userId)
    {
        return await _context.BookmarkBooks
            .Where(bb => bb.Bookmark.UserId == userId)
            .Include(bb => bb.Book)
            .Select(bb => bb.Book)
            .ToListAsync();
    }
}