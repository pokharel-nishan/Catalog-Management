using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc.Razor;
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

        public async Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid adminId)
        {
            try
            {
                Book book = new Book
                {
                    BookId = Guid.NewGuid(),
                    UserId = adminId,
                    ISBN = addBookDTO.ISBN,
                    Title = addBookDTO.Title,
                    Author = addBookDTO.Author,
                    Publisher = addBookDTO.Publisher,
                    PublicationDate = addBookDTO.PublicationDate,
                    Genre = addBookDTO.Genre,
                    Language = addBookDTO.Language,
                    Format = addBookDTO.Format,
                    Description = addBookDTO.Description,
                    Price = addBookDTO.Price,
                    Stock = addBookDTO.Stock,
                    Discount = addBookDTO.Discount,
                };
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
    }
}
