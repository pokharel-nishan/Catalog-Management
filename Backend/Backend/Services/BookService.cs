using Backend.DTOs.Admin.Book;
using Backend.Repositories;

namespace Backend.Services
{
    public class BookService : IBookService
    {
        private IBookRepository _bookRepository;
        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid adminId)
        {
            try
            {
                return await _bookRepository.AddBookAsync(addBookDTO, adminId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookService.AddBookAsync: {ex.Message}");
                return false;
            }
        }
    }
}
