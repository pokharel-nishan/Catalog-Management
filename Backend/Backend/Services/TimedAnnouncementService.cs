// TimedAnnouncementService.cs
using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Notifications;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;

namespace Backend.Services;

public class TimedAnnouncementService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<TimedAnnouncementService> _logger;

    public TimedAnnouncementService(IServiceProvider services, ILogger<TimedAnnouncementService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Timed Announcement Service is running.");

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _services.CreateScope())
            {
                var announcementRepository = scope.ServiceProvider.GetRequiredService<IAnnouncementRepository>();
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();

                var now = DateTime.UtcNow;
                var pendingAnnouncements = await announcementRepository.GetPendingAnnouncementsAsync(now);

                foreach (var announcement in pendingAnnouncements)
                {
                    try
                    {
                        await hubContext.Clients.All.SendAsync("ReceiveAnnouncement", 
                            new {
                                id = announcement.AnnouncementId,
                                message = announcement.Description,
                                date = announcement.PostedAt
                            });
                        
                        announcement.IsPublished = true;
                        await announcementRepository.UpdateAnnouncementDetailsAsync(announcement);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error broadcasting announcement {AnnouncementId}", announcement.AnnouncementId);
                    }
                }
            }

            // Check every minute
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}