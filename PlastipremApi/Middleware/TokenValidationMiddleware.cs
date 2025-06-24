using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly TokenValidationParameters _tokenValidationParameters;

    public TokenValidationMiddleware(RequestDelegate next, TokenValidationParameters tokenValidationParameters)
    {
        _next = next;
        _tokenValidationParameters = tokenValidationParameters;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var authorizationHeader = context.Request.Headers["Authorization"].FirstOrDefault();

        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Token no proporcionado o formato incorrecto.");
            return;
        }

        var token = authorizationHeader.Substring("Bearer ".Length);

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, _tokenValidationParameters, out _);
            context.User = principal; // Configurar el usuario autenticado en el contexto
        }
        catch (SecurityTokenExpiredException)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Token expirado.");
            return;
        }
        catch (Exception)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Token inválido.");
            return;
        }

        // Continuar con la ejecución del siguiente middleware
        await _next(context);
    }
}
