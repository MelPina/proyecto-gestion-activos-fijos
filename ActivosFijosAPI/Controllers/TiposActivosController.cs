using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiposActivosController : ControllerBase
    {
        private readonly ITipoActivoService _tipoActivoService;

        public TiposActivosController(ITipoActivoService tipoActivoService)
        {
            _tipoActivoService = tipoActivoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoActivoDto>>> GetTiposActivos()
        {
            try
            {
                var tiposActivos = await _tipoActivoService.GetAllAsync();
                return Ok(tiposActivos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoActivoDto>> GetTipoActivo(int id)
        {
            try
            {
                var tipoActivo = await _tipoActivoService.GetByIdAsync(id);
                if (tipoActivo == null)
                {
                    return NotFound(new { message = "Tipo de activo no encontrado" });
                }
                return Ok(tipoActivo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TipoActivoDto>> CreateTipoActivo(CreateTipoActivoDto createDto)
        {
            try
            {
                var tipoActivo = await _tipoActivoService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetTipoActivo), new { id = tipoActivo.Id }, tipoActivo);
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
        public async Task<ActionResult<TipoActivoDto>> UpdateTipoActivo(int id, UpdateTipoActivoDto updateDto)
        {
            try
            {
                var tipoActivo = await _tipoActivoService.UpdateAsync(id, updateDto);
                return Ok(tipoActivo);
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
        public async Task<IActionResult> DeleteTipoActivo(int id)
        {
            try
            {
                var result = await _tipoActivoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Tipo de activo no encontrado" });
                }
                return Ok(new { message = "Tipo de activo eliminado exitosamente" });
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
    }
}
