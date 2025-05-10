using Backend.Entities;

namespace Backend.Services
{
    public interface IOrderService
    {
        Task<Order> CreateOrderFromCartAsync(Guid userId);

        Task<bool> ConfirmOrderAsync(Guid orderId, Guid userId);
        Task<bool> CancelOrderAsync(Guid orderId, Guid userId);
        Task<bool> CompleteOrderAsync(Guid orderId, string claimCode);


    }
}
