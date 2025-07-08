using Microsoft.AspNetCore.Mvc;
using Valplas.Models;
using Valplas.Services;
using Valplas.DTO;

namespace Valplas.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AccountabilityController : ControllerBase
{
    AccountabilityService _service;

    public AccountabilityController(AccountabilityService service)
    {
        _service = service;
    }





    // GET: api/Accountability
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string date)
    {
        if (!DateTime.TryParseExact(date, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var parsedDate))
        {
            return BadRequest("Formato de fecha inválido. Usar dd/MM/yyyy.");
        }

        var result = await _service.GetDailySalesByListPrice(parsedDate);
        return Ok(result);
    }

    // GET: api/Accountability/{id}
    // [HttpGet("{id}")]
    // public async Task<ActionResult<AccountabilityModel>> GetById(Guid id)
    // {
    //     var accountability = await _service.GetById(id);

    //     if (accountability == null)
    //     {
    //         return NotFound();
    //     }

    //     return Ok(accountability);
    // }

}