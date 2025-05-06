using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
}