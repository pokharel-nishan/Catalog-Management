using Backend.DTOs.Admin.Announcement;
using Backend.DTOs.Admin.Book;
using Backend.Entities;

namespace Backend.Services
{
    public interface IAnnouncementService
    {
        Task<List<Announcement>> GetActiveAnnouncementsAsync();
        Task<bool> AddAnnouncementAsync(AddAnnouncementDTO addAnnouncementDTO, Guid adminId);
        Task<List<Announcement>> GetAllAnnouncementsAsync();
        Task<Announcement> GetAnnouncementByIdAsync(Guid announcementId);
        Task<bool> UpdateAnnouncementDetailsAsync(Guid announcementId, UpdateAnnouncementDTO updateAnnouncementDTO);
        Task<bool> DeleteAnnouncementAsync(Guid announcementId);
    }
}
