namespace Backend.DTOs.Admin.Announcement
{
    public class UpdateAnnouncementDTO
    {
        public string? Description { get; set; }
        public DateTime? PostedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
