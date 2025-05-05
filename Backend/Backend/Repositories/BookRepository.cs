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
    }
}
