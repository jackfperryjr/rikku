using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Rikku.Models;

namespace Rikku.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<MessageModel> Messages { get; set; }
        public DbSet<ResponseModel> Responses { get; set; }
        public DbSet<FriendModel> Friends { get; set; }
        public DbSet<PictureModel> Pictures { get; set; }
        public DbSet<BlogModel> Blogs { get; set; }
    }
}
