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
        private readonly ILogger<DepartamentosController> _logger;

        public DepartamentosController(IDepartamentoService departamentoService, ILogger<DepartamentosController> logger)
        {
            _departamentoService = departamentoService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartamentoDto>>> GetDepartamentos()
        {
            try
            {
                _logger.LogInformation("GET /api/departamentos called");
                var departamentos = await _departamentoService.GetAllAsync();
                _logger.LogInformation($"Returning {departamentos.Count()} departamentos");
                return Ok(departamentos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/departamentos");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartamentoDto>> GetDepartamento(int id)
        {
            try
            {
                _logger.LogInformation($"GET /api/departamentos/{id} called");
                var departamento = await _departamentoService.GetByIdAsync(id);
                if (departamento == null)
                {
                    _logger.LogWarning($"Departamento with ID {id} not found");
                    return NotFound(new { message = "Departamento no encontrado" });
                }
                return Ok(departamento);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GET /api/departamentos/{id}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<DepartamentoDto>> CreateDepartamento(CreateDepartamentoDto createDto)
        {
            try
            {
                _logger.LogInformation($"POST /api/departamentos called with: {createDto.Descripcion}");
                
                if (string.IsNullOrWhiteSpace(createDto.Descripcion))
                {
                    return BadRequest(new { message = "La descripción es obligatoria" });
                }

                var departamento = await _departamentoService.CreateAsync(createDto);
                _logger.LogInformation($"Created departamento with ID: {departamento.Id}");
                
                return CreatedAtAction(nameof(GetDepartamento), new { id = departamento.Id }, departamento);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Business logic error in POST /api/departamentos: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST /api/departamentos");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DepartamentoDto>> UpdateDepartamento(int id, UpdateDepartamentoDto updateDto)
        {
            try
            {
                _logger.LogInformation($"PUT /api/departamentos/{id} called");
                _logger.LogInformation($"Update data: Descripcion='{updateDto.Descripcion}', Activo={updateDto.Activo}");
                
                if (string.IsNullOrWhiteSpace(updateDto.Descripcion))
                {
                    return BadRequest(new { message = "La descripción es obligatoria" });
                }

                var departamento = await _departamentoService.UpdateAsync(id, updateDto);
                _logger.LogInformation($"Updated departamento with ID: {id}");
                
                return Ok(departamento);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Business logic error in PUT /api/departamentos/{id}: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in PUT /api/departamentos/{id}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartamento(int id)
        {
            try
            {
                _logger.LogInformation($"DELETE /api/departamentos/{id} called");
                var result = await _departamentoService.DeleteAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"Departamento with ID {id} not found for deletion");
                    return NotFound(new { message = "Departamento no encontrado" });
                }
                
                _logger.LogInformation($"Deleted departamento with ID: {id}");
                return Ok(new { message = "Departamento eliminado exitosamente" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Business logic error in DELETE /api/departamentos/{id}: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in DELETE /api/departamentos/{id}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
