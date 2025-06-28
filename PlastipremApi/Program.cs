using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Valplas.Data;
using Valplas.Services;
using Valplas.DTO;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine($"Entorno actual: {builder.Environment.EnvironmentName}");

// 1. Leer variables de entorno
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION");
var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
var url = Environment.GetEnvironmentVariable("URL") ?? "http://localhost";
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
var rawUrl = $"{url}:{port}";

// Asegurar esquema http:// o https://
var normalizedUrl = rawUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase)
    ? rawUrl
    : $"http://{rawUrl}";


// 2. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. DbContext
builder.Services.AddDbContext<ValplasContext>(options =>
    options.UseNpgsql(connectionString));

// 4. Servicios y Controladores
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProductModelService>();
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<OrderService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 5. JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = "https://accounts.google.com",
        ValidateAudience = true,
        ValidAudience = googleClientId,
        ValidateLifetime = true
    };
});

builder.Services.Configure<JwtSettings>(options =>
{
    var secret = builder.Configuration["JWT_SECRET"];
    if (string.IsNullOrEmpty(secret))
    {
        throw new InvalidOperationException("JWT_SECRET no está configurado.");
    }
    options.Secret = secret;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Valplas API. Ir a /swagger para ver la documentación.");

// 6. Usar URL desde entorno
app.Run(normalizedUrl);
