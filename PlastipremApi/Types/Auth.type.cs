
namespace Valplas.DTO
{
    public class TokenDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Token { get; set; }
    }

    public class ValidateTokenDto
    {

        public string? Token { get; set; }
    }

    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
    }
}