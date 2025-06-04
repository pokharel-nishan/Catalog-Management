namespace Backend.DTOs.Common;

public class OrderItemDTO
{
    public Guid BookId { get; set; }
    public string Title { get; set; }
    public string ImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal Subtotal { get; set; }
}