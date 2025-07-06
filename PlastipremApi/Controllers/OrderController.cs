using Microsoft.AspNetCore.Mvc;
using Valplas.DTO;
using Valplas.Models;
using Valplas.Services;
using System.Text.Json;
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    // GET: api/Orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderModel>>> GetOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }
    // GET: api/Orders/id
    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<OrderModel>>> GetOrderById(Guid id)
    {
        var orders = await _orderService.GetOrderByIdAsync(id);
        if (orders == null)
        {
            return NotFound($"Orden con ID {id} no encontrado.");
        }
        return Ok(orders);
    }

    // POST: api/Orders
    [HttpPost]
    public async Task<ActionResult<OrderModel>> CreateOrder(NewOrderDTO newOrder)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(newOrder);
            return CreatedAtAction(nameof(GetOrders), new { id = order.OrderID }, order);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error al crear la orden", Error = ex.Message });
        }
    }

    // PUT: api/Orders/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] NewOrderDTO updatedOrder)
    {
    


    // Serializar el body a JSON para verlo completo
    var json = JsonSerializer.Serialize(updatedOrder, new JsonSerializerOptions { WriteIndented = true });

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var result = await _orderService.UpdateAsync(id, updatedOrder);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Orders/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var result = await _orderService.DeleteAsync(id);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();

    }


}
