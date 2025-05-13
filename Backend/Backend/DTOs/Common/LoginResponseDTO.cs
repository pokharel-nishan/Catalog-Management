namespace Backend.DTOs.Common;

public class LoginResponseDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public IList<string> Roles { get; set; }
}