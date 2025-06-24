using System;
using System.Security.Cryptography;
using System.Text;
using Valplas.Models;

namespace Valplas.Helpers
{
    public static class AuthHelper
    {
        /// <summary>
        /// Valida una contraseña comparándola con su hash almacenado.
        /// </summary>
        /// <param name="user">El usuario que contiene el hash y la sal almacenados.</param>
        /// <param name="password">La contraseña a validar.</param>
        /// <returns>True si la contraseña es válida, false en caso contrario.</returns>
        public static bool ValidatePassword(UserModel user, string password)
        {
            var hashedPassword = HashPassword(password, user.UserSalt);
            return user.Password == hashedPassword;
        }

        /// <summary>
        /// Genera una sal aleatoria en base64.
        /// </summary>
        /// <returns>Una cadena en base64 que representa la sal.</returns>
        public static string GenerateSalt()
        {
            var saltBytes = new byte[16];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(saltBytes);
            return Convert.ToBase64String(saltBytes);
        }

        /// <summary>
        /// Genera un hash seguro para la contraseña combinada con la sal.
        /// </summary>
        /// <param name="password">La contraseña en texto plano.</param>
        /// <param name="salt">La sal asociada a la contraseña.</param>
        /// <returns>Un hash en base64 de la contraseña salada.</returns>
        public static string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var saltedPassword = password + salt;
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            return Convert.ToBase64String(hashBytes);
        }
    }
}
