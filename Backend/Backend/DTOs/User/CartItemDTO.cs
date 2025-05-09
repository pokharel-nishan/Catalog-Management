namespace Backend.DTOs.User;

public class CartItemDTO
{
    public Guid BookId { get; set; }
    public string BookTitle { get; set; }
    public int Quantity { get; set; }
    public decimal? Price { get; set; }
    public string? ImageUrl { get; set; }
    
}