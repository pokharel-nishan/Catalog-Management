using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.DTOs.User;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private IBookService _bookService;
    private IUserService _userService;

    public BookController(IBookService bookService, IUserService userService)
    {
        _bookService = bookService;
        _userService = userService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("addBook")]
    public async Task<IActionResult> AddBookAsync([FromForm] AddBookDTO addBookFormDTO, [FromForm] IFormFile imageFile)
    {
        var adminId = await _userService.GetAdminIdAsync();

        // Save file to local folder
        string imagePath = null;
        if (imageFile != null && imageFile.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
            Directory.CreateDirectory(uploadsFolder);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            imagePath = "/UploadedFiles/" + fileName; // Store relative path
        }

        // Map to original AddBookDTO
        var addBookDTO = new AddBookDTO
        {
            ISBN = addBookFormDTO.ISBN,
            Title = addBookFormDTO.Title,
            Author = addBookFormDTO.Author,
            Publisher = addBookFormDTO.Publisher,
            PublicationDate = addBookFormDTO.PublicationDate,
            Genre = addBookFormDTO.Genre,
            Language = addBookFormDTO.Language,
            Format = addBookFormDTO.Format,
            Description = addBookFormDTO.Description,
            Price = addBookFormDTO.Price,
            Stock = addBookFormDTO.Stock,
            Discount = addBookFormDTO.Discount,
            DiscountStartDate = addBookFormDTO.DiscountStartDate,
            DiscountEndDate = addBookFormDTO.DiscountEndDate,
            ArrivalDate = addBookFormDTO.ArrivalDate,
            ImageUrl = imagePath
        };

        bool isBookAdded = await _bookService.AddBookAsync(addBookDTO, adminId);
        if (isBookAdded)
        {
            return Ok($"Success: Book '{addBookDTO.Title}' (ISBN: {addBookDTO.ISBN}) added successfully!");
        }
        return BadRequest($"Error: Book '{addBookDTO.Title}' (ISBN: {addBookDTO.ISBN}) could not be added.");
    }


    [HttpGet("getAllBooks")]
    public async Task<List<Book>> GetAllBooksAsync()
    {
        return await _bookService.GetAllBooksAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("updateBookDetails/{bookId}")]
    public async Task<IActionResult> UpdateBookDetailsAsync(Guid bookId, UpdateBookDTO updateBookDTO)
    {
        bool isBookUpdated = await _bookService.UpdateBookDetailsAsync(bookId, updateBookDTO);

        if (isBookUpdated)
        {
            return Ok($"Success: Book '{updateBookDTO.Title}' (ISBN: {updateBookDTO.ISBN}) updated successfully!");
        }
        else
        {
            return BadRequest($"Error: Book '{updateBookDTO.Title}' (ISBN: {updateBookDTO.ISBN}) could not be updated.");
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("deleteBook/{bookId}")]
    public async Task<IActionResult> DeleteBookAsync(Guid bookId)
    {
        bool isBookDeleted = await _bookService.DeleteBookAsync(bookId);

        if (isBookDeleted)
        {
            return Ok($"Success: Book deleted successfully!");
        }
        else
        {
            return BadRequest($"Error: Book could not be deleted.");
        }
    }
    
    /// Browse paginated book with optional filters and sorting
    [HttpGet]
    public async Task<ActionResult<PaginatedResponseDTO<BookSummaryDTO>>> GetBooks(
        [FromQuery] BookPaginationQueryDTO pagination,
        [FromQuery] BookFilterDTO filters)
    {
        try
        {
            // validate pagination
            if (pagination.PageNumber < 1) pagination.PageNumber = 1;
            if (pagination.PageSize < 1) pagination.PageSize = 10; // minimum page size
            if (pagination.PageSize > 50) pagination.PageSize = 50; // maximum page size

            var result = await _bookService.GetPaginatedBooksAsync(pagination, filters);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving books: {ex.Message}");
        }
    }

    /// Get detailed information for a specific book
    [HttpGet("{bookId}")]
    public async Task<ActionResult<BookDetailDTO>> GetBookById(Guid bookId)
    {
        try
        {
            var book = await _bookService.GetBookDetailsByIdAsync(bookId);
            
            if (book == null)
            {
                return NotFound($"Book with ID {bookId} not found");
            }

            return Ok(book);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving the book: {ex.Message}");
        }
    }
    
    /// Get a list of available filters for books (genres, languages, formats, etc.)
    [HttpGet("filters")]
    public async Task<ActionResult> GetBookFilters()
    {
        try
        {
            var filterOptions = await _bookService.GetBookFilterDetailsAsync();

            return Ok(filterOptions);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving filter options: {ex.Message}");
        }
    }
    
    [HttpGet("featured")]
    public async Task<ActionResult<FeaturedBooksDTO>> GetFeaturedBooks()
    {
        try
        {
            var result = await _bookService.GetFeaturedBooksAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving featured books: {ex.Message}");
        }
    }
}