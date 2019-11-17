using System;
using System.IO;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Rikku.Data;

namespace Rikku.Areas.Identity.Pages.Account.Manage
{
    [Authorize]
    [ValidateAntiForgeryToken]
    public partial class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private IConfiguration _configuration;
        

        public IndexModel(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public bool IsEmailConfirmed { get; set; }

        [TempData]
        public string StatusMessage { get; set; }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required]
            public string UserName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string ZipCode { get; set; }
            public DateTime BirthDate { get; set; }
            public string Age { get; set; }
            public string Picture { get; set; }
            public string Wallpaper { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Phone]
            [Display(Name = "Phone number")]
            public string PhoneNumber { get; set; }
            public string Profile { get; set; }
        }

        public async Task<IActionResult> OnGetAsync()
        {
            //ViewData["MessageCount"] = GetMessageCount();
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            Input = new InputModel
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                City = user.City,
                State = user.State,
                ZipCode = user.ZipCode,
                BirthDate = user.BirthDate,
                Age = user.Age,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Profile = user.Profile,
                Picture = user.Picture,
                Wallpaper = user.Wallpaper

            };

            IsEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (Input.UserName != user.UserName)
            {
                user.UserName = Input.UserName;
            }

            if (Input.FirstName != user.FirstName)
            {
                user.FirstName = Input.FirstName;
            }

            if (Input.LastName != user.LastName)
            {
                user.LastName = Input.LastName;
            }

            if (Input.City != user.City)
            {
                user.City = Input.City;
            }

            if (Input.State != user.State)
            {
                user.State = Input.State;
            }

            if (Input.ZipCode != user.ZipCode)
            {
                user.ZipCode = Input.ZipCode;
            }

            if (Input.BirthDate != user.BirthDate)
            {
                user.BirthDate = Input.BirthDate;
            }

            if (Input.Age != user.Age)
            {
                user.Age = Input.Age;
            }

            if (Input.Profile != user.Profile)
            {
                user.Profile = Input.Profile;
            }

            var email = await _userManager.GetEmailAsync(user);
            if (Input.Email != email)
            {
                var setEmailResult = await _userManager.SetEmailAsync(user, Input.Email);
                if (!setEmailResult.Succeeded)
                {
                    var userId = await _userManager.GetUserIdAsync(user);
                    throw new InvalidOperationException($"Unexpected error occurred setting email for user with ID '{userId}'.");
                }
            }

            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (Input.PhoneNumber != phoneNumber)
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    var userId = await _userManager.GetUserIdAsync(user);
                    throw new InvalidOperationException($"Unexpected error occurred setting phone number for user with ID '{userId}'.");
                }
            }

            var account = _configuration["StorageConfig:AccountName"];
            var key = _configuration["StorageConfig:AccountKey"];
            var storageCredentials = new StorageCredentials(account, key);
            var cloudStorageAccount = new CloudStorageAccount(storageCredentials, true);
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            var container = cloudBlobClient.GetContainerReference("images");
            await container.CreateIfNotExistsAsync();

            if (Input.Picture != user.Picture)
            {
                var files = HttpContext.Request.Form.Files;

                if (files.Count != 0) 
                {
                    for (var i = 0; i < files.Count; i++)
                    {
                        if (files[i].Name == "picture")
                        {
                            //var extension = Path.GetExtension(files[i].FileName);
                            var newBlob = container.GetBlockBlobReference("User-" + user.Id + ".png");

                            using (var filestream = new MemoryStream())
                            {   
                                files[i].CopyTo(filestream);
                                filestream.Position = 0;
                                await newBlob.UploadFromStreamAsync(filestream);
                            }
                            user.Picture = "https://rikku.blob.core.windows.net/images/User-" + user.Id + ".png";
                        }
                    }
                }
            }

            if (Input.Wallpaper != user.Wallpaper)
            {
                var files = HttpContext.Request.Form.Files;

                if (files.Count != 0) 
                {
                    for (var i = 0; i < files.Count; i++)
                    {
                        if (files[i].Name == "wallpaper")
                        {
                            //var extension = Path.GetExtension(files[i].FileName);
                            var newBlob = container.GetBlockBlobReference("User-Wallpaper-" + user.Id + ".jpg");

                            using (var filestream = new MemoryStream())
                            {   
                                files[i].CopyTo(filestream);
                                filestream.Position = 0;
                                await newBlob.UploadFromStreamAsync(filestream);
                            }
                            user.Wallpaper = "https://rikku.blob.core.windows.net/images/User-Wallpaper-" + user.Id + ".jpg";
                        }
                    }
                }
            }
            
            await _userManager.UpdateAsync(user);
            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Your profile has been updated!";
            return RedirectToPage();
        }

        public int GetMessageCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var count = (from message in _context.Messages
                                    select new
                                    {
                                        MessageId = message.MessageId,
                                        ReceiverId = message.ReceiverId,
                                        SenderId = message.SenderId,
                                        CreateDate = message.CreateDate,
                                        MessageReadFlg = message.MessageReadFlg
                                    }).Where(m => (m.ReceiverId == userId )&& (m.MessageReadFlg == 0)).Count(); 
            return count;
        }
    }
}
