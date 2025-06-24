

namespace Valplas.DTO
{
    public class NewOrderDTO
    {
        public Guid ClientID { get; set; } // ID del cliente que realiza la orden

        public string OrderedBy { get; set; } = string.Empty; // Persona que da de alta la orden

        public DateTime DeliveryDate { get; set; } // Fecha pactada para la entrega

        public DateTime RealDeliveryDate { get; set; } // Fecha real de entrega

        public string Schedules { get; set; } = string.Empty; // Horarios para la entrega

        public string Address { get; set; } = string.Empty; // Dirección asociada a la orden

        public string GeoPointAddress { get; set; } = string.Empty; // Punto geográfico asociado a la dirección

        public List<OrderProductDTO> OrderProducts { get; set; } = new List<OrderProductDTO>(); // Productos asociados a la orden
    }

    public class OrderProductDTO
    {
        public Guid ProductID { get; set; } // ID del producto
        public int Quantity { get; set; } // Cantidad del producto
        public decimal UnitaryPrice { get; set; } // Precio unitario del producto

    }
}