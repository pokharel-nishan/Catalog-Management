using Backend.DTOs.Admin.Book;
using Backend.Entities;

namespace Backend.Repositories
{
    public interface IBookRepository
    {
        // Create
        public Task<bool> AddBookAsync(Book book);

        // Read
        public Task<List<Book>> GetAllBooksAsync();
        public Task<Book> GetBookByIdAsync(Guid bookId);

        // Update
        public Task<bool> UpdateBookDetailsAsync(Book book);

        // Delete
        public Task<bool> DeleteBookAsync (Guid bookId);
    }
}
