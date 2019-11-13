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
        [HttpPost]
        public async Task<ActionResult<ResponseModel>> Add([FromBody] ResponseModel response) 
        { 
            _context.Responses.Add(response);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}