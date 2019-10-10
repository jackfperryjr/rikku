using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rikku.Migrations
{
    public partial class AddMessageReadFlg : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MessageReadFlg",
                table: "Messages",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MessageReadFlg",
                table: "Messages");
        }
    }
}
