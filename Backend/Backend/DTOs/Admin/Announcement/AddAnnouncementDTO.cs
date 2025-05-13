namespace Backend.DTOs.Admin.Announcement
{
    public class AddAnnouncementDTO
    {
        public string Description { get; set; }
        public DateTime PostedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
