namespace Backend.DTOs.User;

public class BookCategoryDTO
{
    public Guid BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public string ImageURL { get; set; } = string.Empty;
    public bool InStock { get; set; }
    public DateTime? OnSaleUntil { get; set; }
}