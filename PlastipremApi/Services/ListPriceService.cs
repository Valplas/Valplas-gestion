using Microsoft.EntityFrameworkCore;
using Valplas.Models;
using Valplas.Data;

namespace Valplas.Services;

public class ListPriceService
{
    private readonly ValplasContext _context;

    public ListPriceService(ValplasContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<ListPriceModel>> GetAllAsync()
    {
        return await _context
        .ListPrices.AsNoTracking()
        .OrderBy(lp => lp.Margin)
        .ToListAsync();
    }

    // Obtener un ListPricee por su ID
    public async Task<ListPriceModel?> GetByIdAsync(Guid id)
    {
        return await _context.ListPrices.AsNoTracking().FirstOrDefaultAsync(lp => lp.ListPriceID == id);
    }


    // Crear un nuevo ListPricee
    public async Task<ListPriceModel> CreateAsync(ListPriceModel ListPrice)
    {
        ListPrice.ListPriceID = Guid.NewGuid(); // Genera un nuevo ID
        _context.ListPrices.Add(ListPrice);
        await _context.SaveChangesAsync();
        return ListPrice;
    }

    // Actualizar un ListPricee existente
    public async Task<bool> UpdateAsync(Guid id, ListPriceModel updatedListPrice)
    {
        var existingListPrice = await _context.ListPrices.FindAsync(id);
        if (existingListPrice == null)
        {
            return false;
        }

        existingListPrice.Name = updatedListPrice.Name;
        existingListPrice.Margin = updatedListPrice.Margin;
        existingListPrice.Discount = updatedListPrice.Discount;

        _context.Entry(existingListPrice).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    // Eliminar un ListPricee
    public async Task<bool> DeleteAsync(Guid id)
    {
        var ListPrice = await _context.ListPrices.FindAsync(id);
        if (ListPrice == null)
        {
            return false;
        }

        ListPrice.IsDeleted = true;
        _context.ListPrices.Update(ListPrice);
        await _context.SaveChangesAsync();

        return true;
    }
}