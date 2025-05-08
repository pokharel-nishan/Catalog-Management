namespace Backend.DTOs.User;

public class CartItemDTO
{
    public Guid BookId { get; set; }
    public int Quantity { get; set; }
    public string BookTitle { get; set; }
}