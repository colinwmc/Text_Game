using Microsoft.EntityFrameworkCore;
using Text_Game_Backend.Models;

namespace Text_Game_Backend.Data
{
    public class TextGameDbContext : DbContext
    {
        public TextGameDbContext(DbContextOptions<TextGameDbContext> options) : base(options)
        {

        }
        public DbSet<PC> PCs { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Spell> Spells { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Spell>()
                .HasOne<PC>(s => s.PC)
                .WithMany(p => p.Spells)
                .HasForeignKey(f => f.PCID);

            modelBuilder.Entity<Item>()
                .HasOne<PC>(s => s.PC)
                .WithMany(p => p.Items)
                .HasForeignKey(f => f.PCID);

            modelBuilder.Entity<PC>()
                .HasIndex(p => p.PCID)
                .IsUnique();
        }
    }

}
