using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Text_Game_Backend.Models
{
    public class Item
    {
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public int ImageID { get; set; }
        public string ItemDescription { get; set; }
        public int ItemQuantity { get; set; }
        public int PCID { get; set; }

        [JsonIgnore]
        public virtual PC? PC { get; set; }
    }
}
