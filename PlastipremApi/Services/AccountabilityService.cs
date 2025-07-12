using Microsoft.EntityFrameworkCore;
using Valplas.Models;
using Valplas.Data;

using Valplas.DTO;
namespace Valplas.Services;

public class AccountabilityService
{
    private readonly ValplasContext _context;

    public AccountabilityService(ValplasContext context)
    {
        _context = context;
    }public async Task<IEnumerable<ProductWithSalesDto>> GetDailySalesGroupedByProduct(DateTime date)
{
    var dateOnly = date.Date;

    // Llamar directamente a la función con FromSqlInterpolated
    var flatResults = await _context.Set<ProductSalesFlatRow>()
        .FromSqlInterpolated($"select * from get_daily_sales_grouped_by_product({dateOnly})")
        .ToListAsync();

    // Agrupar y convertir al formato esperado por el frontend
    var result = flatResults
        .GroupBy(r => new { r.ProductID, r.ProductName, r.Stock, r.CostPrice })
        .Select(g => new ProductWithSalesDto
        {
            ProductID = g.Key.ProductID,
            ProductName = g.Key.ProductName,
            Stock = g.Key.Stock,
            CostPrice = g.Key.CostPrice,
            SalesByListPrice = g.Select(item => new ProductListPriceSalesDto
            {
                ListPriceID = item.ListPriceID,
                ListPriceName = item.ListPriceName,
                TotalQuantity = item.TotalQuantity,
                TotalRevenue = item.TotalRevenue,
                TotalCost = item.TotalCost,
                Margin = item.Margin
            })
            .OrderBy(lp => lp.ListPriceName)
            .ToList()
        })
        .OrderBy(p => p.ProductName)
        .ToList();

    return result;
}


    // // Obtener un accountabilitye por su ID
    // public async Task<AccountabilityModel?> GetById(Guid id)
    // {
    //     return await _context.Accountabilitys.AsNoTracking().FirstOrDefaultAsync(c => c.AccountabilityID == id);
    // }


}