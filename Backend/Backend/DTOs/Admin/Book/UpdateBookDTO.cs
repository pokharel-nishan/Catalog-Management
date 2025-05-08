namespace Backend.DTOs.Admin.Book
{
    public class UpdateBookDTO
    {
        public string? ISBN { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Publisher { get; set; }
        public DateTime? PublicationDate { get; set; }
        public string? Genre { get; set; }
        public string? Language { get; set; }
        public string? Format { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public decimal? Discount { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        public DateTime? ArrivalDate { get; set; }

    }
}