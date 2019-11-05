using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Rikku.Models;
using Rikku.Data;

namespace Rikku.Controllers
{

    [Authorize]
    public class ApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public ApiController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        [Authorize(Roles="Admin")]
        public List<ApplicationUser> GetAdmin()
        {
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
                        
            // if (!String.IsNullOrEmpty(searchString))
            // {
            //     searchString = searchString.ToLower();
            //     users = users.Where(u => {
            //                                 try 
            //                                 {
            //                                     return u.UserName.Contains(searchString)
            //                                     || u.City.ToLower().Contains(searchString)
            //                                     || u.ZipCode.Contains(searchString);
            //                                 }
            //                                 catch
            //                                 {
            //                                     return false;
            //                                 }
            //                             }
            //                         ); 
            // }

            return users.ToList();  
        }

        [HttpPost]
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
            return Ok();
        }

        [HttpDelete]
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
            return Ok();
        }

        [HttpGet]
        public int GetMessageCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var count = (from m in _context.Messages
                                    select new
                                    {
                                        MessageId = m.MessageId,
                                        ReceiverId = m.ReceiverId,
                                        SenderId = m.SenderId,
                                        CreateDate = m.CreateDate,
                                        MessageReadFlg = m.MessageReadFlg
                                    }).Where(m => (m.ReceiverId == userId )&& (m.MessageReadFlg == 0)).Count(); 
            return count;
        }

        [HttpGet]
        public int IsFriend(string id)
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

            if (friends.Any(c => c.Id == id))
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }

        [HttpPost]
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

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFriend(string id)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friend = await _context.Friends.SingleOrDefaultAsync(f => (f.FriendId == id) && (f.UserId == userId));
            _context.Friends.Remove(friend);
             await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public List<ApplicationUserViewModel> GetUsers()
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var users = (from user in _context.Users  
                        select new  
                        {  
                            Id = user.Id,    
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
                        .Select(u => new ApplicationUserViewModel()  
                        {  
                            UserId = u.Id,  
                            UserName = u.UserName,
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            ZipCode = u.ZipCode,
                            Profile = u.Profile,
                            IsFriendFlg = 0
                        }).Where(u => u.UserId != userId);   

            return users.ToList(); 
        }

        [HttpGet]
        public List<ApplicationUserViewModel> GetFriends()
        {
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
                            UserId = u.UserId,
                            UserName = u.UserName,
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            ZipCode = u.ZipCode
                        });  
            
            return friends.ToList();
        }

        [HttpGet]
        public List<ApplicationUserViewModel> GetMessages()
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var deleted = _context.Messages.Where(m => (m.DeletedBy1 != userId) || (m.DeletedBy2 != userId));

            var messages = (from user in _context.Users  
                        join m in _context.Messages on user.Id equals m.SenderId
                        select new  
                        {  
                            UserId = user.Id,  
                            ReceiverId = m.ReceiverId,  
                            SenderId = m.SenderId,  
                            UserName = user.UserName,                                    
                            FirstName = user.FirstName,  
                            LastName = user.LastName,
                            Picture = user.Picture,
                            Email = user.Email,
                            City = user.City,
                            State = user.State,
                            CreateDate = m.CreateDate,
                            MessageReadFlg = m.MessageReadFlg,
                            Content = m.Content,
                            DeletedBy1 = m.DeletedBy1,
                            DeletedBy2 = m.DeletedBy2
                        })
                        .Where(m => (m.ReceiverId == userId) || (m.SenderId == userId))
                        .Where(m => (m.DeletedBy1 != userId) || (m.DeletedBy2 != userId))
                        .ToList().OrderByDescending(m => m.CreateDate)
                        .Select(u => new ApplicationUserViewModel()  
                        {  
                            Id = u.UserId,
                            UserName = u.UserName, 
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            CreateDate = u.CreateDate,
                            MessageReadFlg = u.MessageReadFlg,
                            Content = u.Content,
                            DeletedBy1 = u.DeletedBy1,
                            DeletedBy2 = u.DeletedBy2
                        })
                        .Where(m => m.Id != userId)
                        .Where(m => (m.DeletedBy1 != userId) || (m.DeletedBy2 != userId))
                        .GroupBy(u => u.Id)
                        .Select(u => u.FirstOrDefault());  

            return messages.ToList();
        }

        [HttpDelete]
        public IActionResult DeleteMessage(string id)
        {    
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            foreach (MessageModel message in _context.Messages.Where(c => (c.ReceiverId == id && c.SenderId == userId.ToString()) || 
            (c.ReceiverId == userId.ToString() && c.SenderId == id)))
            {
                if (message.DeletedBy1 == null || message.DeletedBy1 != userId.ToString())
                {
                    message.DeletedBy1 = userId.ToString();
                }
                else 
                {
                    message.DeletedBy2 = userId.ToString();
                }
                message.MessageReadFlg = 1;
            }
            
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet]
        public List<MessageModel> GetChat(string id)
        {    
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var messages = (from message in _context.Messages
                            select new   
                            { 
                                MessageId = message.MessageId,
                                UserId = message.UserId,
                                SenderId = message.SenderId,
                                ReceiverId = message.ReceiverId,
                                Content = message.Content,
                                CreateDate = message.CreateDate,
                                DeletedBy1 = message.DeletedBy1,
                                DeletedBy2 = message.DeletedBy2
                            }).Select(m => new MessageModel()  
                            {  
                                MessageId = m.MessageId,
                                UserId = userId,
                                SenderId = m.SenderId,
                                ReceiverId = m.ReceiverId,
                                Content = m.Content,
                                CreateDate = m.CreateDate,
                                DeletedBy1 = m.DeletedBy1,
                                DeletedBy2 = m.DeletedBy2
                            })
                            .Where(c => ((c.ReceiverId == id && c.SenderId == userId.ToString()) &&
                                        (c.DeletedBy1 != userId || c.DeletedBy2 != userId)) || 
                                        ((c.ReceiverId == userId.ToString() && c.SenderId == id) && 
                                        (c.DeletedBy1 != userId || c.DeletedBy2 != userId)))
                            .OrderBy(c => c.MessageId);
            
            foreach (MessageModel message in _context.Messages.Where(c => c.ReceiverId == userId.ToString() && c.SenderId == id))
            {
                message.MessageReadFlg = 1;
            }
            
            _context.SaveChanges();
            return messages.ToList();
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(string id, string content, MessageModel message)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            var friend = await _userManager.FindByIdAsync(id);

            message.ReceiverId = id;
            message.Content = content;
            message.SenderId = userId;
            message.UserId = userId;
            var date = DateTime.Now;
            message.CreateDate = date.ToLocalTime();

            if (friend.RoleName == "SuperUser")
            {
                message.MessageReadFlg = 1;
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();
                return Ok(1);
            }
            else 
            {
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();
                return Ok(0);
            }
        }

        [HttpPost]
        public IActionResult SendResponse(string id)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            var responses = (from r in _context.Responses select r).Where(r => r.UserId == id);

            var contents = responses.Select(x => x.Content).ToArray();
            Random random = new Random();
            int index = random.Next(0, contents.Count());

            MessageModel message = new MessageModel();

            message.ReceiverId = userId;
            message.Content = contents[index];
            message.SenderId = id;
            message.UserId = id;
            var date = DateTime.Now;
            message.CreateDate = date.ToLocalTime();
            _context.Messages.Add(message);
            _context.SaveChanges();

            return Ok();
        }
    }
}