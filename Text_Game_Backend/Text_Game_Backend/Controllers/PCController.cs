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
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<PC>>> GetPCs()
        //{
        //    if (_context.PCs == null)
        //    {
        //        return NotFound();
        //    }
        //    return await _context.PCs.ToListAsync();
        //}

        [HttpGet]

        public async Task<ActionResult<IEnumerable<PC>>> GetPCsWithExtras()
        {
            if (_context.PCs == null)
            {
                return NotFound();
            }
            var PCs = await _context.PCs.ToListAsync();

            if (PCs == null)
            {
                return NotFound();
            }

            PC[] PCList = new PC[3];

           // foreach (var PC in PCs)
           for(int i =0;i<3;i++)
            {
                var PC = PCs[i];
                var spells = await _context.Spells.Where(s => s.PCID == PC.PCID).ToListAsync();
                var items = await _context.Items.Where(i => i.PCID == PC.PCID).ToListAsync();
                var PCDTO = new PC
                {
                    PCID = PC.PCID,
                    Name = PC.Name,
                    Species = PC.Species,
                    Gender = PC.Gender,
                    Age = PC.Age,
                    Class = PC.Class,
                    Languages = PC.Languages,
                    Abilities = PC.Abilities,
                    Weaknesses = PC.Weaknesses,
                    Charisma = PC.Charisma,
                    Intelligence = PC.Intelligence,
                    Wisdom = PC.Wisdom,
                    Strength = PC.Strength,
                    Dexterity = PC.Dexterity,
                    Constitution = PC.Constitution,
                    ArmorClass = PC.ArmorClass,
                    HP = PC.HP,
                    CharacterDescription = PC.CharacterDescription,
                    Image_URL = PC.Image_URL,
                    Spells = spells,
                    Items = items

                };
                PCList[i] = PCDTO;
            }
            return Ok(PCList);
        }
    }
}
