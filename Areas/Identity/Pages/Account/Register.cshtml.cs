using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Rikku.Data;
using Rikku.Models;

namespace Rikku.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class RegisterModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RegisterModel> _logger;


        public RegisterModel(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<RegisterModel> logger)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public string ReturnUrl { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "Email")]
            public string Email { get; set; }

            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            [Required]
            [Display(Name = "First name")]
            public string FirstName { get; set; }

            [Required]
            [Display(Name = "Birthdate")]
            public DateTime BirthDate { get; set; }

            public DateTime JoinDate { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }
        }

        public void OnGet(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            if (ModelState.IsValid)
            {
                ApplicationUser user; 

                var today = DateTime.Now;
                var age = today.Year - Input.BirthDate.Year;
                if (today.Month < Input.BirthDate.Month || ((today.Month == Input.BirthDate.Month) && (today.Day < Input.BirthDate.Day)))
                {
                    age--;
                }
                var ageString = age.ToString();

                user = new ApplicationUser 
                        { 
                            UserName = Input.UserName, 
                            Email = Input.Email, 
                            FirstName = Input.FirstName,
                            BirthDate = Input.BirthDate,
                            Age = ageString,
                            Picture = "/icons/default/default-picture.jpg",
                            Wallpaper = "/icons/default/default-wallpaper.jpg",
                            JoinDate = DateTime.Now
                        };
                

                var result = await _userManager.CreateAsync(user, Input.Password);

                var userId = user.Id;

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var users = _userManager.Users.ToList();

                    if (users.Count == 1) {
                        await _userManager.AddToRoleAsync(user, "Admin");
                        user.RoleName = "Admin";
                        await _userManager.UpdateAsync(user);
                    }
                    else 
                    {
                        await _userManager.AddToRoleAsync(user, "User");
                        user.RoleName = "User";
                        await _userManager.UpdateAsync(user);
                    }
                    
                    // Sending welcome message to a new user.
                    MessageModel message = new MessageModel();
                    message.ReceiverId = userId;
                    message.Content = "Hey! Welcome to the app. If you have any questions or suggestions reach out!";
                    message.SenderId = "e7f72e6a-5c23-4dcd-81e6-327c64177b95";
                    message.CreateDate = DateTime.Now;
                    _context.Messages.Add(message);
                    await _context.SaveChangesAsync();

                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return LocalRedirect(returnUrl);
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}
