using Microsoft.EntityFrameworkCore;
using Valplas.Data;
using Valplas.DTO;
using Valplas.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Valplas.Services
{
    public class OrderService
    {
        private readonly ValplasContext _context;

        public OrderService(ValplasContext context)
        {
            _context = context;
        }


        public async Task<OrderModel> CreateOrderAsync(NewOrderDTO newOrder)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var orderID = Guid.NewGuid();
                // Validar si el cliente existe
                var client = await _context.Clients.FindAsync(newOrder.ClientID);
                if (client == null)
                {
                    throw new KeyNotFoundException("El cliente especificado no existe.");
                }

                decimal totalWeight = 0;
                // Validar si los productos existen y crear OrderProducts
                var orderProducts = newOrder.OrderProducts
     .Select(op =>
     {
         var product = _context.Products.FirstOrDefault(p => p.ProductID == op.ProductID);
         if (product == null)
         {
             throw new KeyNotFoundException($"El producto con ID {op.ProductID} no existe.");
         }

         // Validar stock suficiente
         if (product.Quantity < op.Quantity)
         {
             throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}. Disponible: {product.Quantity}, requerido: {op.Quantity}");
         }

         // Restar stock
         product.Quantity -= op.Quantity;

         totalWeight += (product.WeightKg ?? 0) * op.Quantity;
         return new OrderProductModel
         {
             ProductID = product.ProductID,
             Quantity = op.Quantity,
             UnitaryPrice = op.UnitaryPrice,
             Subtotal = op.Quantity * op.UnitaryPrice,
         };
     })
     .ToList();

                // Mapear NewOrderDTO a OrderModel
                var order = new OrderModel
                {
                    ClientID = newOrder.ClientID,
                    Client = client,
                    OrderedBy = newOrder.OrderedBy,
                    DeliveryDate = newOrder.DeliveryDate.ToUniversalTime(),
                    RealDeliveryDate = newOrder.RealDeliveryDate.ToUniversalTime(),
                    Schedules = newOrder.Schedules,
                    Address = newOrder.Address,
                    GeoPointAddress = newOrder.GeoPointAddress,
                    TotalAmount = newOrder.OrderProducts.Sum(op => op.Quantity * op.UnitaryPrice),
                    Amount = newOrder.OrderProducts.Sum(op => op.Quantity * op.UnitaryPrice),
                    Weight = totalWeight,
                    OrderProducts = orderProducts
                };

                // Guardar la orden en la base de datos
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Confirmar la transacción
                await transaction.CommitAsync();

                return order;
            }
            catch
            {
                // Revertir la transacción en caso de error
                await transaction.RollbackAsync();
                throw; // Rethrow para que el error sea manejado en un nivel superior
            }
        }


        /// <summary>
        /// Obtiene todas las órdenes con sus relaciones
        /// </summary>
        /// <returns>Lista de órdenes</returns>
        public async Task<List<OrderModel>> GetAllOrdersAsync()
        {
            return await _context.Orders
             .AsNoTracking() // Mejora el rendimiento y evita seguimiento innecesario
                .Include(o => o.Client) // Incluir cliente relacionado
                .Include(o => o.OrderProducts) // Incluir productos relacionados
                    .ThenInclude(op => op.Product) // Incluir detalles de cada producto
                .OrderByDescending(o => o.OrderNumber)
                .ToListAsync();
        }
        public async Task<OrderModel?> GetOrderByIdAsync(Guid id)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Client)
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.OrderID == id);
        }


        public async Task<List<OrderModel>> GetOrdersByClientIdAsync(Guid clientId)
        {
            return await _context.Orders
                .AsNoTracking() // Mejora el rendimiento y evita seguimiento innecesario
                .Where(o => o.ClientID == clientId) // Filtra por ClientID
                .Include(o => o.OrderProducts) // Incluir productos relacionados
                    .ThenInclude(op => op.Product) // Incluir detalles de cada producto
                .ToListAsync();
        }

public async Task<bool> UpdateAsync(Guid id, NewOrderDTO updatedOrder)
{
    using var transaction = await _context.Database.BeginTransactionAsync();

    var existingOrder = await _context.Orders
        .Include(o => o.OrderProducts)
        .FirstOrDefaultAsync(o => o.OrderID == id);

    if (existingOrder == null)
        return false;

    try
    {
        // 1. Revertir stock
        foreach (var oldOP in existingOrder.OrderProducts)
        {
            var product = await _context.Products.FindAsync(oldOP.ProductID);
            if (product != null)
                product.Quantity += oldOP.Quantity;
        }

        // 2. Validar nuevo stock
        decimal totalWeight = 0;
        foreach (var newOP in updatedOrder.OrderProducts)
        {
            var product = await _context.Products.FindAsync(newOP.ProductID);
            if (product == null)
                throw new KeyNotFoundException($"Producto con ID {newOP.ProductID} no existe.");

            if (product.Quantity < newOP.Quantity)
                throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}. Disponible: {product.Quantity}, requerido: {newOP.Quantity}");

            product.Quantity -= newOP.Quantity;
            totalWeight += (product.WeightKg ?? 0) * newOP.Quantity;
        }

        // 3. Actualizar campos principales
        existingOrder.OrderedBy = updatedOrder.OrderedBy;
        existingOrder.DeliveryDate = updatedOrder.DeliveryDate;
        existingOrder.RealDeliveryDate = updatedOrder.RealDeliveryDate;
        existingOrder.Schedules = updatedOrder.Schedules;
        existingOrder.Address = updatedOrder.Address;
        existingOrder.GeoPointAddress = updatedOrder.GeoPointAddress;
        existingOrder.Amount = updatedOrder.OrderProducts.Sum(op => op.Quantity * op.UnitaryPrice);
        existingOrder.TotalAmount = existingOrder.Amount;
        existingOrder.Weight = totalWeight;

        // 4. Eliminar y desvincular los productos anteriores
        _context.OrderProducts.RemoveRange(existingOrder.OrderProducts);
        await _context.SaveChangesAsync(); // obligatorio

        existingOrder.OrderProducts.Clear(); // desvincular en memoria

        // 5. Crear y agregar nuevos productos manualmente
        foreach (var op in updatedOrder.OrderProducts)
        {
            _context.OrderProducts.Add(new OrderProductModel
            {
                OrderID = existingOrder.OrderID,
                ProductID = op.ProductID,
                Quantity = op.Quantity,
                UnitaryPrice = op.UnitaryPrice,
                Subtotal = op.Quantity * op.UnitaryPrice
            });
        }

        _context.Orders.Update(existingOrder);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
        return true;
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}


        public async Task<bool> DeleteAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.OrderID == orderId);

            if (order == null)
                return false;

            // Restaurar stock si lo necesitás
            foreach (var op in order.OrderProducts)
            {
                var product = await _context.Products.FindAsync(op.ProductID);
                if (product != null)
                {
                    product.Quantity += op.Quantity;
                }
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
