using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Valplas.Data;
using Valplas.Models;
using Valplas.Helpers;

using Valplas.DTO;


//consultas a la db
public class UserService
{
    private readonly ValplasContext _context;

    public UserService(ValplasContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> GetUserByEmail(string email)
    {
        try
        {
            // Buscar el usuario por email
            var user = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new UserDto
                {
                    UserID = u.UserID,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    CommercialPhone = u.CommercialPhone,
                    UserType = u.UserType,
                    Token = u.Token
                })
                .SingleOrDefaultAsync();

            // Si no se encuentra un usuario, devolver null
            if (user == null)
            {
                Console.WriteLine($"Usuario no encontrado con el email: {email}");
                return null;
            }

            return user;
        }
        catch (DbUpdateException dbEx)
        {
            // Errores específicos de la base de datos
            Console.WriteLine($"Error de base de datos al buscar usuario por email: {dbEx.Message}");
            throw new InvalidOperationException("Error al consultar la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            // Cualquier otro error inesperado
            Console.WriteLine($"Error inesperado al buscar usuario por email: {ex.Message}");
            throw new Exception("Ocurrió un error inesperado al buscar el usuario.", ex);
        }
    }


    public async Task<UserDto?> CreateNewUser(CreateNewUserDTO newUser) //crear usuario
    {
        try
        {
            // Crear el modelo del usuario
            var userModel = new UserModel
            {
                Email = newUser.Email,
                UserType = newUser.UserType,
                Token = newUser.Token,
                UserSalt = newUser.UserSalt
            };

            // Agregar el usuario al contexto y guardar cambios
            _context.Users.Add(userModel);
            await _context.SaveChangesAsync();

            // Retornar el usuario creado como UserDto
            return await _context.Users
                .Where(u => u.Email == userModel.Email)
                .Select(u => new UserDto
                {
                    UserID = u.UserID,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    CommercialPhone = u.CommercialPhone,
                    UserType = u.UserType,
                    Token = u.Token
                })
                .SingleOrDefaultAsync();
        }
        catch (DbUpdateException dbEx)
        {
            // Manejar errores específicos de la base de datos (como claves duplicadas)
            Console.WriteLine($"Error de base de datos: {dbEx.Message}");
            throw new InvalidOperationException("No se pudo crear el usuario. Verifique que los datos sean correctos.", dbEx);
        }
        catch (Exception ex)
        {
            // Manejar cualquier otro error general
            Console.WriteLine($"Error inesperado: {ex.Message}");
            throw new Exception("Ocurrió un error inesperado al crear el usuario.", ex);
        }
    }

    public async Task<UserDto?> UpdateUser(string email, UpdateUserDTO updateUser)
    {
        try
        {
            // Buscar el usuario por email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                Console.WriteLine($"Usuario no encontrado con el email: {email}");
                return null;
            }

            // Actualizar los campos proporcionados
            if (!string.IsNullOrEmpty(updateUser.Name))
                user.Name = updateUser.Name;

            if (!string.IsNullOrEmpty(updateUser.Phone))
                user.Phone = updateUser.Phone;

            if (!string.IsNullOrEmpty(updateUser.CommercialPhone))
                user.CommercialPhone = updateUser.CommercialPhone;

            if (!string.IsNullOrEmpty(updateUser.Password))
            {
                // Hashear la nueva contraseña
                user.Password = AuthHelper.HashPassword(updateUser.Password, user.UserSalt);

            }

            if (updateUser.UserType.HasValue)
                user.UserType = updateUser.UserType.Value;

            if (!string.IsNullOrEmpty(updateUser.Token))
                user.Token = updateUser.Token;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            // Retornar el usuario actualizado como UserDto
            return new UserDto
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CommercialPhone = user.CommercialPhone,
                UserType = user.UserType,
                Token = user.Token
            };
        }
        catch (DbUpdateException dbEx)
        {
            // Manejar errores específicos de la base de datos
            Console.WriteLine($"Error de base de datos al actualizar el usuario: {dbEx.Message}");
            throw new InvalidOperationException("No se pudo actualizar el usuario. Verifique que los datos sean correctos.", dbEx);
        }
        catch (Exception ex)
        {
            // Manejar cualquier otro error general
            Console.WriteLine($"Error inesperado al actualizar el usuario: {ex.Message}");
            throw new Exception("Ocurrió un error inesperado al actualizar el usuario.", ex);
        }
    }

}
