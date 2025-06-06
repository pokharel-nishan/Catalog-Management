using Backend.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend;

public class ApplicationDbContext : IdentityDbContext<User, Role, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
    {
        
    }
    
    public DbSet<Cart> Carts { get; set; }
    public DbSet<Book> Books { get; set; } 
    public DbSet<CartBook> CartBooks { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderBook> OrderBooks { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<BookmarkBook> BookmarkBooks { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Review> Reviews { get; set; }
}