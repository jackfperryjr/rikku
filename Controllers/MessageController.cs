using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            ViewBag.Users = (from user in _context.Users  
                        select new  
                        {  
                            UserId = user.Id,   
                            UserName = user.UserName
                        })
                        .Distinct()
                        .Select(u => new ApplicationUser()  
                        {  
                            Id = u.UserId, 
                            UserName = u.UserName
                        })
                        .ToList();  

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
                            CreateDate = m.CreateDate
                        }).Where(m => (userId == m.ReceiverId) || (userId == m.SenderId)).ToList().OrderByDescending(m => m.CreateDate)
                        .Select(u => new ApplicationUserMessageViewModel()  
                        {  
                            Id = u.UserId, 
                            UserName = u.UserName, 
                            FirstName = u.FirstName, 
                            LastName = u.LastName, 
                            Picture = u.Picture,
                            Email = u.Email,
                            City = u.City,
                            State = u.State,
                            CreateDate = u.CreateDate
                        });  
                        
            //users = users.OrderBy(u => u.Email);
            users = users.GroupBy(u => u.Id).Select(u => u.FirstOrDefault());
            return View(users.ToList());
        }

        public IActionResult Chat(string id)
        {    
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
                            .OrderBy(c => c.CreateDate);

            return View(messages.ToList());
        }

        public IActionResult SendMessage(string id, string content, MessageModel message)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            message.ReceiverId = id;
            message.Content = content;
            message.SenderId = userId;
            message.CreateDate = DateTime.Now;

            _context.Messages.Add(message);
            _context.SaveChangesAsync();

            return RedirectToAction("Chat", new {id = id});
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
