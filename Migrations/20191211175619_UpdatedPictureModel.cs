using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class UpdatedPictureModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PictureId",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "PicturePath",
                table: "Messages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PicturePath",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "PictureId",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
