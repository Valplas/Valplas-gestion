
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Valplas.Models
{
    public enum OrderStatusType
    {
        Entregado,
        EnReparto,
        Cancelado,
        EnPreparacion
    }
    public class OrderModel
    {
        public Guid OrderID { get; set; }

        // Relación uno a muchos con Cliente
        public Guid ClientID { get; set; }

        public ClientModel Client { get; set; } = null!;

        public decimal Total { get; set; }
        // Número de la orden

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderNumber { get; set; }

        // Estado de la orden
        public OrderStatusType OrderStatus { get; set; }

        // Persona que dio de alta la orden
        public string OrderedBy { get; set; } = String.Empty;

        // Fecha en que se dio de alta la orden
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // Fecha pactada para la entrega
        public DateTime DeliveryDate { get; set; }

        // Fecha real de la entrega
        public DateTime RealDeliveryDate { get; set; }

        // Horarios disponibles para la entrega
        public string Schedules { get; set; } = String.Empty;

        // Localidad asociada a la orden
        public string Address { get; set; } = String.Empty;

        public string GeoPointAddress { get; set; } = String.Empty;

        // Monto total de la orden
        public decimal Amount { get; set; }

        // Monto del remito
        public decimal TotalAmount { get; set; }

        // Monto a recibir
        public decimal AmountToBeReceived { get; set; }

        // Peso total en kilos
        public decimal Weight { get; set; }
        public bool IsDeleted { get; set; } = false;


        public ICollection<OrderProductModel> OrderProducts { get; set; } = new List<OrderProductModel>();
    }
}