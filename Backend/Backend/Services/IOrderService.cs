namespace Backend.Services
{
    public interface IOrderService
    {
        Task<bool> ProcessClaimCodeAsync(Guid orderId, string claimCode);
    }
}
