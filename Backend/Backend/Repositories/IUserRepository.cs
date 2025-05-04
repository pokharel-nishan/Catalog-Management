namespace Backend.Repositories
{
    public interface IUserRepository
    {
        public Task<Guid> GetAdminIdAsync();
    }
}
