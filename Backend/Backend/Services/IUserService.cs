namespace Backend.Services
{
    public interface IUserService
    {
        public Task<Guid> GetAdminIdAsync();
    }
}
