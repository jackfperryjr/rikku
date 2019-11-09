using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class AddMoreReactions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IsDisliked",
                table: "Messages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IsLaughed",
                table: "Messages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IsSaddened",
                table: "Messages",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDisliked",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "IsLaughed",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "IsSaddened",
                table: "Messages");
        }
    }
}
