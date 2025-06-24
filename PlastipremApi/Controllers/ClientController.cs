using Microsoft.AspNetCore.Mvc;
using Valplas.Models;
using Valplas.Services;

namespace Valplas.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ClientController : ControllerBase
{
    ClientService _service;

    public ClientController(ClientService service)
    {
        _service = service;
    }

    // GET: api/Client
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientModel>>> GetAll()
    {
        var clients = await _service.GetAll();
        return Ok(clients);
    }

    // GET: api/Client/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ClientModel>> GetById(Guid id)
    {
        var client = await _service.GetById(id);

        if (client == null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    // POST: api/Client
    [HttpPost]
    public async Task<ActionResult<ClientModel>> Create([FromBody] ClientModel client)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdClient = await _service.Create(client);

        return CreatedAtAction(nameof(GetById), new { id = createdClient.ClientID }, createdClient);
    }

    // PUT: api/Client/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ClientModel client)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _service.Update(id, client);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Client/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.Delete(id);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}