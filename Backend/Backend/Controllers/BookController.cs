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

    [HttpPost(Name = "AddBook")]
    //[Authorize(Roles ="Admin")]
    public async Task<IActionResult> Post(AddBookDTO addBookDTO)
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
}