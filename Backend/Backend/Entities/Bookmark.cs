using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public class Bookmark
{
    [Key]
    public Guid BookmarkId { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    public int TotalQuantity { get; set; }
    
    public virtual User User { get; set; }
}