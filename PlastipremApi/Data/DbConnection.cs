using Npgsql;
using System;

namespace CloudSql
{
    public class PostgreSqlTcp
    {
        public static NpgsqlConnectionStringBuilder NewPostgreSqlTCPConnectionString()
        {
            // Equivalent connection string:
            // "Uid=<DB_USER>;Pwd=<DB_PASS>;Host=<INSTANCE_HOST>;Database=<DB_NAME>;"
            var connectionString = new NpgsqlConnectionStringBuilder()
            {
                Host = Environment.GetEnvironmentVariable("INSTANCE_HOST") ?? "localhost",
                Username = Environment.GetEnvironmentVariable("DB_USER") ?? "postgres",
                Password = Environment.GetEnvironmentVariable("DB_PASS") ?? "postgres",
                Database = Environment.GetEnvironmentVariable("DB_NAME") ?? "postgres",
                SslMode = SslMode.Disable,
                Pooling = true
            };

            // Specify additional properties here.
            return connectionString;
        }
    }
}

