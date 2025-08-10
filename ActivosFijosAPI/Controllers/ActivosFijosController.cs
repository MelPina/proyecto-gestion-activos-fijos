using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivosFijosController : ControllerBase
    {
        private readonly IActivoFijoService _activoFijoService;

        public ActivosFijosController(IActivoFijoService activoFijoService)
        {
            _activoFijoService = activoFijoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivoFijoDto>>> GetActivosFijos(
            [FromQuery] string? search = null,
            [FromQuery] int? tipoActivoId = null,
            [FromQuery] int? departamentoId = null,
            [FromQuery] int? estado = null)
        {
            try
            {
                var activos = await _activoFijoService.GetAllAsync(search, tipoActivoId, departamentoId, estado);
                return Ok(activos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivoFijoDto>> GetActivoFijo(int id)
        {
            try
            {
                var activo = await _activoFijoService.GetByIdAsync(id);
                if (activo == null)
                {
                    return NotFound(new { message = "Activo fijo no encontrado" });
                }
                return Ok(activo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ActivoFijoDto>> CreateActivoFijo(CreateActivoFijoDto createDto)
        {
            try
            {
                var activo = await _activoFijoService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetActivoFijo), new { id = activo.Id }, activo);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ActivoFijoDto>> UpdateActivoFijo(int id, UpdateActivoFijoDto updateDto)
        {
            try
            {
                var activo = await _activoFijoService.UpdateAsync(id, updateDto);
                return Ok(activo);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivoFijo(int id)
        {
            try
            {
                var result = await _activoFijoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Activo fijo no encontrado" });
                }
                return Ok(new { message = "Activo fijo eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ActivoFijoStatsDto>> GetStats()
        {
            try
            {
                var stats = await _activoFijoService.GetStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
