using Backend.Entities;

namespace Backend.Services;

public interface ICartService
{ 
    Task<Cart> CreateCartForUserAsync(Guid userId);
}