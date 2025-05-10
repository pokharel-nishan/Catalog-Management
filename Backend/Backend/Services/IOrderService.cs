using Backend.Entities;

namespace Backend.Services
{
    public interface IOrderService
    {
        Task<bool> ProcessClaimCodeAsync(Guid orderId, string claimCode);
        Task<Order> CreateOrderFromCartAsync(Guid userId);

        Task<bool> ConfirmOrderAsync(Guid orderId, Guid userId);

    }
}
