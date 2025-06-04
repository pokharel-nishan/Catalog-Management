using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.SeedingScripts
{
    public class SeedRolesAndAdmin
    {
        public static async Task SeedRolesAndAdminAsync(RoleManager<Role> roleManager, UserManager<User> userManager)
        {
            // Create Roles
            string[] roles = ["Admin", "Staff", "Regular"];

            foreach (var role in roles)
            {
                // Check if role exists before creating
                var roleExists = await roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    var newRole = new Role
                    {
                        Name = role
                    };
                    var result = await roleManager.CreateAsync(newRole);
                    if (!result.Succeeded)
                    {
                        Console.WriteLine($"Failed to create role: {role}");
                    }
                }
            }

            // Seed Admin Details
            string adminUserName = "Admin";
            string adminFirstName = "Nishan";
            string adminLastName = "Pokharel";
            string adminAddress = "Kathmandu";
            string adminEmail = "admin@catalogmanagement.com";
            string adminPassword = "Admin@123";

            // Check if admin already exists before creating
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var user = new User
                {
                    FirstName = adminFirstName,
                    LastName = adminLastName,
                    UserName = adminUserName,
                    Address = adminAddress,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    DateJoined = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                };

                var result = await userManager.CreateAsync(user, adminPassword);
                if (result.Succeeded)
                {
                    // Assign user with "Admin" role
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
    }
}
