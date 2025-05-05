using Backend.DTOs.Admin.Book;
using Backend.Entities;
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

                return await _bookRepository.AddBookAsync(book);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookService.AddBookAsync: {ex.Message}");
                return false;
            }
        }


        public async Task<List<Book>> GetAllBooksAsync()
        {
            return await _bookRepository.GetAllBooksAsync();
        }

        public async Task<Book> GetBookByIdAsync(Guid bookId)
        {
            return await _bookRepository.GetBookByIdAsync(bookId);
        }

        public async Task<bool> UpdateBookDetailsAsync(Guid bookId, UpdateBookDTO updateBookDTO)
        {
            var book = await _bookRepository.GetBookByIdAsync(bookId);
            if (book == null)
            {
                return false;
            }

            if (updateBookDTO.ISBN != null) book.ISBN = updateBookDTO.ISBN;
            if (updateBookDTO.Title != null) book.Title = updateBookDTO.Title;
            if (updateBookDTO.Author != null) book.Author = updateBookDTO.Author;
            if (updateBookDTO.Publisher != null) book.Publisher = updateBookDTO.Publisher;
            if (updateBookDTO.PublicationDate.HasValue) book.PublicationDate = updateBookDTO.PublicationDate.Value;
            if (updateBookDTO.Genre != null) book.Genre = updateBookDTO.Genre;
            if (updateBookDTO.Language != null) book.Language = updateBookDTO.Language;
            if (updateBookDTO.Format != null) book.Format = updateBookDTO.Format;
            if (updateBookDTO.Description != null) book.Description = updateBookDTO.Description;
            if (updateBookDTO.Price.HasValue) book.Price = updateBookDTO.Price.Value;
            if (updateBookDTO.Stock.HasValue) book.Stock = updateBookDTO.Stock.Value;
            if (updateBookDTO.Discount.HasValue) book.Discount = updateBookDTO.Discount.Value;

            return await _bookRepository.UpdateBookDetailsAsync(book);

        }

        public async Task<bool> DeleteBookAsync(Guid bookId)
        {
            return await _bookRepository.DeleteBookAsync(bookId);
        }
    }
}
