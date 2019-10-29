using Microsoft.AspNetCore.Identity;
using System;

namespace Rikku.Models
{
    public class ApplicationUserViewModel : IdentityUser
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Picture { get; set; }
        public DateTime CreateDate { get; set; }
        public int MessageReadFlg { get; set; }
        public string Content { get; set; }
        public string Profile { get; set; }
        public string DeletedBy1 { get; set; }
        public string DeletedBy2 { get; set; }
        public int IsFriendFlg { get; set; }
    }
}
