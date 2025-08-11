using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Services;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepreciacionesController : ControllerBase
    {
        private readonly IDepreciacionService _depreciacionService;

        public DepreciacionesController(IDepreciacionService depreciacionService)
        {
            _depreciacionService = depreciacionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepreciacionDto>>> GetDepreciacion(
            [FromQuery] string? search = null,
            [FromQuery] int? id = null,
            [FromQuery] int? anio = null,
            [FromQuery] int? mes = null,
            [FromQuery] int? activoFijoId = null,
            [FromQuery] DateTime? fechaAsiento = null,
            [FromQuery] string? cuentaCompra = null,
            [FromQuery] string? cuentaDepreciacion = null)
        {
            try
            {
                var depreciaciones = await _depreciacionService.GetAllAsync(search, id, anio, mes, activoFijoId, fechaAsiento, cuentaCompra,cuentaDepreciacion);
                return Ok(depreciaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivoFijoDto>> GetDepreciacion(int id)
        {
            try
            {
                var activo = await _depreciacionService.GetByIdAsync(id);
                if (activo == null)
                {
                    return NotFound(new { message = "Depreciacion no encontrado" });
                }
                return Ok(activo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

    }
}
