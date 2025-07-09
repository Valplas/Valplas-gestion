using Microsoft.AspNetCore.Mvc;
using System.Globalization;
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
    public async Task<ActionResult> GetAll([FromQuery] string? date)
    {
        DateTime parsedDate;

        if (string.IsNullOrWhiteSpace(date))
        {
            parsedDate = DateTime.UtcNow.Date; // Por defecto: hoy
        }
        else if (!DateTime.TryParseExact(date, "dd-MM-yyyy", null, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out parsedDate))
        {
            return BadRequest("Formato de fecha inválido. Usar dd-MM-yyyy.");
        }

        var result = await _service.GetDailySalesGroupedByProduct(parsedDate);
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