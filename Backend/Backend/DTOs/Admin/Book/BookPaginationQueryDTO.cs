namespace Backend.DTOs.Admin.Book;

public class BookPaginationQueryDTO
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}