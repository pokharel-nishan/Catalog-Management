using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

[Index(nameof(ISBN), IsUnique = true)]
public class Book
{
    [Key]
    public Guid BookId { get; set; }
    
    public string ISBN { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    public string Title { get; set; }
    
    public string Author { get; set; }
    
    public string Publisher { get; set; }  
    
    public DateTime PublicationDate { get; set; }
    
    public string Genre { get; set; }
    
    public string Language { get; set; }
    
    public string Format { get; set; }
    
    [Column(TypeName = "text")]
    public string Description { get; set; }
    
    public decimal Price { get; set; }
    
    public int Stock { get; set; }
    
    [Range(0, 1)]
    public decimal Discount { get; set; }
    public DateTime? DiscountStartDate { get; set; }
    public DateTime? DiscountEndDate { get; set; }
    public DateTime? ArrivalDate { get; set; }

    public virtual User User { get; set; }
}