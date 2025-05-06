using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BookController : ControllerBase
{
    private IBookService _bookService;
    private IUserService _userService;

    public BookController(IBookService bookService, IUserService userService)
    {
        _bookService = bookService;
        _userService = userService;
    }

    [HttpPost("addBook")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddBookAsync([FromBody] AddBookDTO addBookDTO)
    {
        var adminId = await _userService.GetAdminIdAsync();

        bool isBookAdded = await _bookService.AddBookAsync(addBookDTO, adminId);

        if (isBookAdded)
        {
            return Ok($"Success: Book '{addBookDTO.Title}' (ISBN: {addBookDTO.ISBN}) added successfully!");
        }
        else
        {
            return BadRequest($"Error: Book '{addBookDTO.Title}' (ISBN: {addBookDTO.ISBN}) could not be added.");
        }
    }

    [HttpGet("getAllBooks")]
    //[Authorize(Roles = "Admin")]
    public async Task<List<Book>> GetAllBooksAsync()
    {
        return await _bookService.GetAllBooksAsync();
    }

    [HttpPut("updateBookDetails/{bookId}")]
    //[Authorize(Roles = "Admin")]
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

    [HttpDelete("deleteBook/{bookId}")]
    //[Authorize(Roles = "Admin")]
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
}