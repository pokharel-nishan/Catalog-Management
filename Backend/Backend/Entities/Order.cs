using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public enum OrderStatus
{
    Pending,      
    Cancelled,     
    Ongoing,      
    Completed    
}


public class Order
{
    [Key]
    public Guid OrderId { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    [ForeignKey("Cart")]
    public Guid CartId { get; set; }
    
    public DateTime OrderDate { get; set; }
    
    public int TotalQuantity { get; set; }
    
    public decimal TotalPrice { get; set; }
        
    public decimal SubTotal { get; set; }
    public decimal Discount { get; set; }
    
    public string ClaimCode { get; set; }
    
    [EnumDataType(typeof(OrderStatus))]
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    public virtual Cart Cart { get; set; }
    public virtual User User { get; set; }
    public virtual ICollection<OrderBook> OrderBooks { get; set; }

}