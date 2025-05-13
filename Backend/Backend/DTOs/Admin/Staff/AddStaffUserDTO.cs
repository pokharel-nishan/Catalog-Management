using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Admin.Staff
{
    public class AddStaffUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Address { get; set; }
    }
}
