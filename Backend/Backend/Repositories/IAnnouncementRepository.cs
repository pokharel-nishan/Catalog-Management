using Backend.Entities;

namespace Backend.Repositories
{
    public interface IAnnouncementRepository
    {
        Task<bool> AddAnnouncementAsync(Announcement announcement);
        Task<List<Announcement>> GetAllAnnouncementsAsync();
        Task<Announcement?> GetAnnouncementByIdAsync(Guid announcementId);
        Task<bool> UpdateAnnouncementDetailsAsync(Announcement announcement);
        Task<bool> DeleteAnnouncementAsync(Guid announcementId);
    }
}
