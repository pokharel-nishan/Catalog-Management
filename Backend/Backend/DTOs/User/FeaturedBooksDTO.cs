using Backend.DTOs.Admin.Book;

namespace Backend.DTOs.User;

public class FeaturedBooksDTO
{
    public List<BookCategoryDTO> NewArrivals { get; set; } = new();
    public List<BookCategoryDTO> NewReleases { get; set; } = new();
    public List<BookCategoryDTO> TopSales { get; set; } = new();
    public List<BookCategoryDTO> BestSellers { get; set; } = new();
    public List<BookCategoryDTO> ComingSoon { get; set; } = new();
}