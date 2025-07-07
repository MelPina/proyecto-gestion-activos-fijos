using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly IEmpleadoService _empleadoService;

        public EmpleadosController(IEmpleadoService empleadoService)
        {
            _empleadoService = empleadoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpleadoDto>>> GetEmpleados(
            [FromQuery] string? search = null,
            [FromQuery] int? departamentoId = null)
        {
            try
            {
                var empleados = await _empleadoService.GetAllAsync(search, departamentoId);
                return Ok(empleados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmpleadoDto>> GetEmpleado(int id)
        {
            try
            {
                var empleado = await _empleadoService.GetByIdAsync(id);
                if (empleado == null)
                {
                    return NotFound(new { message = "Empleado no encontrado" });
                }
                return Ok(empleado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<EmpleadoDto>> CreateEmpleado(CreateEmpleadoDto createDto)
        {
            try
            {
                var empleado = await _empleadoService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetEmpleado), new { id = empleado.Id }, empleado);
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
        public async Task<ActionResult<EmpleadoDto>> UpdateEmpleado(int id, UpdateEmpleadoDto updateDto)
        {
            try
            {
                var empleado = await _empleadoService.UpdateAsync(id, updateDto);
                return Ok(empleado);
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
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            try
            {
                var result = await _empleadoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Empleado no encontrado" });
                }
                return Ok(new { message = "Empleado eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<EmpleadoStatsDto>> GetStats()
        {
            try
            {
                var stats = await _empleadoService.GetStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
