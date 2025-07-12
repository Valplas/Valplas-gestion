using System.ComponentModel.DataAnnotations.Schema;

namespace Valplas.DTO
{
    public class ProductSalesSummaryDto
    {
        public Guid ListPriceID { get; set; }
        public string ListPriceName { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalProfit => TotalRevenue - TotalCost;
        public

        int TotalQuantity
        { get; set; }
    }

    public class ProductSalesItemDto
    {
        public Guid ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int TotalQuantity { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalProfit => TotalRevenue - TotalCost;
    }

    public class ListPriceSalesDto
    {
        public Guid ListPriceID { get; set; }
        public string ListPriceName { get; set; } = string.Empty;
        public List<ProductSalesItemDto> Products { get; set; } = new();
    }

public class ProductListPriceSalesDto
{
    public Guid ListPriceID { get; set; }
    public string ListPriceName { get; set; }
    public long TotalQuantity { get; set; } // Cambiar de int a long si es necesario
    public decimal TotalRevenue { get; set; }
    public decimal Margin { get; set; }
}

    public class ProductWithSalesDto
    {
        public Guid ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;

        // Nuevos campos para la tabla
        public int Stock { get; set; }
        public decimal CostPrice { get; set; }

        public List<ProductListPriceSalesDto> SalesByListPrice { get; set; } = new();
    }

public class ProductSalesFlatRow
{
       [Column("product_id")]
    public Guid ProductID { get; set; }

    [Column("product_name")]
    public string ProductName { get; set; }

    [Column("stock")]
    public int Stock { get; set; }

    [Column("cost_price")]
    public decimal CostPrice { get; set; }

    [Column("list_price_id")]
    public Guid ListPriceID { get; set; }

    [Column("list_price_name")]
    public string ListPriceName { get; set; }

    [Column("total_quantity")]
    public long TotalQuantity { get; set; } // Cambiado de int a long para coincidir con bigint

    [Column("total_revenue")]
    public decimal TotalRevenue { get; set; }

    [Column("margin")]
    public decimal Margin { get; set; }
}



}