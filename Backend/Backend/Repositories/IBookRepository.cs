using Backend.DTOs.Admin.Book;
using Backend.Entities;

namespace Backend.Repositories
{
    public interface IBookRepository
    {
        public string AddBook(AddBookDTO addBookDTO);
        public List<Book> GetAllBooks();
        public Book GetBookByISBN(string ISBN);
        public bool UpdateBook(string ISBN, UpdateBookDTO updateBookDTO);
        public bool DeleteBook(string ISBN);
    }
}
