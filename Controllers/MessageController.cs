using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Rikku.Models;
using Rikku.Data;

namespace Rikku.Controllers
{
    [Authorize]
    public class MessageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public MessageController(
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
            ViewBag.MessageCount = GetMessageCount();

            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var users = (from user in _context.Users  
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
                            Content = m.Content
                        }).Where(m => (userId == m.ReceiverId) || (userId == m.SenderId)).ToList().OrderByDescending(m => m.CreateDate)
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
                            Content = u.Content
                        });  
                        
            users = users.GroupBy(u => u.Id).Select(u => u.FirstOrDefault());
            return View(users.ToList());
        }

        public IActionResult Chat(string id)
        {    
            ViewBag.MessageCount = GetMessageCount();

            ViewBag.PictureId = id;
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var messages = (from message in _context.Messages
                            select new   
                            { 
                                MessageId = message.MessageId,
                                SenderId = message.SenderId,
                                ReceiverId = message.ReceiverId,
                                Content = message.Content,
                                CreateDate = message.CreateDate
                            }).Select(m => new MessageModel()  
                            {  
                                MessageId = m.MessageId,
                                SenderId = m.SenderId,
                                ReceiverId = m.ReceiverId,
                                Content = m.Content,
                                CreateDate = m.CreateDate
                            })
                            .Where(c => (c.ReceiverId == id && c.SenderId == userId.ToString()) || 
                                            (c.ReceiverId == userId.ToString() && c.SenderId == id))
                            .OrderBy(c => c.MessageId);
            
            foreach (MessageModel message in _context.Messages.Where(c => c.ReceiverId == userId.ToString() && c.SenderId == id))
            {
                message.MessageReadFlg = 1;
            }
            
            _context.SaveChanges();
            return View(messages.ToList());
        }

        public async Task<IActionResult> SendMessage(string id, string content, MessageModel message)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            var friend = await _userManager.FindByIdAsync(id);

            message.ReceiverId = id;
            message.Content = content;
            message.SenderId = userId;
            message.CreateDate = DateTime.Now;

            if (friend.RoleName == "SuperUser")
            {
                message.MessageReadFlg = 1;
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();
                SendResponse(id, userId);
            }
            else 
            {
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("Chat", new { id });
        }

        public IActionResult DeleteChat(string id)
        {    
            ViewBag.MessageCount = GetMessageCount();

            ViewBag.PictureId = id;
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var messages = (from message in _context.Messages
                            select new   
                            { 
                                MessageId = message.MessageId,
                                SenderId = message.SenderId,
                                ReceiverId = message.ReceiverId,
                                Content = message.Content,
                                CreateDate = message.CreateDate
                            }).Select(m => new MessageModel()  
                            {  
                                MessageId = m.MessageId,
                                SenderId = m.SenderId,
                                ReceiverId = m.ReceiverId,
                                Content = m.Content,
                                CreateDate = m.CreateDate
                            })
                            .Where(c => (c.ReceiverId == id && c.SenderId == userId.ToString()) || 
                                            (c.ReceiverId == userId.ToString() && c.SenderId == id))
                            .OrderBy(c => c.MessageId);
            
            foreach (MessageModel message in _context.Messages.Where(c => c.ReceiverId == userId.ToString() && c.SenderId == id))
            {
                _context.Messages.Remove(message);
            }
            
            _context.SaveChanges();
            return RedirectToAction("Index");
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

        public IActionResult SendResponse(string id, string userId)
        {
            var responses = (from r in _context.Responses select r).Where(r => r.UserId == id);

            var contents = responses.Select(x => x.Content).ToArray();
            Random random = new Random();
            int index = random.Next(0, contents.Count());

            MessageModel message = new MessageModel();

            message.ReceiverId = userId;
            message.Content = contents[index];
            message.SenderId = id;
            message.CreateDate = DateTime.Now;
            _context.Messages.Add(message);
            _context.SaveChanges();

            return Ok();
        }
    }
}
