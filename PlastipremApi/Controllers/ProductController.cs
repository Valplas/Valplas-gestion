using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valplas.Models;
using Valplas.Services; // Asegúrate de que esta sea la ubicación correcta del servicio.

namespace Valplas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductModelService _productService;

        public ProductsController(ProductModelService productService)
        {
            _productService = productService;
        }

        // Obtener todos los productos con filtros opcionales
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] BusinessName? business)
        {
            try
            {
                var products = await _productService.GetAllAsync(search, business);
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Log del error (puedes reemplazar esto por un sistema de logging real)
                Console.Error.WriteLine($"Error al obtener productos: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al obtener los productos.");
            }
        }

        // Obtener un producto por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var product = await _productService.GetByIdAsync(id);

                if (product == null)
                {
                    return NotFound($"Producto con ID {id} no encontrado.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al obtener producto por ID: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al obtener el producto.");
            }
        }

        // Crear un nuevo producto
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductModel product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdProduct = await _productService.CreateAsync(product);
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductID }, createdProduct);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al crear producto: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al crear el producto.");
            }
        }

        // Actualizar un producto existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductModel product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _productService.UpdateAsync(id, product);

                if (!success)
                {
                    return NotFound($"Producto con ID {id} no encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al actualizar producto: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al actualizar el producto.");
            }
        }

        // Eliminar un producto por ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var success = await _productService.DeleteAsync(id);

                if (!success)
                {
                    return NotFound($"Producto con ID {id} no encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al eliminar producto: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al eliminar el producto.");
            }
        }
    }
}
