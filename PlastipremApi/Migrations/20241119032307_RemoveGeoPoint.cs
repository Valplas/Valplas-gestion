using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGeoPoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Geopoints_ClientPointId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "Geopoints");

            migrationBuilder.DropIndex(
                name: "IX_Clients_ClientPointId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "ClientPointId",
                table: "Clients");

            migrationBuilder.AddColumn<string>(
                name: "ClientPoint",
                table: "Clients",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientPoint",
                table: "Clients");

            migrationBuilder.AddColumn<int>(
                name: "ClientPointId",
                table: "Clients",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Geopoints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Geopoints", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_ClientPointId",
                table: "Clients",
                column: "ClientPointId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Geopoints_ClientPointId",
                table: "Clients",
                column: "ClientPointId",
                principalTable: "Geopoints",
                principalColumn: "Id");
        }
    }
}
