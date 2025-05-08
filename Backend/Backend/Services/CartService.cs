using Backend.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class CartService: ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
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
}