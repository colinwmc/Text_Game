using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Text_Game_Backend.Data;
//using Text_Game_Backend.DTO;
using Text_Game_Backend.Models;

namespace Text_Game_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PCController : Controller
    {
        private readonly TextGameDbContext _context;

        public PCController(TextGameDbContext context)
        {
            _context = context;
        }

        //Get: api/PCs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PC>>> GetPCs()
        {
            if(_context.PCs == null)
            {
                return NotFound();
            }
            return await _context.PCs.ToListAsync();
        }
    }
}
