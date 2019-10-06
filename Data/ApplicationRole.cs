using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace Rikku.Data
{
    public static class ApplicationRole
    {
        public static void CreateRoles(IServiceProvider serviceProvider, IConfiguration Configuration)
        {
            const string adminRoleName = "Admin";
            string[] roleNames = { adminRoleName, "SuperUser", "User", "Banned" };

            foreach (string roleName in roleNames)
            {
                CreateRole(serviceProvider, roleName);
            }
        }

        private static void CreateRole(IServiceProvider serviceProvider, string roleName)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            Task<bool> roleExists = roleManager.RoleExistsAsync(roleName);
            roleExists.Wait();

            if (!roleExists.Result)
            {
                Task<IdentityResult> roleResult = roleManager.CreateAsync(new IdentityRole(roleName));
                roleResult.Wait();
            }
        }
    }
}