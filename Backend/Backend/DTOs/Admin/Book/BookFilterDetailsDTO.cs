namespace Backend.DTOs.Admin.Book;

public class BookFilterDetailsDto
{
    public List<string> Genres { get; set; }
    public List<string> Authors { get; set; }
    public List<string> Publishers { get; set; }
    public List<string> Languages { get; set; }
    public List<string> Formats { get; set; }
    public PriceRangeDto PriceRange { get; set; }
}

public class PriceRangeDto
{
    public decimal Min { get; set; }
    public decimal Max { get; set; }
}