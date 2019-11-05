using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class NewMessageColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_MessageSenderId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_MessageSenderId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "MessageSenderId",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "IsLiked",
                table: "Messages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IsLoved",
                table: "Messages",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLiked",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "IsLoved",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "MessageSenderId",
                table: "Messages",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MessageSenderId",
                table: "Messages",
                column: "MessageSenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_MessageSenderId",
                table: "Messages",
                column: "MessageSenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
