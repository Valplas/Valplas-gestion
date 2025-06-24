using Microsoft.AspNetCore.Mvc;

namespace Valplas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        public TestController()
        {
        }
        
        [HttpGet]
        public ActionResult<string> GetAll()
        {
            return Ok("Test GET: Todos los elementos.");
        }


        [HttpGet("{id}")]
        public ActionResult<string> GetById(int id)
        {
            return Ok($"Test GET: Elemento con ID = {id}");
        }


        [HttpPost]
        public ActionResult<string> Create([FromBody] string value)
        {
            // Aquí podrías agregar lógica para crear un nuevo recurso
            return CreatedAtAction(nameof(GetById), new { id = 1 }, "Test POST: Elemento creado.");
        }


        [HttpPut("{id}")]
        public ActionResult<string> Update(int id, [FromBody] string value)
        {
            // Aquí podrías agregar lógica para actualizar un recurso existente
            return Ok($"Test PUT: Elemento con ID = {id} actualizado.");
        }


        [HttpDelete("{id}")]
        public ActionResult<string> Delete(int id)
        {
            // Aquí podrías agregar lógica para eliminar un recurso existente
            return Ok($"Test DELETE: Elemento con ID = {id} eliminado.");
        }
    }
}
