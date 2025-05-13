namespace Backend.Services;

public interface IOrderNotificationService
{
    Task NotifyOrderCompletion(Guid orderId);
}