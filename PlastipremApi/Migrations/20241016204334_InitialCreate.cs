using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientID = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ClientSurname = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    ClientType = table.Column<int>(type: "integer", nullable: true),
                    ClientNumber = table.Column<decimal>(type: "numeric", nullable: false),
                    ClientAddress = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ClientLocality = table.Column<string>(type: "text", nullable: false),
                    ClientNotes = table.Column<string>(type: "text", nullable: true),
                    ClientWorkingHours = table.Column<string>(type: "text", nullable: false),
                    ClientPointId = table.Column<int>(type: "integer", nullable: true),
                    ClientPhone = table.Column<string>(type: "text", nullable: false),
                    ClientAlternativePhone = table.Column<string>(type: "text", nullable: true),
                    ClientEmail = table.Column<string>(type: "text", nullable: false),
                    ClientCUIT = table.Column<string>(type: "text", nullable: false),
                    ClientTaxCondition = table.Column<int>(type: "integer", nullable: false),
                    ClientFont = table.Column<string>(type: "text", nullable: true),
                    ClientDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientID);
                    table.ForeignKey(
                        name: "FK_Clients_Geopoints_ClientPointId",
                        column: x => x.ClientPointId,
                        principalTable: "Geopoints",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_ClientPointId",
                table: "Clients",
                column: "ClientPointId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Geopoints");
        }
    }
}
