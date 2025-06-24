using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrderRelationWithProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Orders_OrderModelOrderID",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_OrderModelOrderID",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OrderModelOrderID",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OrderModelOrderID",
                table: "Products",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_OrderModelOrderID",
                table: "Products",
                column: "OrderModelOrderID");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Orders_OrderModelOrderID",
                table: "Products",
                column: "OrderModelOrderID",
                principalTable: "Orders",
                principalColumn: "OrderID");
        }
    }
}
