namespace Text_Game_Backend.Models
{
    public class Spell
    {
        public long SpellId { get; set; }
        public string SpellName { get; set; }
        public string SpellType { get; set; } //attack roll or saving throw
        public string RollModifier { get; set; } //wis/int/etc
        public string SpellDescription { get; set; }
        public string SpellEffect { get; set; } //Heal/Damage/CC
        public int EffectQuantity { get; set; }

    }
}
