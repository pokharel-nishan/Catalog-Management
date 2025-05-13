using Backend.Entities;

namespace Backend.Repositories;

public interface ICartRepository
{
     Task<Cart> CreateCartAsync(Cart cart);
     Task<bool> CartExistsForUserAsync(Guid userId);
     Task<Cart> GetCartByUserIdAsync(Guid userId);
     Task<CartBook> GetCartItemAsync(Guid cartId, Guid bookId);
     Task<CartBook> AddBookToCartAsync(CartBook cartBook);
     Task<bool> UpdateCartItemAsync(CartBook cartBook);
     Task<IEnumerable<CartBook>> GetCartItemsAsync(Guid cartId);
     Task<bool> RemoveItemFromCartAsync(Guid cartId, Guid bookId);
     Task<bool> ClearCartAsync(Guid cartId);


}