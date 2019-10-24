using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class NewColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeletedBy1",
                table: "Messages",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy2",
                table: "Messages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy1",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DeletedBy2",
                table: "Messages");
        }
    }
}
