using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services
{
    public interface IBookService
    {
        Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid adminId);
        Task<List<Book>> GetAllBooksAsync();
        Task<Book> GetBookByIdAsync(Guid bookId);
        Task<bool> UpdateBookDetailsAsync(Guid bookId, UpdateBookDTO updateBookDTO);
        Task<bool> DeleteBookAsync(Guid bookId);

    }
}
