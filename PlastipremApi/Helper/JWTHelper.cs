using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace Valplas.Helpers
{
    public static class JWTHelper
    {

        private const int EXPIRES_IN_HOURS = 1; // Tiempo de expiración en horas

        // Método para verificar un token
        public static ClaimsPrincipal? Verify(string token, string secret)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(secret);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero // No tolerancia al tiempo de expiración
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                // Si falla la validación, retornamos null
                return null;
            }
        }

        // Método para decodificar un token sin verificar
        public static JwtSecurityToken? Decode(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.ReadToken(token) as JwtSecurityToken;
        }

        // Método para firmar un token
        public static string Sign(object payload, string secret)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secret);

            var claims = new List<Claim>();
            foreach (var property in payload.GetType().GetProperties())
            {
                var value = property.GetValue(payload)?.ToString();
                if (value != null)
                {
                    claims.Add(new Claim(property.Name, value));
                }
            }

            var expires = DateTime.UtcNow.AddHours(EXPIRES_IN_HOURS);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static string? GetClaim(string claimType, string token)
        {
            var decodedToken = Decode(token);
            return decodedToken?.Claims.FirstOrDefault(c => c.Type == claimType)?.Value;
        }
    }
}