using Microsoft.AspNetCore.Mvc;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartamentosController : ControllerBase
    {
        private readonly IDepartamentoService _departamentoService;

        public DepartamentosController(IDepartamentoService departamentoService)
        {
            _departamentoService = departamentoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartamentoDto>>> GetDepartamentos()
        {
            try
            {
                var departamentos = await _departamentoService.GetAllAsync();
                return Ok(departamentos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartamentoDto>> GetDepartamento(int id)
        {
            try
            {
                var departamento = await _departamentoService.GetByIdAsync(id);
                if (departamento == null)
                {
                    return NotFound(new { message = "Departamento no encontrado" });
                }
                return Ok(departamento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<DepartamentoDto>> CreateDepartamento(CreateDepartamentoDto createDto)
        {
            try
            {
                var departamento = await _departamentoService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetDepartamento), new { id = departamento.Id }, departamento);
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
        public async Task<ActionResult<DepartamentoDto>> UpdateDepartamento(int id, UpdateDepartamentoDto updateDto)
        {
            try
            {
                var departamento = await _departamentoService.UpdateAsync(id, updateDto);
                return Ok(departamento);
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
        public async Task<IActionResult> DeleteDepartamento(int id)
        {
            try
            {
                var result = await _departamentoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Departamento no encontrado" });
                }
                return Ok(new { message = "Departamento eliminado exitosamente" });
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
