namespace Backend.Services;

public interface IBookmarkService
{
    Task<bool> ToggleBookmarkAsync(Guid userId, Guid bookId);

}