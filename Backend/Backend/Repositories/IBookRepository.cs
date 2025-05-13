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
        
        Task<List<Book>> GetBooksByOrderIdAsync(Guid orderId);

        // Update
        public Task<bool> UpdateBookDetailsAsync(Book book);

        // Delete
        public Task<bool> DeleteBookAsync (Guid bookId);
        
        
        Task<(List<Book> books, int totalCount)> GetFilteredBooksAsync(
            int skip,
            int take, 
            string? searchTerm,
            string? author = null,
            string? genre = null,
            string? publisher = null,
            string? language = null,
            string? format = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            bool? inStock = null,
            DateTime? publishedAfter = null,
            DateTime? publishedBefore = null,
            string? sortBy = null,
            bool sortDescending = false);
    }
}
