using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Email;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Text;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        private IOrderRepository _orderRepository;
        private IOrderBookRepository _orderBookRepository;
        private EmailService _emailService;
        public OrderService(IOrderRepository orderRepository, IOrderBookRepository orderBookRepository, EmailService emailService)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
            _orderBookRepository = orderBookRepository;
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

        private async void SendOrderConfirmationMail(Order order)
        {
            try
            {
                // Get Order Books
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);

                // Build the invoice
                // Order Details
                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine($"<h2>Invoice for Order: {order.OrderId}</h2>");  // Header
                emailBody.AppendLine($"<p><strong>Claim Code:</strong> {order.ClaimCode}</p>");  // Claim Code
                emailBody.AppendLine($"<p><strong>Order Date:</strong> {order.OrderDate}</p>");  // Order Date
                emailBody.AppendLine($"<p><strong>Status:</strong> {order.Status}</p>");  // Order Status

                emailBody.AppendLine($"<h3>Order Details:</h3>");

                // Book Details
                foreach (var orderBook in orderBooks)
                {
                    var title = orderBook.Book.Title;
                    int quantity = orderBook.BookQuantity;
                    var unitPrice = orderBook.Book.Price;
                    var bookDiscount = orderBook.Book.Discount;
                    var discountedBookPrice = unitPrice * (1 - bookDiscount);
                    var subtotal = discountedBookPrice * quantity;

                    emailBody.AppendLine($"<p><strong>Book Title:</strong> {title}</p>");  // Book Title
                    emailBody.AppendLine($"<p>Quantity: {quantity}</p>");  // Quantity
                    emailBody.AppendLine($"<p>Unit Price: {unitPrice:C}</p>");  // Unit Price
                    emailBody.AppendLine($"<p>Book Discount: {bookDiscount * 100}%</p>");  // Book Discount (Individual)
                    emailBody.AppendLine($"<p><strong>Subtotal:</strong> {subtotal:C}</p><hr>");  // Book Subtotal
                }

                // Total Quantity, Total Discount, Total Price
                emailBody.AppendLine($"<p><strong>Total Quantity:</strong> {order.TotalQuantity}</p>");
                emailBody.AppendLine($"<p><strong>Total Discount:</strong> {order.Discount * 100}</p>");
                emailBody.AppendLine($"<h3>Grand Total: {order.TotalPrice:C}</h3>");

                string emailSubject = $"Invice for Order {order.OrderId}";
                string recipientEmail = order.User.Email;

                await _emailService.SendEmailAsync(recipientEmail, emailSubject, emailBody.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }
    }
}
