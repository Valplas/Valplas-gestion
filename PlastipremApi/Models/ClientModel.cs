using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Valplas.Models;

public enum ClientType
{
    Individual,
    Business
}

public enum TaxCondition
{
    ConsumidorFinal,
    Monotributista,
    ResponsableInscripto
}

public class ClientModel
{
      [Key]
    [Required]
    public Guid ClientID { get; set; } = Guid.NewGuid();

    // clientName: z.string().optional()
    [MaxLength(50)]
    public string? ClientName { get; set; }

    // clientSurname: z.string().optional()
    [MaxLength(30)]
    public string? ClientSurname { get; set; }

    // clientType: z.enum(["0", "1"]).optional()
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ClientType? ClientType { get; set; }

    // clientNumber: z.any()  <-- permitido cualquier tipo, pero asumiendo que es numérico
    public decimal? ClientNumber { get; set; }

    // clientAddress: z.string().optional()
    [MaxLength(100)]
    public string? ClientAddress { get; set; }

    // clientLocality: z.string().optional()
    public string? ClientLocality { get; set; }

    // clientNotes: z.string().optional()
    public string? ClientNotes { get; set; }

    // clientWorkingHours: z.string().optional()
    public string? ClientWorkingHours { get; set; }

    // clientPoint: z.string().optional()
    public string? ClientPoint { get; set; }

    // clientPhone: z.string().optional()
    public string? ClientPhone { get; set; }

    // clientAlternativePhone: z.string().optional()
    public string? ClientAlternativePhone { get; set; }

    // clientEmail: z.string().optional()
    [EmailAddress]
    public string? ClientEmail { get; set; }

    // clientCUIT: z.string().optional()
    public string? ClientCUIT { get; set; }

    // clientTaxCondition: z.enum(["0", "1", "2"]).optional()
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TaxCondition? ClientTaxCondition { get; set; }

    // clientFont: z.string().optional()
    public string? ClientFont { get; set; }

    // clientDate: z.string().transform((str) => new Date(str)).optional()
    public DateTime? ClientDate { get; set; }
public bool IsDeleted { get; set; } = false;

    // Relación uno a muchos con OrdenDeCompra
    public ICollection<OrderModel> Orders { get; set;} = new List<OrderModel>();

}


