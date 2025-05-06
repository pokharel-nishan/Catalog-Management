using System.Linq.Expressions;
using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Backend.Repositories
{
    public class BookRepository : IBookRepository
    {
        private ApplicationDbContext _context;

        public BookRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddBookAsync(Book book)
        {
            try
            {
                _context.Books.Add(book);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookRepository.AddBookAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<List<Book>> GetAllBooksAsync()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<Book?> GetBookByIdAsync(Guid bookId)
        {
            return await _context.Books.FindAsync(bookId);
        }

        public async Task<bool> UpdateBookDetailsAsync(Book book)
        {
            _context.Books.Update(book);
            var result = await _context.SaveChangesAsync();

            return result > 0;
        }

        public async Task<bool> DeleteBookAsync(Guid bookId)
        {
            try
            {
                var book = await _context.Books.FirstOrDefaultAsync(x => x.BookId == bookId);

                if (book != null)
                {
                    _context.Books.Remove(book);
                    await _context.SaveChangesAsync();
                    return true;
                }
                Console.WriteLine("Error in BookRepository.DeleteBookAsync: Book does not exist!}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookRepository.DeleteBookAsync: {ex.Message}");
                return false;
            }
        }
        
        public async Task<(List<Book> books, int totalCount)> GetFilteredBooksAsync(
            int skip,
            int take,
            string? searchTerm = null,
            string? author = null,
            string? genre = null,
            string? publisher = null,
            string? language = null,
            string? format = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            bool? inStock = null,
            DateTime? publishedAfter = null,
            DateTime? publishedBefore = null,
            string? sortBy = null,
            bool sortDescending = false)
        {
            try
            {
                IQueryable<Book> query = _context.Books;

                // Apply search if provided (search by title, author, ISBN, or description)
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    query = query.Where(b => 
                        b.Title.ToLower().Contains(searchTerm) ||
                        b.Author.ToLower().Contains(searchTerm) ||
                        b.ISBN.ToLower().Contains(searchTerm) ||
                        (b.Description != null && b.Description.ToLower().Contains(searchTerm))
                    );
                }

                // Apply individual filters
                if (!string.IsNullOrWhiteSpace(author))
                    query = query.Where(b => b.Author.ToLower().Contains(author.ToLower()));

                if (!string.IsNullOrWhiteSpace(genre))
                    query = query.Where(b => b.Genre.ToLower().Contains(genre.ToLower()));

                if (!string.IsNullOrWhiteSpace(publisher))
                    query = query.Where(b => b.Publisher.ToLower().Contains(publisher.ToLower()));

                if (!string.IsNullOrWhiteSpace(language))
                    query = query.Where(b => b.Language.ToLower().Contains(language.ToLower()));

                if (!string.IsNullOrWhiteSpace(format))
                    query = query.Where(b => b.Format.ToLower().Contains(format.ToLower()));

                if (minPrice.HasValue)
                    query = query.Where(b => b.Price >= minPrice.Value);

                if (maxPrice.HasValue)
                    query = query.Where(b => b.Price <= maxPrice.Value);

                if (inStock.HasValue)
                    query = query.Where(b => (b.Stock > 0) == inStock.Value);

                if (publishedAfter.HasValue)
                    query = query.Where(b => b.PublicationDate >= publishedAfter.Value);

                if (publishedBefore.HasValue)
                    query = query.Where(b => b.PublicationDate <= publishedBefore.Value);

                // Calculate total count for pagination
                int totalCount = await query.CountAsync();

                // Apply sorting
                query = ApplySorting(query, sortBy, sortDescending);

                // Apply pagination
                var books = await query.Skip(skip).Take(take).ToListAsync();

                return (books, totalCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookRepository.GetFilteredBooksAsync: {ex.Message}");
                return (new List<Book>(), 0);
            }
        }

        private IQueryable<Book> ApplySorting(IQueryable<Book> query, string? sortBy, bool sortDescending)
        {
            // Default sorting is by title
            Expression<Func<Book, object>> keySelector;

            switch (sortBy?.ToLower())
            {
                case "author":
                    keySelector = b => b.Author;
                    break;
                case "price":
                    keySelector = b => b.Price;
                    break;
                case "date":
                case "publicationdate":
                    keySelector = b => b.PublicationDate;
                    break;
                case "title":
                default:
                    keySelector = b => b.Title;
                    break;
            }

            return sortDescending
                ? query.OrderByDescending(keySelector)
                : query.OrderBy(keySelector);
        }
    
    }
}
