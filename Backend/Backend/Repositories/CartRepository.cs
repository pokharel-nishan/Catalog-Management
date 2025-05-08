using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class CartRepository: ICartRepository
{
    private readonly ApplicationDbContext _context;

    public CartRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Cart> CreateCartAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
        await _context.SaveChangesAsync();
        return cart;
    }
    
    public async Task<bool> CartExistsForUserAsync(Guid userId)
    {
        return await _context.Carts.AnyAsync(c => c.UserId == userId);
    }

    public async Task<CartBook> GetCartItemAsync(Guid cartId, Guid bookId)
    {
        return await _context.CartBooks
            .Include(cb => cb.Book)
            .FirstOrDefaultAsync(cb => cb.CartId == cartId && cb.BookId == bookId);
    }

    public async Task<Cart> GetCartByUserIdAsync(Guid userId)
    {
        return await _context.Carts
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }
    
    public async Task<IEnumerable<CartBook>> GetCartItemsAsync(Guid cartId)
    {
        return await _context.CartBooks
            .Include(cb => cb.Book)
            .Where(cb => cb.CartId == cartId)
            .ToListAsync();
    }

    public async Task<CartBook> AddBookToCartAsync(CartBook cartBook)
    {
        await _context.CartBooks.AddAsync(cartBook);
        await _context.SaveChangesAsync();
        return cartBook;
    }

    public async Task<bool> UpdateCartItemAsync(CartBook cartBook)
    {
        _context.CartBooks.Update(cartBook);
        return await _context.SaveChangesAsync() > 0;
    }
}