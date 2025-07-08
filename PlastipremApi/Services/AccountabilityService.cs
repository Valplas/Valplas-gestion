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
    }
public async Task<IEnumerable<ProductWithSalesDto>> GetDailySalesGroupedByProduct(DateTime date)
{
    var dayStart = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
    var dayEnd = dayStart.AddDays(1);

    // 1. Todas las combinaciones producto + lista
    var productListCombinations = await _context.Products
        .Where(p => !p.IsDeleted)
        .SelectMany(p => _context.ListPrices
            .Where(lp => !lp.IsDeleted)
            .Select(lp => new
            {
                p.ProductID,
                ProductName = p.Name ?? string.Empty,
                lp.ListPriceID,
                ListPriceName = lp.Name
            }))
        .ToListAsync();

    // 2. Ventas del día agrupadas por producto + lista
    var salesOfDay = await _context.OrderProducts
        .Include(op => op.Order)
        .Where(op => !op.Order.IsDeleted &&
                     op.Order.OrderDate >= dayStart &&
                     op.Order.OrderDate < dayEnd)
        .GroupBy(op => new { op.ProductID, op.ListPriceID })
        .Select(g => new
        {
            g.Key.ProductID,
            g.Key.ListPriceID,
            Quantity = g.Sum(op => op.Quantity),
            Revenue = g.Sum(op => op.Revenue),
            Cost = g.Sum(op => op.CostPrice * op.Quantity)
        })
        .ToListAsync();

    // 3. Agrupar por producto y llenar datos de cada lista
    var result = productListCombinations
        .GroupBy(x => new { x.ProductID, x.ProductName })
        .Select(g => new ProductWithSalesDto
{
    ProductID = g.Key.ProductID,
    ProductName = g.Key.ProductName,
    Stock = _context.Products
        .Where(p => p.ProductID == g.Key.ProductID)
        .Select(p => p.Quantity ?? 0)
        .FirstOrDefault(),

    CostPrice = _context.Products
        .Where(p => p.ProductID == g.Key.ProductID)
        .Select(p => p.CostPrice)
        .FirstOrDefault(),

    SalesByListPrice = g
        .Select(item =>
        {
            var sale = salesOfDay.FirstOrDefault(s =>
                s.ProductID == item.ProductID && s.ListPriceID == item.ListPriceID);

            return new ProductListPriceSalesDto
            {
                ListPriceID = item.ListPriceID,
                ListPriceName = item.ListPriceName,
                TotalQuantity = sale?.Quantity ?? 0,
                TotalRevenue = sale?.Revenue ?? 0,
                TotalCost = sale?.Cost ?? 0,
                 Margin = _context.ListPrices
                .Where(lp => lp.ListPriceID == item.ListPriceID)
                .Select(lp => lp.Margin)
                .FirstOrDefault()
            };
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