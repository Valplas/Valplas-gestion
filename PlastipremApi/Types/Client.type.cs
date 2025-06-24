
namespace Valplas.DTO
{
    public class ClientDTO
    {
        public string? BusinessName { get; set; } = string.Empty; // Razón social
        public string? Name { get; set; } = string.Empty; // Nombre
        public string District { get; set; } = string.Empty; // Partido
        public string City { get; set; } = string.Empty; // Localidad
        public string Address { get; set; } = string.Empty; // Dirección
        public string PhoneNumber { get; set; } = string.Empty; // Teléfono
        public string Email { get; set; } = string.Empty; // Mail
        public string TaxId { get; set; } = string.Empty; // CUIT
        public string Source { get; set; } = string.Empty; // Fuente
    }

}