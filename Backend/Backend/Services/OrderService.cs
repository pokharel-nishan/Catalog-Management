using Backend.Repositories;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        private IOrderRepository _orderRepository;
        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<bool> ProcessClaimCodeAsync(Guid orderId, string claimCode)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);

            if (order == null)
            {
                var orderClaimCode = order.ClaimCode;
                if (orderClaimCode != null)
                {
                    return orderClaimCode == claimCode;
                }
                Console.WriteLine("No claim code found!");
                return false;
            }
            Console.WriteLine("Order does not exist!");
            return false;
        }
    }
}
