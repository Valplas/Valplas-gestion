
using System.Text.Json.Serialization;

namespace Valplas.Models
{
    public class OrderProductModel
    {

        public Guid OrderID { get; set; }

        public OrderModel Order { get; set; } = null!;

        public  Guid ProductID { get; set; }

        public ProductModel Product {get; set; } = null!;

        // Cantidad de producto
        public int Quantity { get; set; }

        // Precio del producto en el momento de la orden
        public decimal UnitaryPrice { get; set; }

        // Subtotal (Cantidad x Precio)
        public decimal Subtotal { get; set; }
    }

}