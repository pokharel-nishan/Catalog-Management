using Backend.DTOs.Admin.Book;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services
{
    public interface IBookService
    {
        
        // Admin Features
        Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid adminId);
        Task<List<Book>> GetAllBooksAsync();
        Task<Book> GetBookByIdAsync(Guid bookId);
        Task<bool> UpdateBookDetailsAsync(Guid bookId, UpdateBookDTO updateBookDTO);
        Task<bool> DeleteBookAsync(Guid bookId);
        
        // User Features
        Task<PaginatedResponseDTO<BookSummaryDTO>> GetPaginatedBooksAsync(
            BookPaginationQueryDTO pagination, 
            BookFilterDTO filters);
        Task<BookDetailDTO> GetBookDetailsByIdAsync(Guid bookId);

        Task<BookFilterDetailsDto> GetBookFilterDetailsAsync();
        Task<FeaturedBooksDTO> GetFeaturedBooksAsync();
    }
}
