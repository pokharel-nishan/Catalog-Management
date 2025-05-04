using Backend.DTOs.Admin.Book;
using Backend.Repositories;

namespace Backend.Services
{
    public interface IBookService
    {
        public Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid userId);

    }
}
