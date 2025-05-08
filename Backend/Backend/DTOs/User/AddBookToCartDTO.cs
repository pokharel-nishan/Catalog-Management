using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.User;

public class AddBookToCartDTO
{
    [Required]
    public Guid BookId { get; set; }
}