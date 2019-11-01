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
            return View();
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
                                CreateDate = message.CreateDate,
                                DeletedBy1 = message.DeletedBy1,
                                DeletedBy2 = message.DeletedBy2
                            }).Select(m => new MessageModel()  
                            {  
                                MessageId = m.MessageId,
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

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
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
