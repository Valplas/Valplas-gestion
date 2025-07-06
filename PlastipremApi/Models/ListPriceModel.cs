
using System.Text.Json.Serialization;

namespace Valplas.Models
{
    public class ListPriceModel
    {

        public Guid ListPriceID { get; set; }

        // Nombre de la lista
        public string Name { get; set; } = "";

        // Margen asociado a la lista de precios
        public decimal Margin { get; set; }

        // Por si hubiera un descuento en la lista
        public decimal Discount { get; set; } = 0;

        public bool IsDeleted { get; set; } = false;

        
    public ICollection<OrderProductModel> OrderProducts { get; set;} = new List<OrderProductModel>();

    }

}