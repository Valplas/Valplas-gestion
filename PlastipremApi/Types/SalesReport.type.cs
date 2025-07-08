
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
        public decimal Margin { get; set; } // nuevo campo

        public string ListPriceName { get; set; } = string.Empty;
        public int TotalQuantity { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
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


}