using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System;

namespace Rikku.Data
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        public string Age { get; set; }
        public string Picture { get; set; }
        public string Wallpaper { get; set; }
        [MaxLength(255)]
        public string Profile { get; set; }
        public string RoleName { get; set; }
    }
}
