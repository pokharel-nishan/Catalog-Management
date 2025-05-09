using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class CartService: ICartService
{
    private readonly ICartRepository _cartRepository;
private readonly IBookRepository _bookRepository;
    public CartService(ICartRepository cartRepository, IBookRepository bookRepository)
    {
        _cartRepository = cartRepository;
        _bookRepository = bookRepository;
        
    }
    public async Task<Cart> CreateCartForUserAsync(Guid userId)
    {
        if (await _cartRepository.CartExistsForUserAsync(userId))
        {
            throw new InvalidOperationException($"User {userId} already has a cart");
        }

        var cart = new Cart
        {
            UserId = userId,
            TotalQuantity = 0,
            TotalPrice = 0
        };

        return await _cartRepository.CreateCartAsync(cart);
    }
    
    public async Task<CartBook> AddBookToCartAsync(Guid userId, Guid bookId)
    {
        var cart = await _cartRepository.GetCartByUserIdAsync(userId);
        if (cart == null)
        {
            throw new KeyNotFoundException("Cart not found for the user");
        }

        var book = await _bookRepository.GetBookByIdAsync(bookId);
        if (book == null)
        {
            throw new KeyNotFoundException("Book not found");
        }

        // Check if book already exists in cart
        var existingCartItem = await _cartRepository.GetCartItemAsync(cart.Id, bookId);
        if (existingCartItem != null)
        {
            existingCartItem.Quantity = existingCartItem.Quantity;
            await _cartRepository.UpdateCartItemAsync(existingCartItem);
        }
        else
        {
            existingCartItem = new CartBook
            {
                CartId = cart.Id,
                BookId = bookId,
                Quantity = 1   // Add new cart item with quantity 1
            };
            await _cartRepository.AddBookToCartAsync(existingCartItem);
        }

        return existingCartItem;
    }

    public async Task<bool> UpdateCartItemQuantityAsync(Guid userId, Guid bookId, int newQuantity)
    {
        if (newQuantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than 0");
        }

        var cart = await _cartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return false;

        var cartItem = await _cartRepository.GetCartItemAsync(cart.Id, bookId);
        if (cartItem == null) return false;

        cartItem.Quantity = newQuantity;
        return await _cartRepository.UpdateCartItemAsync(cartItem);
    }
    
    public async Task<bool> RemoveItemFromCartAsync(Guid userId, Guid bookId)
    {
        var cart = await _cartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return false;

        return await _cartRepository.RemoveItemFromCartAsync(cart.Id, bookId);
    }
}

