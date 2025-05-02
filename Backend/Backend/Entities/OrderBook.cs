using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

[PrimaryKey(nameof(BookId), nameof(OrderId))]
public class OrderBook
{
    [ForeignKey("Order")]
    public Guid OrderId { get; set; }
    
    [ForeignKey("Book")]
    public Guid BookId { get; set; }
    
    public int BookQuantity { get; set; }
    
    public decimal BookTotal { get; set; }
    
    public virtual Order Order { get; set; }
    public virtual Book Book { get; set; }
}