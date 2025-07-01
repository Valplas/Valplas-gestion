using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;

using Valplas.DTO;
using Valplas.Models;
using Valplas.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Valplas.Controllers;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{

    UserService _service;

    private readonly JwtSettings _jwtSettings;
    public AuthController(UserService service, IOptions<JwtSettings> jwtSettings)
    {
        _service = service;
        _jwtSettings = jwtSettings.Value;
    }


    [HttpPost("createNewUser")]
    public async Task<ActionResult<UserDto?>> CreateNewUser([FromBody] EmailDto emailDto)
    {

        if (string.IsNullOrEmpty(emailDto.Email))
        {
            return BadRequest(new { Message = "El email no puede ser nulo o vacío." });
        }

          //  if (!Enum.IsDefined(typeof(UserType), emailDto.UserType))
          //{
          //    return BadRequest(new { Message = "UserType no válido" });
          //} 

        try
        {
            // Generar el token
            var tokenPayload = new
            {
                Email = emailDto.Email,
                UserType = UserType.Owner
            };
            var token = JWTHelper.Sign(tokenPayload, _jwtSettings.Secret);

            // Generar el salt y crear el usuario
            var salt = AuthHelper.GenerateSalt();
            var newUser = new CreateNewUserDTO
            {
                Email = emailDto.Email,
                UserType = UserType.Seller,
                Token = token,
                UserSalt = salt
            };

            // Intentar crear el usuario usando el servicio
            var user = await _service.CreateNewUser(newUser);

            if (user == null)
            {
                return StatusCode(500, new { Message = "Error al crear el usuario. Intente nuevamente más tarde." });
            }

            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            // Error específico manejado por el servicio, como email duplicado
            return Conflict(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            // Cualquier otro error inesperado
            return StatusCode(500, new { Message = "Ocurrió un error inesperado al crear el usuario.", Details = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto?>> Login([FromBody] TokenDto tokenDto)
    {
        try
        {
            // Validar si se está utilizando un token
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(tokenDto.Token) as JwtSecurityToken;
            if (jsonToken == null)
                return Unauthorized(new { Message = "Token inválido o no autorizado." });

            // Extraer el email del token
            var email = jsonToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            // validar el email
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { Message = "El token no contiene un email válido." });

            // Buscar el usuario por email
            UserDto? user = await _service.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
            var name = jsonToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value; ;

            var tokenPayload = new
            {
                Email = email,
                UserType = user.UserType
            };
            var newToken = JWTHelper.Sign(tokenPayload, _jwtSettings.Secret);

            user.Token = newToken;

            if (string.IsNullOrEmpty(user.Name) && !string.IsNullOrEmpty(name))
            {
                await _service.UpdateUser(user.Email, new UpdateUserDTO { Token = newToken, Name = name });
            }
            else
            {

                // Actualizar el usuario en la base de datos con el nuevo token
                await _service.UpdateUser(user.Email, new UpdateUserDTO { Token = newToken });
            }

            return Ok(user);

        }
        catch (InvalidOperationException ex)
        {
            // Manejar errores específicos del servicio, como problemas con la base de datos
            return StatusCode(500, new { Message = "Error al procesar la solicitud.", Details = ex.Message });
        }
        catch (Exception ex)
        {
            // Manejar cualquier otro error inesperado
            return StatusCode(500, new { Message = "Ocurrió un error inesperado.", Details = ex.Message });
        }
    }



    [HttpPost("validate")]
    public async Task<ActionResult<UserDto>> Validate([FromBody] ValidateTokenDto validateTokenDto)
    {
        if (string.IsNullOrWhiteSpace(validateTokenDto.Token))
        {
            return BadRequest(new { Message = "El token no puede estar vacío o nulo." });
        }

        var handler = new JwtSecurityTokenHandler();

        try
        {

            // Parámetros de validación
            var validationParameters = new TokenValidationParameters
            {
                ValidateLifetime = true,
                ValidateAudience = false, // Deshabilitar validación de audiencia
                ValidateIssuer = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret))
            };

            // Validar token
            var claimsPrincipal = handler.ValidateToken(validateTokenDto.Token, validationParameters, out _);
            var email = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { Message = "El token no contiene un email válido." });
            }

            // Buscar usuario
            var user = await _service.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }

            // Generar un nuevo token
            // Generar el token
            var tokenPayload = new
            {
                Email = user.Email,
                UserType = user.UserType
            };
            var newToken = JWTHelper.Sign(tokenPayload, _jwtSettings.Secret);

            // Actualizar el usuario en la base de datos con el nuevo token
            user.Token = newToken;
            await _service.UpdateUser(user.Email, new UpdateUserDTO { Token = newToken });

            // Devolver el usuario actualizado
            return Ok(user);
        }
        catch (SecurityTokenException ex)
        {
            return Unauthorized(new { Message = "Token inválido o no autorizado.", Details = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { Message = "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde." });
        }
    }


}
