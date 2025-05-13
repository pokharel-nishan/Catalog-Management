namespace Backend.DTOs.Common;

public class UserDetailsDTO
{
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public string Address { get; set; }
    
    public string DateJoined { get; set; }
    
    public string Email { get; set; }
    
    public IList<string> Roles { get; set; }
}