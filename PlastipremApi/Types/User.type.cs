using Valplas.Models;

namespace Valplas.DTO
{
    public class UserDto
    {
        public Guid UserID { get; set; }
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CommercialPhone { get; set; }
        public UserType UserType { get; set; }
        public string Token { get; set; } = string.Empty;
    }

    public class CreateNewUserDTO
    {
        public required string Email { get; set; }
        public required UserType UserType { get; set; }
        public required string Token { get; set; }
        public required string UserSalt { get; set; }
    }

    public class UpdateUserDTO
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? CommercialPhone { get; set; }
        public string? Password { get; set; }
        public UserType? UserType { get; set; } // Opcional, solo actualizar si se proporciona
        public string? Token { get; set; }
    }
}