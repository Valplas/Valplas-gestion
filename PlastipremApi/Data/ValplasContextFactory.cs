using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Valplas.Data;

public class ValplasContextFactory : IDesignTimeDbContextFactory<ValplasContext>
{
    public ValplasContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION")
            ?? throw new InvalidOperationException("DB_CONNECTION environment variable not set.");

        var optionsBuilder = new DbContextOptionsBuilder<ValplasContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new ValplasContext(optionsBuilder.Options);
    }
}
