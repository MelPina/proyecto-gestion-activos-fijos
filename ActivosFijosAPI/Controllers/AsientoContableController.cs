using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsientoContableController : ControllerBase
    {
        private readonly IAsientoContableService _asientoContableService;

        public AsientoContableController(IAsientoContableService asientoContableService)
        {
            _asientoContableService = asientoContableService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsientoContableDto>>> GetAsientosContables(
            [FromQuery] string? search = null,
            [FromQuery] int? id = null,
            [FromQuery] DateTime? fechaAsiento = null,
            [FromQuery] string? cuentaContable = null,
            [FromQuery] string? tipoMovimiento = null)
        {
            try
            {
                var asientos = await _asientoContableService.GetAllAsync(search, id, fechaAsiento, cuentaContable, tipoMovimiento);
                return Ok(asientos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AsientoContableDto>> GetAsientoContable(int id)
        {
            try
            {
                var asiento = await _asientoContableService.GetByIdAsync(id);
                if (asiento == null)
                {
                    return NotFound(new { message = "Asiento contable no encontrado" });
                }
                return Ok(asiento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AsientoContableDto>> CreateAsientoContable(CreateAsientoContableDto createDto)
        {
            try
            {
                var asiento = await _asientoContableService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetAsientoContable), new { id = asiento.Id }, asiento);
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
        public async Task<ActionResult<AsientoContableDto>> UpdateAsientoContable(int id, UpdateAsientoContableDto updateDto)
        {
            try
            {
                var asiento = await _asientoContableService.UpdateAsync(id, updateDto);
                return Ok(asiento);
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
        public async Task<IActionResult> DeleteAsientoContable(int id)
        {
            try
            {
                var result = await _asientoContableService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Asiento contable no encontrado" });
                }
                return Ok(new { message = "Asiento contable eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
