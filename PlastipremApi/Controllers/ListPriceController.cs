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
    public class ListPricesController : ControllerBase
    {
        private readonly ListPriceService _listPriceService;

        public ListPricesController(ListPriceService listPriceService)
        {
            _listPriceService = listPriceService;
        }

        // Obtener todos los listpriceos con filtros opcionales
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var listPrices = await _listPriceService.GetAllAsync();
                return Ok(listPrices);
            }
            catch (Exception ex)
            {
                // Log del error (puedes reemplazar esto por un sistema de logging real)
                Console.Error.WriteLine($"Error al obtener listpriceos: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al obtener los listpriceos.");
            }
        }

        // Obtener un listpriceo por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var listPrice = await _listPriceService.GetByIdAsync(id);

                if (listPrice == null)
                {
                    return NotFound($"ListPrice con ID {id} no encontrado.");
                }

                return Ok(listPrice);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al obtener listprice por ID: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al obtener el listprice.");
            }
        }

        // Crear un nuevo listpriceo
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ListPriceModel listPrice)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdListPrice = await _listPriceService.CreateAsync(listPrice);
                return CreatedAtAction(nameof(GetById), new { id = createdListPrice.ListPriceID }, createdListPrice);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al crear listPrice: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al crear el listPrice.");
            }
        }

        // Actualizar un listpriceo existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ListPriceModel listPrice)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _listPriceService.UpdateAsync(id, listPrice);

                if (!success)
                {
                    return NotFound($"listPrice con ID {id} no encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al actualizar listPrice: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al actualizar el listPrice.");
            }
        }

        // Eliminar un listPrice por ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var success = await _listPriceService.DeleteAsync(id);

                if (!success)
                {
                    return NotFound($"ListPriceo con ID {id} no encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al eliminar listpriceo: {ex.Message}");
                return StatusCode(500, "Ocurrió un error al eliminar el listpriceo.");
            }
        }
    }
}
