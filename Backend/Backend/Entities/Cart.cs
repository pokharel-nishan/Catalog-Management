using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public class Cart
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    public int TotalQuantity { get; set; }
    
    public decimal TotalPrice { get; set; }
    
    [Required]
    public virtual User User { get; set; }
}