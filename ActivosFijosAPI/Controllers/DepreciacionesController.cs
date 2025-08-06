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
            [FromQuery] int? anio = null,
            [FromQuery] int? mes = null,
            [FromQuery] int? ActivoId = null,
            [FromQuery] int? tipoActivoId = null)
        {
            try
            {
                var depreciaciones = await _depreciacionService.GetReporteDepreciacionAsync(anio, mes, tipoActivoId, ActivoId);
                return Ok(depreciaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }


        [HttpGet("stats")]
        public async Task<ActionResult<DepreciacioinStatsDto>> GetStats(
            [FromQuery] int? anio,
            [FromQuery] int? mes = null,
            [FromQuery] int? tipoActivoId = null)
        {
            try
            {
                var stats = await _depreciacionService.GetStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
