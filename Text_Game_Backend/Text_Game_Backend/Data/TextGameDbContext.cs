using Microsoft.EntityFrameworkCore;
using Text_Game_Backend.Models;

namespace Text_Game_Backend.Data
{
    public class TextGameDbContext:DbContext
    {
        public TextGameDbContext(DbContextOptions<TextGameDbContext>options):base(options)
        { 
        
        }
        public DbSet<PC> PCs { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Spell> Spells { get; set; }
    }
    
}
