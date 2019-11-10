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
            return View(); 
        }
        
        public IActionResult About()
        {
            return View();
        }

        [Authorize(Roles="Admin")]
        public IActionResult Admin()
        {
            return View();  
        }

        [Authorize]
        public IActionResult Friends()
        {
            return View(); 
        }

        [Authorize]
        public async Task<IActionResult> Profile(string id)
        {
            var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
 
            return View(user);        
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
