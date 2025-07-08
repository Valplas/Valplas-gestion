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
public async Task<IEnumerable<ProductSalesSummaryDto>> GetDailySalesByListPrice(DateTime date)
{
    var dayStart = date.Date;
    var dayEnd = dayStart.AddDays(1);

    var result = await _context.OrderProducts
        .Include(op => op.Order)
        .Include(op => op.ListPrice)
        .Where(op => !op.Order.IsDeleted && op.Order.OrderDate >= dayStart && op.Order.OrderDate < dayEnd)
        .GroupBy(op => new { op.ListPriceID, op.ListPrice.Name })
        .Select(g => new ProductSalesSummaryDto
        {
            ListPriceID = g.Key.ListPriceID,
            ListPriceName = g.Key.Name,
            TotalQuantity = g.Sum(op => op.Quantity),
            TotalRevenue = g.Sum(op => op.Revenue),
            TotalCost = g.Sum(op => op.CostPrice * op.Quantity)
        })
        .ToListAsync();

    return result;
}


    // // Obtener un accountabilitye por su ID
    // public async Task<AccountabilityModel?> GetById(Guid id)
    // {
    //     return await _context.Accountabilitys.AsNoTracking().FirstOrDefaultAsync(c => c.AccountabilityID == id);
    // }


}