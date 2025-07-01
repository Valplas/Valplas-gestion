using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Valplas.Data;
using Npgsql;
using CloudSql;

public class ValplasContextFactory : IDesignTimeDbContextFactory<ValplasContext>
{
    public ValplasContext CreateDbContext(string[] args)
    {
        // Intenta obtener la cadena completa desde DB_CONNECTION
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            // Si no está definida, usa la clase PostgreSqlTcp para construirla
            connectionString = PostgreSqlTcp.NewPostgreSqlTCPConnectionString().ToString();
        }

        var optionsBuilder = new DbContextOptionsBuilder<ValplasContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new ValplasContext(optionsBuilder.Options);
    }
}
