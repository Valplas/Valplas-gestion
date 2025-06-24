using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Valplas.Models
{


    public enum UserType
    {
        Owner,
        Admin,
        Seller,


    }


    public class UserModel

    {
        [Key] // Llave primaria
        public Guid UserID { get; set; } = Guid.NewGuid();

        public string? Name { get; set; }


        public required string Email { get; set; }

        public string? Phone { get; set; }
        public string? CommercialPhone { get; set; }

        public required string UserSalt { get; set; }

        public string? Password { get; set; }

        public UserType UserType { get; set; } = UserType.Seller;

        public required string Token { get; set; } = string.Empty;
    }


}