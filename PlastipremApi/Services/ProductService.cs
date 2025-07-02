using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Valplas.Data;
using Valplas.Models;

public class ProductModelService
{
    private readonly ValplasContext _context;

    public ProductModelService(ValplasContext context)
    {
        _context = context;
    }

    // Buscar uno por ID
    public async Task<ProductModel?> GetByIdAsync(Guid productId)
    {
        try
        {
            return await _context.Products.FindAsync(productId);
        }
        catch (Exception ex)
        {
            // Log del error
            Console.Error.WriteLine($"Error al buscar producto por ID {productId}: {ex.Message}");
            throw new ApplicationException("Error al buscar el producto. Inténtalo más tarde.", ex);
        }
    }

    // Buscar todos con filtro opcional
    public async Task<IEnumerable<ProductModel>> GetAllAsync(string? search = null, BusinessName? business = null)
    {
        try
        {
            var query = _context.Products
    .Where(p => !p.IsDeleted)
    .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(p =>
                    (p.Description != null && p.Description.ToLower().Contains(search)) ||
                    (p.Name != null && p.Name.ToLower().Contains(search)) ||
                    (p.Manufacturer != null && p.Manufacturer.ToLower().Contains(search)) ||
                    (p.Origin != null && p.Origin.ToLower().Contains(search)) ||
                    (p.Code != null && p.Code.ToString().Contains(search))
                );
            }


            if (business.HasValue)
            {
                query = query.Where(p => p.Business == business);
            }

            // ✅ Ordenar por Name (A-Z), y luego por Description (A-Z)
            query = query
                .OrderBy(p => p.Name)
                .ThenBy(p => p.Description);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            // Log del error
            Console.Error.WriteLine($"Error al buscar productos: {ex.Message}");
            throw new ApplicationException("Error al buscar los productos. Inténtalo más tarde.", ex);
        }
    }

    // Crear un nuevo ProductModel
    public async Task<ProductModel> CreateAsync(ProductModel product)
    {
        try
        {
            product.ProductID = Guid.NewGuid();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        catch (DbUpdateException ex)
        {
            // Log del error específico de la base de datos
            Console.Error.WriteLine($"Error al crear producto: {ex.Message}");
            throw new ApplicationException("Error al guardar el producto. Verifica los datos e inténtalo nuevamente.", ex);
        }
        catch (Exception ex)
        {
            // Log de errores generales
            Console.Error.WriteLine($"Error inesperado al crear producto: {ex.Message}");
            throw new ApplicationException("Ocurrió un error inesperado al guardar el producto. Inténtalo más tarde.", ex);
        }
    }

    // Editar un ProductModel existente
    public async Task<bool> UpdateAsync(Guid productId, ProductModel updatedProductModel)
    {
        try
        {
            var existingProductModel = await _context.Products.FindAsync(productId);

            if (existingProductModel == null)
            {
                throw new KeyNotFoundException($"Producto con ID {productId} no encontrado.");
            }

            existingProductModel.Name = updatedProductModel.Name;
            existingProductModel.Description = updatedProductModel.Description;
            existingProductModel.Manufacturer = updatedProductModel.Manufacturer;
            existingProductModel.WeightKg = updatedProductModel.WeightKg;
            existingProductModel.Width = updatedProductModel.Width;
            existingProductModel.Long = updatedProductModel.Long;
            existingProductModel.Height = updatedProductModel.Height;
            existingProductModel.Origin = updatedProductModel.Origin;
            existingProductModel.Code = updatedProductModel.Code;
            existingProductModel.Container = updatedProductModel.Container;
            existingProductModel.Business = updatedProductModel.Business;
            existingProductModel.Quantity = updatedProductModel.Quantity;

            _context.Products.Update(existingProductModel);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (KeyNotFoundException ex)
        {
            Console.Error.WriteLine($"Error al actualizar producto: {ex.Message}");
            throw new ApplicationException("Producto no encontrado. No se puede actualizar.", ex);
        }
        catch (DbUpdateException ex)
        {
            Console.Error.WriteLine($"Error al actualizar producto: {ex.Message}");
            throw new ApplicationException("Error al actualizar el producto. Verifica los datos e inténtalo nuevamente.", ex);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error inesperado al actualizar producto: {ex.Message}");
            throw new ApplicationException("Ocurrió un error inesperado al actualizar el producto. Inténtalo más tarde.", ex);
        }
    }

    // Eliminar un ProductModel
    public async Task<bool> DeleteAsync(Guid productId)
    {
        try
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                throw new KeyNotFoundException($"Producto con ID {productId} no encontrado.");
            }

            product.IsDeleted = true;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (KeyNotFoundException ex)
        {
            Console.Error.WriteLine($"Error al eliminar producto: {ex.Message}");
            throw new ApplicationException("Producto no encontrado. No se puede eliminar.", ex);
        }
        catch (DbUpdateException ex)
        {
            Console.Error.WriteLine($"Error al eliminar producto: {ex.Message}");
            throw new ApplicationException("Error al eliminar el producto. Verifica dependencias e inténtalo nuevamente.", ex);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error inesperado al eliminar producto: {ex.Message}");
            throw new ApplicationException("Ocurrió un error inesperado al eliminar el producto. Inténtalo más tarde.", ex);
        }
    }
}
