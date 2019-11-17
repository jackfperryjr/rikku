using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class UpdatedUserTableAgain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IP",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "LoggedInCity",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoggedInCountry",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoggedInIP",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoggedInRegion",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoggedInCity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LoggedInCountry",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LoggedInIP",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LoggedInRegion",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "IP",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
