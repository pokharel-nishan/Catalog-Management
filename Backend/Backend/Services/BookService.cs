﻿using Backend.DTOs.Admin.Book;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public class BookService : IBookService
    {
        private IBookRepository _bookRepository;
        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        private bool IsDiscountActive(Book book)
        {
            var now = DateTime.UtcNow;
            return book.Discount > 0 && 
                   (book.DiscountStartDate == null || book.DiscountStartDate <= now) && 
                   (book.DiscountEndDate == null || book.DiscountEndDate >= now);
        }
        
        // method to get available discount (0 if not active)
        private decimal GetEffectiveDiscount(Book book)
        {
            return IsDiscountActive(book) ? book.Discount : 0;
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
                    ImageURL = addBookDTO.ImageUrl,
                    Description = addBookDTO.Description,
                    Price = addBookDTO.Price,
                    Stock = addBookDTO.Stock,
                    Discount = addBookDTO.Discount,
                    DiscountStartDate =addBookDTO.DiscountStartDate,
                    DiscountEndDate =addBookDTO.DiscountEndDate,
                    ArrivalDate = addBookDTO.ArrivalDate
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
            if (updateBookDTO.DiscountStartDate.HasValue) book.DiscountStartDate = updateBookDTO.DiscountStartDate.Value;
            if (updateBookDTO.DiscountEndDate.HasValue) book.DiscountEndDate = updateBookDTO.DiscountEndDate.Value;
            if (updateBookDTO.ArrivalDate.HasValue) book.ArrivalDate = updateBookDTO.ArrivalDate.Value;

            return await _bookRepository.UpdateBookDetailsAsync(book);

        }

        public async Task<bool> DeleteBookAsync(Guid bookId)
        {
            return await _bookRepository.DeleteBookAsync(bookId);
        }

        public async Task<PaginatedResponseDTO<BookSummaryDTO>> GetPaginatedBooksAsync(
            BookPaginationQueryDTO pagination,
            BookFilterDTO filters)
        {
            try
            {
                // Calculate the number of items to skip
                int skip = (pagination.PageNumber - 1) * pagination.PageSize;

                // Get filtered books from repository
                var (books, totalCount) = await _bookRepository.GetFilteredBooksAsync(
                    skip,
                    pagination.PageSize,
                    filters.SearchTerm,
                    filters.Author,
                    filters.Genre,
                    filters.Publisher,
                    filters.Language,
                    filters.Format,
                    filters.MinPrice,
                    filters.MaxPrice,
                    filters.InStock,
                    filters.PublishedAfter,
                    filters.PublishedBefore,
                    filters.SortBy,
                    filters.SortDescending
                );

                var bookSummaries = books.Select(book => new BookSummaryDTO
                {
                    BookId = book.BookId,
                    Title = book.Title,
                    Author = book.Author,
                    Genre = book.Genre,
                    Price = book.Price,
                    Discount = GetEffectiveDiscount(book),
                    IsOnSale = IsDiscountActive(book),
                    InStock = book.Stock > 0,
                    ImageURL = book.ImageURL,
                    Description = book.Description,
                }).ToList();

                // Calculate total pages
                int totalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize);

                // Create and return the paginated response
                return new PaginatedResponseDTO<BookSummaryDTO>
                {
                    Items = bookSummaries,
                    PageNumber = pagination.PageNumber,
                    PageSize = pagination.PageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookService.GetPaginatedBooksAsync: {ex.Message}");
                return new PaginatedResponseDTO<BookSummaryDTO>();
            }
        }

        public async Task<BookDetailDTO> GetBookDetailsByIdAsync(Guid bookId)
        {
            try
            {
                var book = await _bookRepository.GetBookByIdAsync(bookId);

                if (book == null)
                {
                    return null;
                }

                return new BookDetailDTO
                {
                    BookId = book.BookId,
                    ISBN = book.ISBN,
                    Title = book.Title,
                    Author = book.Author,
                    Publisher = book.Publisher,
                    PublicationDate = book.PublicationDate,
                    Genre = book.Genre,
                    Language = book.Language,
                    Format = book.Format,
                    Description = book.Description,
                    Price = book.Price,
                    Discount = GetEffectiveDiscount(book),
                    IsOnSale = IsDiscountActive(book),
                    Stock = book.Stock,
                    ImageURL = book.ImageURL,
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookService.GetBookDetailsByIdAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<BookFilterDetailsDto> GetBookFilterDetailsAsync()
        {
            var allBooks = await _bookRepository.GetAllBooksAsync();

            var filterOptions = new BookFilterDetailsDto
            {
                Genres = allBooks.Select(b => b.Genre).Distinct().OrderBy(g => g).ToList(),
                Authors = allBooks.Select(b => b.Author).Distinct().OrderBy(a => a).ToList(),
                Publishers = allBooks.Select(b => b.Publisher).Distinct().OrderBy(p => p).ToList(),
                Languages = allBooks.Select(b => b.Language).Distinct().OrderBy(l => l).ToList(),
                Formats = allBooks.Select(b => b.Format).Distinct().OrderBy(f => f).ToList(),
                PriceRange = new PriceRangeDto
                {
                    Min = allBooks.Any() ? allBooks.Min(b => b.Price) : 0,
                    Max = allBooks.Any() ? allBooks.Max(b => b.Price) : 0
                }
            };

            return filterOptions;
        }
        
        public async Task<FeaturedBooksDTO> GetFeaturedBooksAsync()
        {
            var threeMonthsAgo = DateTime.UtcNow.AddMonths(-3);
            var threeMonthsFromNow = DateTime.UtcNow.AddMonths(3);
            var now = DateTime.UtcNow;

            // Get all books and sales data
            var allBooks = await _bookRepository.GetAllBooksAsync();
            var salesCounts = await _bookRepository.GetBookSalesCountsAsync();

            var response = new FeaturedBooksDTO();

            // New Arrivals (added to system in last 3 months)
            response.NewArrivals = allBooks
                .Where(b => b.ArrivalDate.HasValue && b.ArrivalDate.Value >= threeMonthsAgo)
                .OrderByDescending(b => b.ArrivalDate)
                .Take(6)
                .Select(b => MapToBookCategoryDTO(b, now))
                .ToList();

            // New Releases (published in last 3 months)
            response.NewReleases = allBooks
                .Where(b => b.PublicationDate >= threeMonthsAgo)
                .OrderByDescending(b => b.PublicationDate)
                .Take(6)
                .Select(b => MapToBookCategoryDTO(b, now))
                .ToList();

            // Top Sales (currently discounted)
            response.TopSales = allBooks
                .Where(b => b.Discount > 0 && (b.DiscountEndDate == null || b.DiscountEndDate >= now))
                .OrderByDescending(b => b.Discount)
                .Take(6)
                .Select(b => MapToBookCategoryDTO(b, now))
                .ToList();

            // Best Sellers
            response.BestSellers = allBooks
                .Where(b => salesCounts.ContainsKey(b.BookId)) // Only books with sales
                .OrderByDescending(b => salesCounts[b.BookId]) // Sort by sales (highest first)
                .Take(6) // Take top 6
                .Select(b => MapToBookCategoryDTO(b, now))
                .ToList();

            // Coming Soon (arrival in next 3 months)
            response.ComingSoon = allBooks
                .Where(b => b.ArrivalDate.HasValue && b.ArrivalDate.Value > now && b.ArrivalDate.Value <= threeMonthsFromNow)
                .OrderBy(b => b.ArrivalDate)
                .Take(6)
                .Select(b => MapToBookCategoryDTO(b, now))
                .ToList();

            return response;
        }

        private BookCategoryDTO MapToBookCategoryDTO(Book book, DateTime now)
        {
            return new BookCategoryDTO
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                Genre = book.Genre,
                Price = book.Price,
                Discount = book.Discount > 0 && 
                         (book.DiscountStartDate == null || book.DiscountStartDate <= now) && 
                         (book.DiscountEndDate == null || book.DiscountEndDate >= now)
                         ? book.Discount : 0,
                ImageURL = book.ImageURL,
                InStock = book.Stock > 0,
                OnSaleUntil = book.DiscountEndDate
            };
        }
    }
}
