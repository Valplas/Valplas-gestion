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
         var listPrice = _context.ListPrices.FirstOrDefault(lp => lp.ListPriceID == op.ListPriceID);
         if (product == null)
         {
             throw new KeyNotFoundException($"La lista de precio con ID {op.ListPriceID} no existe.");
         }
         // Validar stock suficiente
         if (product.Quantity < op.Quantity)
         {
             throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}. Disponible: {product.Quantity}, requerido: {op.Quantity}");
         }

         // Restar stock
         product.Quantity -= op.Quantity;

         totalWeight += (product.WeightKg ?? 0) * op.Quantity;
         var unitaryPrice = product.CostPrice * (1 + listPrice.Margin / 100);
         var subtotal = op.Quantity * unitaryPrice;
         var revenue = product.CostPrice * (listPrice.Margin / 100) * op.Quantity;


         return new OrderProductModel
         {
             ProductID = product.ProductID,
             Quantity = op.Quantity,
             UnitaryPrice = unitaryPrice,
             Subtotal = subtotal,
             ListPriceID = listPrice.ListPriceID,
             Revenue = revenue,
             CostPrice = product.CostPrice

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
                    TotalAmount = orderProducts.Sum(op => op.Quantity * op.UnitaryPrice),
                    Amount = orderProducts.Sum(op => op.Quantity * op.UnitaryPrice),
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
                .Include(o => o.OrderProducts) // Incluir productos relacionados
                    .ThenInclude(op => op.ListPrice) // Incluir detalles de cada producto
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

                .Include(o => o.OrderProducts) // Incluir productos relacionados
                    .ThenInclude(op => op.ListPrice) // Incluir detalles de cada producto
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

            try
            {
                // 1. Obtener orden existente con productos
                var existingOrder = await _context.Orders
                    .Include(o => o.OrderProducts)
                    .FirstOrDefaultAsync(o => o.OrderID == id);

                if (existingOrder == null)
                    return false;

                // 2. Revertir stock de productos anteriores
                foreach (var oldOP in existingOrder.OrderProducts)
                {
                    var product = await _context.Products.FindAsync(oldOP.ProductID);
                    if (product != null)
                        product.Quantity += oldOP.Quantity;
                }

                // 3. Eliminar productos anteriores
                _context.OrderProducts.RemoveRange(existingOrder.OrderProducts);
                await _context.SaveChangesAsync();
                existingOrder.OrderProducts.Clear();

                // 4. Validar cliente
                var client = await _context.Clients.FindAsync(updatedOrder.ClientID);
                if (client == null)
                    throw new KeyNotFoundException("El cliente especificado no existe.");

                // 5. Crear nuevos OrderProducts
                decimal totalWeight = 0;

                var newOrderProducts = updatedOrder.OrderProducts.Select(op =>
                {
                    var product = _context.Products.FirstOrDefault(p => p.ProductID == op.ProductID)
                                  ?? throw new KeyNotFoundException($"El producto con ID {op.ProductID} no existe.");

                    var listPrice = _context.ListPrices.FirstOrDefault(lp => lp.ListPriceID == op.ListPriceID)
                                    ?? throw new KeyNotFoundException($"La lista de precio con ID {op.ListPriceID} no existe.");

                    if (product.Quantity < op.Quantity)
                        throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}. Disponible: {product.Quantity}, requerido: {op.Quantity}");

                    product.Quantity -= op.Quantity;

                    totalWeight += (product.WeightKg ?? 0) * op.Quantity;

                    var unitaryPrice = product.CostPrice * (1 + listPrice.Margin / 100);

                    return new OrderProductModel
                    {
                        OrderID = id,
                        ProductID = product.ProductID,
                        Quantity = op.Quantity,
                        UnitaryPrice = unitaryPrice,
                        Subtotal = op.Quantity * unitaryPrice,
                        ListPriceID = listPrice.ListPriceID,
                        Revenue = product.CostPrice * (listPrice.Margin / 100) * op.Quantity,
                        CostPrice = product.CostPrice
                    };
                }).ToList();

                // 6. Actualizar campos de la orden
                existingOrder.ClientID = updatedOrder.ClientID;
                existingOrder.Client = client;
                existingOrder.OrderedBy = updatedOrder.OrderedBy;
                existingOrder.DeliveryDate = updatedOrder.DeliveryDate.ToUniversalTime();
                existingOrder.RealDeliveryDate = updatedOrder.RealDeliveryDate.ToUniversalTime();
                existingOrder.Schedules = updatedOrder.Schedules;
                existingOrder.Address = updatedOrder.Address;
                existingOrder.GeoPointAddress = updatedOrder.GeoPointAddress;
                existingOrder.TotalAmount = newOrderProducts.Sum(op => op.Subtotal);
                existingOrder.Amount = existingOrder.TotalAmount;
                existingOrder.Weight = totalWeight;
                existingOrder.OrderProducts = newOrderProducts;

                // 7. Guardar cambios
                _context.Orders.Update(existingOrder);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"❌ [ERROR UpdateAsync] {ex.Message}");
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
