using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Valplas.Models
{
    public enum BusinessName
    {
        Resmaprem,
        Valplas,
        // Agrega más nombres según sea necesario
    }

    public class ProductModel
    {
        [Key]
        public Guid ProductID { get; set; }
        public string? Name { get; set; } 
        public BusinessName? Business { get; set; }

        [MaxLength(500)] // Puedes ajustar el tamaño máximo
        public string? Description { get; set; }

        [MaxLength(255)] // Opcional, ajusta el tamaño según necesidad
        public string? Manufacturer { get; set; } = String.Empty;

        [Range(0, double.MaxValue)]
        public decimal? WeightKg { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Width { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Long { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Height { get; set; }

        [MaxLength(100)] // Opcional, ajusta según tus necesidades
        public string? Origin { get; set; } = String.Empty;

        public  long? Code { get; set; }

        public bool? Container { get; set; } = false; // Valor por defecto

        public Guid? ProductIDRelated { get; set; } // Relación a otro producto


        public int? Quantity { get; set; } = 0; // Valor por defecto

        // Propiedad de navegación para la relación muchos a muchos

        public bool IsDeleted { get; set; } = false;

        // Precio del producto en el momento de la orden
        public decimal CostPrice { get; set; }

        public ICollection<OrderProductModel> OrderProducts { get; set; } = new List<OrderProductModel>();

    }
}