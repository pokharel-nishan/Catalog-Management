namespace Backend.DTOs.Admin.Book;

public class BookSummaryDTO
{
    public Guid BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public bool IsOnSale { get; set; }
    public bool InStock { get; set; }
}