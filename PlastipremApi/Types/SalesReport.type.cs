
namespace Valplas.DTO
{
    public class ProductSalesSummaryDto
    {
        public Guid ListPriceID { get; set; }
        public string ListPriceName { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalProfit => TotalRevenue - TotalCost;
        public int TotalQuantity { get; set; }
    }
}