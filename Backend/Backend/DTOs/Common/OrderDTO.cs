namespace Backend.DTOs.Common;

public class OrderDTO
{
    public Guid OrderId { get; set; }
    public Guid UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public decimal TotalPrice { get; set; }
    public string ClaimCode { get; set; }
    
    public decimal? Discount { get; set; }
    public List<OrderItemDTO> Items { get; set; } = new();
}