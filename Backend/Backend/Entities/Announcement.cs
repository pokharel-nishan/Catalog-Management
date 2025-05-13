using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities;

public class Announcement
{
    [Key]
    public Guid AnnouncementId { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    
    [Required]
    public string Description { get; set; }
    
    [Required]
    public DateTime PostedAt { get; set; }

    public DateTime ExpiryDate { get; set; }
    
    public bool IsPublished { get; set; } = false;

    
    public virtual User User { get; set; }
}
