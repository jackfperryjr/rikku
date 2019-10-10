using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Rikku.Data;
using Rikku.Models;

namespace Rikku.Controllers
{
    public class ResponseApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResponseApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public List<ResponseModel> GetAll()
        {
            // This means nothing right now.
            var responses = from r in _context.Responses select r;
            responses = responses.OrderBy(r => r.UserId);
            return responses.ToList();
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<ResponseModel> Get(string id) 
        { 
            // This means nothing right now.
            var userId = id;           
            var responses = (from r in _context.Responses select r).Where(r => r.UserId == userId);
            var response = responses.FirstOrDefault();

            if (response == null)
            {
                return NotFound();
            }

            return response;
        }  

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<ResponseModel>> Add([FromBody] ResponseModel response) 
        { 
            _context.Responses.Add(response);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}