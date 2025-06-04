using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Common;

public class LoginDTO
{
    [Required, EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
    
    public bool RememberMe { get; set; } = false;

}