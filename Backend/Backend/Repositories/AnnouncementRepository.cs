using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly ApplicationDbContext _context;

        public AnnouncementRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAnnouncementAsync(Announcement announcement)
        {
            try
            {
                _context.Announcements.Add(announcement);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AnnouncementRepository.AddAnnouncementAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<List<Announcement>> GetAllAnnouncementsAsync()
        {
            return await _context.Announcements.ToListAsync();
        }

        public async Task<Announcement?> GetAnnouncementByIdAsync(Guid announcementId)
        {
            return await _context.Announcements.FindAsync(announcementId);
        }

        public async Task<bool> UpdateAnnouncementDetailsAsync(Announcement announcement)
        {
            _context.Announcements.Update(announcement);
            var result = await _context.SaveChangesAsync();

            return result > 0;
        }


        public async Task<bool> DeleteAnnouncementAsync(Guid announcementId)
        {
            try
            {
                var announcement = await _context.Announcements.FirstOrDefaultAsync(x => x.AnnouncementId == announcementId);

                if (announcement != null)
                {
                    _context.Announcements.Remove(announcement);
                    await _context.SaveChangesAsync();
                    return true;
                }
                Console.WriteLine("Error in BookRepository.DeleteBookAsync: Book does not exist!}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookRepository.DeleteBookAsync: {ex.Message}");
                return false;
            }
        }
    }
}
