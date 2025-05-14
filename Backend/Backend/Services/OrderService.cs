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
        private readonly IOrderNotificationService _orderNotificationService;

        public OrderService(IOrderRepository orderRepository, IOrderBookRepository orderBookRepository,
            IUserRepository userRepository, EmailService emailService, ICartRepository cartRepository,
            IOrderNotificationService orderNotificationService)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
            _userRepository = userRepository;
            _orderBookRepository = orderBookRepository;
            _cartRepository = cartRepository;
            _orderNotificationService = orderNotificationService;
        }

        private async Task SendOrderConfirmationMail(Order order)
        {
            try
            {
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);
                var userDetails = await _userRepository.GetUserByIdAsync(order.UserId);
                string emailSubject = $"Your Order Confirmation - #{order.OrderId}";
                string recipientEmail = userDetails.Email;

                // HTML email template with CSS styling
                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine(@"<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }
                    .order-info { background-color: white; padding: 15px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .book-item { border-bottom: 1px solid #eee; padding: 10px 0; }
                    .book-item:last-child { border-bottom: none; }
                    .total { font-weight: bold; font-size: 1.1em; margin-top: 15px; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }
                    .status { display: inline-block; padding: 5px 10px; background-color: #e3f2fd; color: #1976d2; border-radius: 3px; }
                </style>
            </head>
            <body>
                <div class='header'>
                    <h2>Thank you for your order!</h2>
                </div>
                <div class='content'>
                    <div class='order-info'>
                        <h3>Order #" + order.OrderId + @"</h3>
                        <p><strong>Order Date:</strong> " + order.OrderDate.ToString("f") + @"</p>
                        <p><strong>Status:</strong> <span class='status'>" + order.Status + @"</span></p>");

                if (!string.IsNullOrEmpty(order.ClaimCode))
                {
                    emailBody.AppendLine(@"<p><strong>Claim Code:</strong> <span style='font-size:1.2em;'>" +
                                         order.ClaimCode + @"</span></p>");
                }

                emailBody.AppendLine(@"
                    </div>
                    
                    <h3>Order Details</h3>");

                foreach (var orderBook in orderBooks)
                {
                    var title = orderBook.Book.Title;
                    int quantity = orderBook.BookQuantity;
                    var unitPrice = orderBook.Book.Price;
                    var bookDiscount = orderBook.Book.Discount;
                    var discountedBookPrice = unitPrice * (1 - bookDiscount);
                    var subtotal = discountedBookPrice * quantity;

                    emailBody.AppendLine(@"
                        <div class='book-item'>
                            <p><strong>" + title + @"</strong></p>
                            <p>Quantity: " + quantity + @"</p>
                            <p>Price: " + unitPrice.ToString("C") + @" " +
                                         (bookDiscount > 0
                                             ? "<span style='color:#4CAF50;'>(" + (bookDiscount * 100) +
                                               @"% off)</span>"
                                             : "") + @"</p>
                            <p><strong>Subtotal: " + subtotal.ToString("C") + @"</strong></p>
                        </div>");
                }

                emailBody.AppendLine(@"
                    <div class='total'>
                        <p>Total Quantity: " + order.TotalQuantity + @"</p>
                        <p>Total Discount: " + (order.Discount * 100).ToString("0.##") + @"%</p>
                        <p style='font-size:1.2em;'>Grand Total: " + order.TotalPrice.ToString("C") + @"</p>
                    </div>
                    
                    <div class='footer'>
                        <p>If you have any questions about your order, please contact our support team.</p>
                        <p>Thank you for shopping with us!</p>
                    </div>
                </div>
            </body>
            </html>");

                await _emailService.SendEmailAsync(recipientEmail, emailSubject, emailBody.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }

        private async Task SendOrderCompletionMail(Order order)
        {
            try
            {
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);
                var userDetails = await _userRepository.GetUserByIdAsync(order.UserId);

                string emailSubject = $"Your Order #{order.OrderId} is Complete!";
                string recipientEmail = userDetails.Email;

                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine(@"<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }
        .order-info { background-color: white; padding: 15px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .book-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .book-item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 1.1em; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }
        .status { display: inline-block; padding: 5px 10px; background-color: #e8f5e9; color: #2e7d32; border-radius: 3px; }
        .highlight-box { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Your Order is Complete!</h2>
    </div>
    <div class='content'>
        <div class='highlight-box'>
            <p>We're happy to let you know that your order has been successfully completed.</p>
        </div>
        
        <div class='order-info'>
            <h3>Order #" + order.OrderId + @"</h3>
            <p><strong>Order Date:</strong> " + order.OrderDate.ToString("f") + @"</p>
            <p><strong>Status:</strong> <span class='status'>" + order.Status + @"</span></p>
        </div>
        
        <h3>Order Details</h3>");

                foreach (var orderBook in orderBooks)
                {
                    var title = orderBook.Book.Title;
                    int quantity = orderBook.BookQuantity;
                    var unitPrice = orderBook.Book.Price;
                    var bookDiscount = orderBook.Book.Discount;
                    var discountedBookPrice = unitPrice * (1 - bookDiscount);
                    var subtotal = discountedBookPrice * quantity;

                    emailBody.AppendLine(@"
            <div class='book-item'>
                <p><strong>" + title + @"</strong></p>
                <p>Quantity: " + quantity + @"</p>
                <p>Price: " + unitPrice.ToString("C") + @" " +
                                         (bookDiscount > 0
                                             ? "<span style='color:#4CAF50;'>(" + (bookDiscount * 100) +
                                               @"% off)</span>"
                                             : "") + @"</p>
                <p><strong>Subtotal: " + subtotal.ToString("C") + @"</strong></p>
            </div>");
                }

                emailBody.AppendLine(@"
        <div class='total'>
            <p>Total Quantity: " + order.TotalQuantity + @"</p>
            <p>Total Discount: " + (order.Discount * 100).ToString("0.##") + @"%</p>
            <p style='font-size:1.2em;'>Grand Total: " + order.TotalPrice.ToString("C") + @"</p>
        </div>
        
        <div class='footer'>
            <p>We hope you enjoyed your shopping experience with us!</p>
            <p>If you need any assistance, please contact our customer support.</p>
        </div>
    </div>
</body>
</html>");

                await _emailService.SendEmailAsync(recipientEmail, emailSubject, emailBody.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order completion email: {ex.Message}");
            }
        }

        private async Task SendOrderCancellationEmail(Order order)
        {
            try
            {
                var orderBooks = await _orderBookRepository.GetOrderBooksAsync(order.OrderId);

                string emailSubjectForUser = $"Your Order #{order.OrderId} Has Been Cancelled";
                string emailSubjectForStaff = $"Order #{order.OrderId} Cancellation Notification";

                StringBuilder emailBody = new StringBuilder();
                emailBody.AppendLine(@"<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }
        .order-info { background-color: white; padding: 15px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .book-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .book-item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 1.1em; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }
        .status { display: inline-block; padding: 5px 10px; background-color: #ffebee; color: #c62828; border-radius: 3px; }
        .highlight-box { background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Order Cancellation</h2>
    </div>
    <div class='content'>
        <div class='highlight-box'>
            <p>Your order has been cancelled as requested. Below are the details of your cancelled order.</p>
        </div>
        
        <div class='order-info'>
            <h3>Order #" + order.OrderId + @"</h3>
            <p><strong>Order Date:</strong> " + order.OrderDate.ToString("f") + @"</p>");

                if (!string.IsNullOrEmpty(order.ClaimCode))
                {
                    emailBody.AppendLine(@"<p><strong>Claim Code:</strong> " + order.ClaimCode + @"</p>");
                }

                emailBody.AppendLine(@"<p><strong>Status:</strong> <span class='status'>" + order.Status + @"</span></p>
        </div>
        
        <h3>Order Details</h3>");

                foreach (var orderBook in orderBooks)
                {
                    var title = orderBook.Book.Title;
                    int quantity = orderBook.BookQuantity;
                    var unitPrice = orderBook.Book.Price;
                    var bookDiscount = orderBook.Book.Discount;
                    var discountedBookPrice = unitPrice * (1 - bookDiscount);
                    var subtotal = discountedBookPrice * quantity;

                    emailBody.AppendLine(@"
            <div class='book-item'>
                <p><strong>" + title + @"</strong></p>
                <p>Quantity: " + quantity + @"</p>
                <p>Price: " + unitPrice.ToString("C") + @" " +
                                         (bookDiscount > 0
                                             ? "<span style='color:#4CAF50;'>(" + (bookDiscount * 100) +
                                               @"% off)</span>"
                                             : "") + @"</p>
                <p><strong>Subtotal: " + subtotal.ToString("C") + @"</strong></p>
            </div>");
                }

                emailBody.AppendLine(@"
        <div class='total'>
            <p>Total Quantity: " + order.TotalQuantity + @"</p>
            <p>Total Discount: " + (order.Discount * 100).ToString("0.##") + @"%</p>
            <p style='font-size:1.2em;'>Grand Total: " + order.TotalPrice.ToString("C") + @"</p>
        </div>
        
        <div class='footer'>
            <p>If this cancellation was unexpected or you need any assistance, please contact our support team.</p>
            <p>We hope to serve you again in the future.</p>
        </div>
    </div>
</body>
</html>");

                // Send to user
                var userDetails = await _userRepository.GetUserByIdAsync(order.UserId);
                string recipientEmail = userDetails.Email;
                await _emailService.SendEmailAsync(recipientEmail, emailSubjectForUser, emailBody.ToString());

                // Send to staff (same content but different subject)
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

            var cartItems = await _cartRepository.GetCartItemsAsync(cart.Id);
            
            // Calculate total quantity and base price
            int totalQuantity = cartItems.Sum(item => item.Quantity);
            decimal totalPrice = cartItems.Sum(item => 
                item.Book.Price * (1 - item.Book.Discount) * item.Quantity);
            
            decimal discount = 0;
            
            // 5% discount for more than 5 books
            if (totalQuantity >= 5)
            {
                discount += 0.05m;
            }
            
            // 10% discount after 10 successful orders
            var userOrders = await _orderRepository.GetUserOrdersAsync(userId);
            int completedOrdersCount = userOrders.Count(o => o.Status == OrderStatus.Completed);
            
            if (completedOrdersCount >= 10)
            {
                discount += 0.10m;
            }
            
            // Apply discount to total price
            decimal discountedTotalPrice = totalPrice * (1 - discount);

            var order = new Order
            {
                UserId = userId,
                CartId = cart.Id,
                OrderDate = DateTime.UtcNow,
                TotalQuantity = totalQuantity,
                TotalPrice = discountedTotalPrice,
                Discount = discount,
                Status = OrderStatus.Pending,
                ClaimCode = Guid.NewGuid().ToString().Substring(0, 10).ToUpper()
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order);

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
            if (success) await SendOrderConfirmationMail(order);
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
            if (success)
            {
                await _orderNotificationService.NotifyOrderCompletion(orderId);
                await SendOrderCompletionMail(order);
            }

            ;
            return success;
        }

        public async Task<OrderDTO> GetOrderDetailsAsync(Guid orderId)
        {
            var order = await _orderRepository.GetOrderWithDetailsAsync(orderId);
            if (order == null) return null;

            var items = order.OrderBooks.Select(ob => new OrderItemDTO
            {
                BookId = ob.BookId,
                Title = ob.Book.Title,
                ImageUrl = ob.Book.ImageURL,
                Quantity = ob.BookQuantity,
                UnitPrice = ob.Book.Price,
                Discount = ob.Book.Discount, 
                Subtotal = ob.BookTotal
            }).ToList();

            return new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Status = order.Status.ToString(),
                TotalPrice = order.TotalPrice,
                 Discount= order.Discount, 
                ClaimCode = order.ClaimCode,
                UserId = order.UserId,
                Items = items
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