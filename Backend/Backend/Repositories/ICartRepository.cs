using Backend.Entities;

namespace Backend.Repositories;

public interface ICartRepository
{
     Task<Cart> CreateCartAsync(Cart cart);
     Task<bool> CartExistsForUserAsync(Guid userId);
}