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
        private readonly ILogger<ActivosFijosController> _logger;

        public ActivosFijosController(IActivoFijoService activoFijoService, ILogger<ActivosFijosController> logger)
        {
            _activoFijoService = activoFijoService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivoFijoDto>>> GetActivosFijos()
        {
            try
            {
                var activos = await _activoFijoService.GetAllAsync();
                return Ok(activos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                _logger.LogError(ex, "Error al obtener activo fijo con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ActivoFijoDto>> CreateActivoFijo(CreateActivoFijoDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var activo = await _activoFijoService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetActivoFijo), new { id = activo.Id }, activo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear activo fijo");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ActivoFijoDto>> UpdateActivoFijo(int id, UpdateActivoFijoDto updateDto)
        {
            try
            {
                var activo = await _activoFijoService.UpdateAsync(id, updateDto);
                if (activo == null)
                {
                    return NotFound(new { message = "Activo fijo no encontrado" });
                }
                return Ok(activo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar activo fijo con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                _logger.LogError(ex, "Error al eliminar activo fijo con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ActivoFijoDto>>> SearchActivosFijos([FromQuery] string term)
        {
            try
            {
                var activos = await _activoFijoService.SearchAsync(term ?? string.Empty);
                return Ok(activos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar activos fijos");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                _logger.LogError(ex, "Error al obtener estadísticas de activos fijos");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpGet("departamento/{departamentoId}")]
        public async Task<ActionResult<IEnumerable<ActivoFijoDto>>> GetByDepartamento(int departamentoId)
        {
            try
            {
                var activos = await _activoFijoService.GetByDepartamentoAsync(departamentoId);
                return Ok(activos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos por departamento {DepartamentoId}", departamentoId);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpGet("tipo/{tipoActivoId}")]
        public async Task<ActionResult<IEnumerable<ActivoFijoDto>>> GetByTipoActivo(int tipoActivoId)
        {
            try
            {
                var activos = await _activoFijoService.GetByTipoActivoAsync(tipoActivoId);
                return Ok(activos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos por tipo {TipoActivoId}", tipoActivoId);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}
