using Backend.Entities;
using Backend.Repositories;
using Backend.Services.Email;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Text;
using Backend.DTOs.Common;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        private IOrderRepository _orderRepository;
        private IOrderBookRepository _orderBookRepository;
        private IUserRepository _userRepository;
        private EmailService _emailService;
        private ICartRepository _cartRepository;

        public OrderService(IOrderRepository orderRepository, IOrderBookRepository orderBookRepository,
            IUserRepository userRepository, EmailService emailService, ICartRepository cartRepository)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
            _userRepository = userRepository;
            _orderBookRepository = orderBookRepository;
            _cartRepository = cartRepository;
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
                emailBody.AppendLine($"<h2>Invoice for Order: {order.OrderId}</h2>"); // Header
                emailBody.AppendLine($"<p><strong>Claim Code:</strong> {order.ClaimCode}</p>"); // Claim Code
                emailBody.AppendLine($"<p><strong>Order Date:</strong> {order.OrderDate}</p>"); // Order Date
                emailBody.AppendLine($"<p><strong>Status:</strong> {order.Status}</p>"); // Order Status

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

                    emailBody.AppendLine($"<p><strong>Book Title:</strong> {title}</p>"); // Book Title
                    emailBody.AppendLine($"<p>Quantity: {quantity}</p>"); // Quantity
                    emailBody.AppendLine($"<p>Unit Price: {unitPrice:C}</p>"); // Unit Price
                    emailBody.AppendLine($"<p>Book Discount: {bookDiscount * 100}%</p>"); // Book Discount (Individual)
                    emailBody.AppendLine($"<p><strong>Subtotal:</strong> {subtotal:C}</p><hr>"); // Book Subtotal
                }

                // Total Quantity, Total Discount, Total Price
                emailBody.AppendLine($"<p><strong>Total Quantity:</strong> {order.TotalQuantity}</p>");
                emailBody.AppendLine($"<p><strong>Total Discount:</strong> {order.Discount * 100}</p>");
                emailBody.AppendLine($"<h3>Grand Total: {order.TotalPrice:C}</h3>");

                string emailSubject = $"Invoice for Order {order.OrderId}";
                string recipientEmail = order.User.Email;

                await _emailService.SendEmailAsync(recipientEmail, emailSubject, emailBody.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }

        private async void SendOrderCompletionMail(Order order)
        {
            try
            {
                // Get Order Books
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);

                // Build the invoice
                // Order Details
                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine($"<h2>Invoice for Order: {order.OrderId}</h2>"); // Header
                emailBody.AppendLine($"<p><strong>Order Date:</strong> {order.OrderDate}</p>"); // Order Date
                emailBody.AppendLine($"<p><strong>Status:</strong> {order.Status}</p>"); // Order Status

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

                    emailBody.AppendLine($"<p><strong>Book Title:</strong> {title}</p>"); // Book Title
                    emailBody.AppendLine($"<p>Quantity: {quantity}</p>"); // Quantity
                    emailBody.AppendLine($"<p>Unit Price: {unitPrice:C}</p>"); // Unit Price
                    emailBody.AppendLine($"<p>Book Discount: {bookDiscount * 100}%</p>"); // Book Discount (Individual)
                    emailBody.AppendLine($"<p><strong>Subtotal:</strong> {subtotal:C}</p><hr>"); // Book Subtotal
                }

                // Total Quantity, Total Discount, Total Price
                emailBody.AppendLine($"<p><strong>Total Quantity:</strong> {order.TotalQuantity}</p>");
                emailBody.AppendLine($"<p><strong>Total Discount:</strong> {order.Discount * 100}</p>");
                emailBody.AppendLine($"<h3>Grand Total: {order.TotalPrice:C}</h3>");

                string emailSubject = $"Invoice for Order {order.OrderId}";
                string recipientEmail = order.User.Email;

                await _emailService.SendEmailAsync(recipientEmail, emailSubject, emailBody.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }

        private async Task SendOrderCancellationEmail(Order order)
        {
            try
            {
                // Get Order Books
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);

                // Build the invoice
                // Order Details
                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine($"<h2>Invoice for Order: {order.OrderId}</h2>"); // Header
                emailBody.AppendLine($"<p><strong>Claim Code:</strong> {order.ClaimCode}</p>"); // Claim Code
                emailBody.AppendLine($"<p><strong>Order Date:</strong> {order.OrderDate}</p>"); // Order Date
                emailBody.AppendLine($"<p><strong>Status:</strong> {order.Status}</p>"); // Order Status

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

                    emailBody.AppendLine($"<p><strong>Book Title:</strong> {title}</p>"); // Book Title
                    emailBody.AppendLine($"<p>Quantity: {quantity}</p>"); // Quantity
                    emailBody.AppendLine($"<p>Unit Price: {unitPrice:C}</p>"); // Unit Price
                    emailBody.AppendLine($"<p>Book Discount: {bookDiscount * 100}%</p>"); // Book Discount (Individual)
                    emailBody.AppendLine($"<p><strong>Subtotal:</strong> {subtotal:C}</p><hr>"); // Book Subtotal
                }

                // Total Quantity, Total Discount, Total Price
                emailBody.AppendLine($"<p><strong>Total Quantity:</strong> {order.TotalQuantity}</p>");
                emailBody.AppendLine($"<p><strong>Total Discount:</strong> {order.Discount * 100}</p>");
                emailBody.AppendLine($"<h3>Grand Total: {order.TotalPrice:C}</h3>");

                string emailSubjectForUser = $"Your Order {order.OrderId} has been cancelled.";
                string emailSubjectForStaff = $"Order {order.OrderId} has been cancelled.";

                var recipientUserEmail = order.User.Email;
                await _emailService.SendEmailAsync(recipientUserEmail, emailSubjectForUser, emailBody.ToString());

                var staffUsers = await _userRepository.GetAllStaffUsersAsync();
                foreach (var staffUser in staffUsers)
                {
                    await _emailService.SendEmailAsync(staffUser.Email, emailSubjectForStaff, emailBody.ToString());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order cancellation email: {ex.Message}");
            }
        }

        public async Task<Order> CreateOrderFromCartAsync(Guid userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null || !(await _cartRepository.GetCartItemsAsync(cart.Id)).Any())
                return null;

            var order = new Order
            {
                UserId = userId,
                CartId = cart.Id,
                OrderDate = DateTime.UtcNow,
                TotalQuantity = cart.TotalQuantity,
                TotalPrice = cart.TotalPrice,
                Status = OrderStatus.Pending,
                ClaimCode = Guid.NewGuid().ToString().Substring(0, 10).ToUpper()
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order);

            var cartItems = await _cartRepository.GetCartItemsAsync(cart.Id);
            foreach (var cartItem in cartItems)
            {
                var discountedPrice = cartItem.Book.Price * (1 - cartItem.Book.Discount);
                await _orderBookRepository.AddOrderBookAsync(new OrderBook
                {
                    OrderId = createdOrder.OrderId,
                    BookId = cartItem.BookId,
                    BookQuantity = cartItem.Quantity,
                    BookTotal = discountedPrice * cartItem.Quantity
                });
            }

            await _cartRepository.ClearCartAsync(cart.Id);
            return createdOrder;
        }

        public async Task<bool> ConfirmOrderAsync(Guid orderId, Guid userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId != userId || order.Status != OrderStatus.Pending)
                return false;

            order.Status = OrderStatus.Ongoing;

            var success = await _orderRepository.UpdateOrderAsync(order);
            if (success) SendOrderConfirmationMail(order);
            return success;
        }

        public async Task<bool> CancelOrderAsync(Guid orderId, Guid userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId != userId ||
                (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Ongoing))
                return false;

            order.Status = OrderStatus.Cancelled;
            var success = await _orderRepository.UpdateOrderAsync(order);
            if (success) await SendOrderCancellationEmail(order);
            return success;
        }

        public async Task<bool> CompleteOrderAsync(Guid orderId, string claimCode)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.ClaimCode != claimCode || order.Status != OrderStatus.Ongoing)
                return false;

            order.Status = OrderStatus.Completed;
            var success = await _orderRepository.UpdateOrderAsync(order);
            if (success) SendOrderCompletionMail(order);
            return success;
        }

        public async Task<OrderDTO> GetOrderDetailsAsync(Guid orderId)
        {
            var order = await _orderRepository.GetOrderWithDetailsAsync(orderId);
            if (order == null) return null;

            return new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Status = order.Status.ToString(),
                TotalPrice = order.TotalPrice,
                ClaimCode = order.ClaimCode,
                UserId = order.UserId,
                Items = order.OrderBooks.Select(ob => new OrderItemDTO
                {
                    BookId = ob.BookId,
                    Title = ob.Book.Title,
                    ImageUrl = ob.Book.ImageURL,
                    Quantity = ob.BookQuantity,
                    UnitPrice = ob.BookTotal / ob.BookQuantity,
                    Discount = 1 - (ob.BookTotal / (ob.BookQuantity * ob.Book.Price)),
                    Subtotal = ob.BookTotal
                }).ToList()
            };
        }

        public async Task<IEnumerable<OrderDTO>> GetUserOrdersAsync(Guid userId)
        {
            var orders = await _orderRepository.GetUserOrdersAsync(userId);
            return orders.Select(o => new OrderDTO
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                Status = o.Status.ToString(),
                TotalPrice = o.TotalPrice,
                Items = o.OrderBooks.Select(ob => new OrderItemDTO
                {
                    BookId = ob.BookId,
                    Title = ob.Book.Title,
                    Quantity = ob.BookQuantity,
                    Subtotal = ob.BookTotal
                }).ToList()
            });
        }

        public async Task<IEnumerable<OrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            return orders.Select(o => MapOrderToDto(o));
        }
        
        public async Task<IEnumerable<OrderDTO>> GetOrdersByStatusAsync(OrderStatus status)
        {
            var orders = await _orderRepository.GetOrdersByStatusAsync(status);
            return orders.Select(o => MapOrderToDto(o));
        }

        private OrderDTO MapOrderToDto(Order order)
        {
            return new OrderDTO
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Status = order.Status.ToString(),
                TotalPrice = order.TotalPrice,
                ClaimCode = order.ClaimCode,
                Items = order.OrderBooks.Select(ob => new OrderItemDTO
                {
                    BookId = ob.BookId,
                    Title = ob.Book.Title,
                    Quantity = ob.BookQuantity,
                    Subtotal = ob.BookTotal
                }).ToList()
            };
        }
    }
}
