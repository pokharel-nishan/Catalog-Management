namespace Backend.DTOs.Admin.Book;

public class BookFilterDTO
{
    public string? SearchTerm { get; set; }

    public string? Author { get; set; }
    public string? ISBN { get; set; }
    public string? Genre { get; set; }
    public string? Publisher { get; set; }
    public string? Language { get; set; }
    public string? Format { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    public DateTime? PublishedAfter { get; set; }
    public DateTime? PublishedBefore { get; set; }
    public string? SortBy { get; set; } // sort by title, author, price, date
    public bool SortDescending { get; set; } = false;
}