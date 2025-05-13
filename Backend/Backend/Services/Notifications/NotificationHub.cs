using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Backend.Services.Notifications
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Log connection details
            Console.WriteLine($"Client connected: {Context.ConnectionId}, User: {userId ?? "unknown"}");
            
            if (!string.IsNullOrEmpty(userId))
            {
                var groupName = $"user-{userId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                Console.WriteLine($"Added connection {Context.ConnectionId} to group {groupName}");
            }
            else
            {
                Console.WriteLine($"Connection {Context.ConnectionId} has no user identifier");
            }
            
            await base.OnConnectedAsync();
        }
        
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}, User: {userId ?? "unknown"}, Exception: {exception?.Message ?? "none"}");
            
            if (!string.IsNullOrEmpty(userId))
            {
                var groupName = $"user-{userId}";
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                Console.WriteLine($"Removed connection {Context.ConnectionId} from group {groupName}");
            }
            
            await base.OnDisconnectedAsync(exception);
        }
        
        // Add this method to match the client-side call
        public async Task JoinUserGroup(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("Attempt to join empty userId group");
                return;
            }
            
            var groupName = $"user-{userId}";
            Console.WriteLine($"Manually adding connection {Context.ConnectionId} to group {groupName}");
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}