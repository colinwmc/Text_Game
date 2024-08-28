using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Text_Game_Backend.Models
{
    public class PC
    {
        public int PCID { get; set; }
        public string Name { get; set; }
        public string Species { get; set; }
        public string Gender { get; set; }
        public string Age { get; set; }
        public string Class { get; set; }
        public string Languages { get; set; }
        public string Abilities { get; set; }
        public string Weaknesses { get; set; }
        public int Charisma { get; set; }
        public int Intelligence { get; set; }
        public int Wisdom { get; set; }
        public int Strength { get; set; }
        public int Dexterity { get; set; }
        public int Constitution { get; set; }
        public int ArmorClass { get; set; }
        public int HP { get; set; }
        public string CharacterDescription { get; set; }
        
        public ICollection<Spell> Spells { get; set; }
      
        public ICollection<Item> Items { get; set; }


    }
}
