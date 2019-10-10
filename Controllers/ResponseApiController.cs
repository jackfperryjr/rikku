using System;
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
            // This is arbitrary and means nothing right now.
            var responses = from r in _context.Responses select r;
            responses = responses.OrderBy(r => r.UserId);
            return responses.ToList();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<ResponseModel>> Get(string id) 
        { 
            var userId = id;
            // var response = (from r in _context.Responses select r).Where(r => r.UserId == userId);
           
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