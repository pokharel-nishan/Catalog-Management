using Backend.DTOs.Admin.Announcement;
using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Notifications;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public AnnouncementService(IAnnouncementRepository announcementRepository, IHubContext<NotificationHub> hubContext)
        {
            _announcementRepository = announcementRepository;
            _hubContext = hubContext;
        }
        
        public async Task<List<Announcement>> GetActiveAnnouncementsAsync()
        {
            var now = DateTime.UtcNow;
            return await _announcementRepository.GetActiveAnnouncementsAsync(now);
        }

        public async Task<bool> AddAnnouncementAsync(AddAnnouncementDTO addAnnouncementDTO, Guid adminId)
        {
            try
            {
                Announcement announcement = new Announcement
                {
                    AnnouncementId = Guid.NewGuid(),
                    Description = addAnnouncementDTO.Description,
                    PostedAt = addAnnouncementDTO.PostedAt,
                    UserId = adminId,
                    IsPublished = addAnnouncementDTO.PostedAt <= DateTime.UtcNow
                };

                if (addAnnouncementDTO.ExpiryDate != null)
                {
                    announcement.ExpiryDate = (DateTime)addAnnouncementDTO.ExpiryDate;
                }

                bool isAnnouncementAdded = await _announcementRepository.AddAnnouncementAsync(announcement);

                // Send immediately if it's time
                if (isAnnouncementAdded && announcement.IsPublished)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveAnnouncement", 
                        new {
                            id = announcement.AnnouncementId,
                            message = announcement.Description,
                            date = announcement.PostedAt
                        });
                }

                return isAnnouncementAdded;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AnnouncementService.AddAnnouncementAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<Announcement> GetAnnouncementByIdAsync(Guid announcementId)
        {
            return await _announcementRepository.GetAnnouncementByIdAsync(announcementId);
        }

        public async Task<List<Announcement>> GetAllAnnouncementsAsync()
        {
            return await _announcementRepository.GetAllAnnouncementsAsync();
        }


        public async Task<bool> UpdateAnnouncementDetailsAsync(Guid announcementId, UpdateAnnouncementDTO updateAnnouncementDTO)
        {
            var announcement = await _announcementRepository.GetAnnouncementByIdAsync(announcementId);
            if (announcement == null)
            {
                return false;
            }

            if (updateAnnouncementDTO.Description != null) announcement.Description = updateAnnouncementDTO.Description;
            if (updateAnnouncementDTO.PostedAt != null) announcement.PostedAt = (DateTime)updateAnnouncementDTO.PostedAt;
            if (updateAnnouncementDTO.ExpiryDate != null) announcement.ExpiryDate = (DateTime)updateAnnouncementDTO.ExpiryDate;

            return await _announcementRepository.UpdateAnnouncementDetailsAsync(announcement);

        }

        public async Task<bool> DeleteAnnouncementAsync(Guid announcementId)
        {
            return await _announcementRepository.DeleteAnnouncementAsync(announcementId);
        }
    }
}
