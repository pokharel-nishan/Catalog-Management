namespace Backend.DTOs.Admin.Book;

public class BookDetailDTO
{
    public Guid BookId { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public string Genre { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public bool IsOnSale { get; set; }
    public int Stock { get; set; }
    public bool InStock => Stock > 0;
    public DateTime? OnSaleUntil { get; set; }
}