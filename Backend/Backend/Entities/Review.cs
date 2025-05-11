using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    [ForeignKey("Book")]
    public Guid BookId { get; set; }
    
    public string Content { get; set; }
    
    public int Rating { get; set; }
    
    public DateTime DateAdded { get; set; }
    
    public virtual User User { get; set; }
    public virtual Book Book { get; set; }
}