using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

[PrimaryKey(nameof(CartId), nameof(BookId))]
public class CartBook
{
    [ForeignKey("Cart")]
    [Required]
    public Guid CartId { get; set; }
    
    [ForeignKey("Book")]
    [Required]
    public Guid BookId { get; set; }
    
    [Required]
    public int Quantity { get; set; }
    
    public virtual Cart Cart { get; set; }
    public virtual Book Book { get; set; }
}