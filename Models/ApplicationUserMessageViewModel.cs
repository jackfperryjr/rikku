using Microsoft.AspNetCore.Identity;
using System;

namespace Rikku.Models
{
    public class ApplicationUserMessageViewModel : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Picture { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
