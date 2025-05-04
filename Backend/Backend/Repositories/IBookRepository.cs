using Backend.DTOs.Admin.Book;
using Backend.Entities;

namespace Backend.Repositories
{
    public interface IBookRepository
    {
        // Create
        public Task<bool> AddBookAsync(AddBookDTO addBookDTO, Guid adminId);

        // Read
        //public List<Book> GetAllBooks();
        //public Book GetBookByISBN(string ISBN);

        //// Update
        //public bool UpdateBook(string ISBN, UpdateBookDTO updateBookDTO);

        //// Delete
        //public bool DeleteBook(string ISBN);
    }
}
