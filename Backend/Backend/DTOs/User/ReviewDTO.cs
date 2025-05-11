namespace Backend.DTOs.User;

public class ReviewDTO
{
    public Guid ReviewId { get; set; }
    
    public string Username { get; set; }
    
    public string Content { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public int Rating { get; set; }
    
}