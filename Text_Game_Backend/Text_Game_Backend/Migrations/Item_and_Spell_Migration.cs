using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Text_Game_Backend.Migrations

{
    public class Item_and_Spell_Migration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Spells",
                columns: table => new
                {
                    SpellID = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1,1"),
                    SpellName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpellType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RollModifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpellDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpellEffect = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectQuantity = table.Column<int>(type: "int", nullable: false),
                    SpellOwner = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spells", x => x.SpellID);
                    table.ForeignKey(
                        name: "FK_Spells_PCs_PCID",
                        column: x => x.SpellOwner,
                        principalTable: "PCs",
                        principalColumn: "PCID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                    ItemName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageID = table.Column<int>(type: "int", nullable: false),
                    ItemDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ItemQuantity = table.Column<int>(type: "int", nullable: false),
                    ItemOwner = table.Column<int>(type: "int", nullable: false)
                },
                             constraints: table =>
                             {
                                 table.PrimaryKey("PK_Items", x => x.ItemID);
                                 table.ForeignKey(
                                     name: "FK_Items_PCs_PCID",
                                     column: x => x.ItemOwner,
                                     principalTable: "PCs",
                                     principalColumn: "PCID",
                                     onDelete: ReferentialAction.Cascade);
                             });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Spells");
            migrationBuilder.DropTable(
                name: "Items");
        }
    }
}
