using Backend.DTOs.User;
using Backend.Entities;

namespace Backend.Services;

public interface ICartService
{ 
    Task<IEnumerable<CartItemDTO>> GetCartItemsAsync(Guid userId);
    
    Task<Cart> CreateCartForUserAsync(Guid userId);
    
    Task<CartBook> AddBookToCartAsync(Guid userId, Guid bookId);

    Task<bool> UpdateCartItemQuantityAsync(Guid userId, Guid bookId, int newQuantity);

    Task<bool> RemoveItemFromCartAsync(Guid cartId, Guid bookId);

    Task<bool> ClearCartAsync(Guid cartId);

};