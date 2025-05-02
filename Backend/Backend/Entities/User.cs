using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities;

public class User: IdentityUser<Guid>
{
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public string Address { get; set; }
    
    public string DateJoined { get; set; }
    
    public virtual Cart Cart { get; set; }
}