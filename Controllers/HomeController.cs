using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Rikku.Models;
using Rikku.Data;

namespace Rikku.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public HomeController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public IActionResult Index()
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            ViewBag.MessageCount = GetMessageCount();

            var users = (from user in _context.Users  
                        select new  
                        {  
                            UserId = user.Id,    
                            UserName = user.UserName,                                    
                            FirstName = user.FirstName,  
                            LastName = user.LastName,
                            Picture = user.Picture,
                            Email = user.Email,
                            City = user.City,
                            State = user.State,
                            ZipCode = user.ZipCode,
                            Profile = user.Profile
                        }).ToList()
                        .Select(u => new ApplicationUser()  
                        {  
                            Id = u.UserId,  
                            UserName = u.UserName,
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            ZipCode = u.ZipCode,
                            Profile = u.Profile
                        }).Where(u => u.Id != userId);  

            return View(users.ToList()); 
        }
        public IActionResult About()
        {
            return View();
        }

        [Authorize(Roles="Admin")]
        public IActionResult Admin(string searchString)
        {
            ViewBag.MessageCount = GetMessageCount();

            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var users = (from user in _context.Users  
                        select new  
                        {  
                            UserId = user.Id,    
                            UserName = user.UserName,                                    
                            FirstName = user.FirstName,  
                            LastName = user.LastName,
                            Picture = user.Picture,
                            Email = user.Email,
                            City = user.City,
                            State = user.State,
                            ZipCode = user.ZipCode,
                            RoleName = user.RoleName
                        }).ToList()
                        .Select(u => new ApplicationUser()  
                        {  
                            Id = u.UserId,  
                            UserName = u.UserName,
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            ZipCode = u.ZipCode,
                            RoleName = u.RoleName
                        }).Where(u => u.Id != userId);  
                        
            if (!String.IsNullOrEmpty(searchString))
            {
                searchString = searchString.ToLower();
                users = users.Where(u => {
                                            try 
                                            {
                                                return u.UserName.Contains(searchString)
                                                || u.City.ToLower().Contains(searchString)
                                                || u.ZipCode.Contains(searchString);
                                            }
                                            catch
                                            {
                                                return false;
                                            }
                                        }
                                    ); 
            }

            return View(users.ToList());  
        }

        [Authorize(Roles="Admin")]
        public async Task<IActionResult> EditUserRole(string id, int role)  
        { 
            var userRole = "";
            if (role == 1) 
            {
                userRole = "Admin";
            }
            else if (role == 2) 
            {
                userRole = "SuperUser";
            }
            else if (role == 4)
            {
                userRole = "Banned";
            }
            else if (role == 3)
            {
                userRole = "User";
            }

            if (id == null)
            {
                return NotFound();
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            await _userManager.RemoveFromRoleAsync(user, "Admin");
            await _userManager.RemoveFromRoleAsync(user, "SuperUser");
            await _userManager.RemoveFromRoleAsync(user, "Banned");
            await _userManager.RemoveFromRoleAsync(user, "User");

            if (role == 5) 
            {
                await DeleteUser(id);
            }
            else 
            {
                await _userManager.AddToRoleAsync(user, userRole);
                user.RoleName = userRole;
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Admin));
        }

        [Authorize(Roles="Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Home", "Admin");
        }

        [Authorize]
        public IActionResult Friends(string searchString)
        {
            ViewBag.MessageCount = GetMessageCount();

            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friends = (from user in _context.Users  
                        join f in _context.Friends on user.Id equals f.FriendId
                        select new  
                        {  
                            Id = user.Id,
                            UserId = f.UserId,
                            FriendId = f.FriendId,
                            UserName = user.UserName,                                    
                            FirstName = user.FirstName,  
                            LastName = user.LastName,
                            Picture = user.Picture,
                            Email = user.Email,
                            City = user.City,
                            State = user.State,
                            ZipCode = user.ZipCode
                        }).Where(u => userId == u.UserId).ToList()
                        .Select(u => new ApplicationUserViewModel()  
                        {  
                            Id = u.Id,  
                            UserName = u.UserName,
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            ZipCode = u.ZipCode
                        });  

            if (!String.IsNullOrEmpty(searchString))
            {
                searchString = searchString.ToLower();
                friends = friends.Where(u => {
                                            try 
                                            {
                                                return u.UserName.Contains(searchString)
                                                || u.City.ToLower().Contains(searchString)
                                                || u.ZipCode.Contains(searchString);
                                            }
                                            catch
                                            {
                                                return false;
                                            }
                                        }
                                    ); 
            }

            return View(friends.ToList()); 
        }

        [Authorize]
        public async Task<IActionResult> AddFriend(string id, FriendModel friend)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friends = (from u in _context.Users  
                                join f in _context.Friends on u.Id equals f.FriendId
                                select new  
                                {  
                                    Id = u.Id,
                                    UserId = f.UserId,
                                    FriendId = f.FriendId,
                                    UserName = u.UserName,                                    
                                    FirstName = u.FirstName,  
                                    LastName = u.LastName,
                                    Picture = u.Picture,
                                    Email = u.Email,
                                    City = u.City,
                                    State = u.State,
                                    ZipCode = u.ZipCode
                                }).Where(u => userId == u.UserId).ToList()
                                .Select(u => new ApplicationUserViewModel()  
                                {  
                                    Id = u.Id,  
                                    UserName = u.UserName,
                                    FirstName = u.FirstName, 
                                    LastName = u.LastName, 
                                    Picture = u.Picture,
                                    Email = u.Email,
                                    City = u.City,
                                    State = u.State,
                                    ZipCode = u.ZipCode
                                });  

            if (!friends.Any(c => c.Id == id))
            {
                friend.UserId = userId;
                friend.FriendId = id;
                _context.Friends.Add(friend);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("Friends");
        }

        [Authorize]
        public async Task<IActionResult> DeleteFriend(string id)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friend = await _context.Friends.SingleOrDefaultAsync(f => (f.FriendId == id) && (f.UserId == userId));
            _context.Friends.Remove(friend);
             await _context.SaveChangesAsync();

            return RedirectToAction("Friends");
        }
        
        [Authorize]
        public async Task<IActionResult> Profile(string id)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            ViewBag.MessageCount = GetMessageCount();
            
            var friends = (from u in _context.Users  
                                join f in _context.Friends on u.Id equals f.FriendId
                                select new  
                                {  
                                    Id = u.Id,
                                    UserId = f.UserId,
                                    FriendId = f.FriendId,
                                    UserName = u.UserName,                                    
                                    FirstName = u.FirstName,  
                                    LastName = u.LastName,
                                    Picture = u.Picture,
                                    Email = u.Email,
                                    City = u.City,
                                    State = u.State,
                                    ZipCode = u.ZipCode
                                }).Where(u => userId == u.UserId).ToList()
                                .Select(u => new ApplicationUserViewModel()  
                                {  
                                    Id = u.Id,  
                                    UserName = u.UserName,
                                    FirstName = u.FirstName, 
                                    LastName = u.LastName, 
                                    Picture = u.Picture,
                                    Email = u.Email,
                                    City = u.City,
                                    State = u.State,
                                    ZipCode = u.ZipCode
                                });  

            if (friends.Any(c => c.Id == id))
            {
                ViewBag.IsFriend = 1;
            }
            else 
            {
                ViewBag.IsFriend = 0;
            } 

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
 
            return View(user);        
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
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
