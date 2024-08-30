using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Text_Game_Backend.Models
{
    public class Spell
    {
        public int SpellId { get; set; }
        public string SpellName { get; set; }
        public string SpellType { get; set; } //attack roll, saving throw, automatic
        public string RollModifier { get; set; } //wis/int/etc
        public string SpellDescription { get; set; }
        public string SpellEffect { get; set; } //Heal/Damage/CC
        public int EffectQuantity { get; set; }
        public int PCID { get; set; }
        public string Icon_URL { get; set; }
        [JsonIgnore]
        public virtual PC? PC { get; set; }
    }
}
