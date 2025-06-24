using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangesOrderAndOrderProductsModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProducts_Products_ProductID",
                table: "OrderProducts");

            migrationBuilder.DropColumn(
                name: "OrderProductID",
                table: "OrderProducts");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductModelProductID",
                table: "OrderProducts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_ProductModelProductID",
                table: "OrderProducts",
                column: "ProductModelProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProducts_Products_ProductID",
                table: "OrderProducts",
                column: "ProductID",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProducts_Products_ProductModelProductID",
                table: "OrderProducts",
                column: "ProductModelProductID",
                principalTable: "Products",
                principalColumn: "ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProducts_Products_ProductID",
                table: "OrderProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderProducts_Products_ProductModelProductID",
                table: "OrderProducts");

            migrationBuilder.DropIndex(
                name: "IX_OrderProducts_ProductModelProductID",
                table: "OrderProducts");

            migrationBuilder.DropColumn(
                name: "ProductModelProductID",
                table: "OrderProducts");

            migrationBuilder.AddColumn<int>(
                name: "OrderProductID",
                table: "OrderProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProducts_Products_ProductID",
                table: "OrderProducts",
                column: "ProductID",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
