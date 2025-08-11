using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [Route("api/entradas-contables")]
    [ApiController]
    public class EntradasContablesController : ControllerBase
    {
        private readonly IEntradaContableService _entradaContableService;
        private readonly ILogger<EntradasContablesController> _logger;

        public EntradasContablesController(
            IEntradaContableService entradaContableService,
            ILogger<EntradasContablesController> logger)
        {
            _entradaContableService = entradaContableService;
            _logger = logger;
        }

        /// <summary>
        /// Obtener todas las entradas contables con filtros opcionales
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] EntradaContableFiltersDto? filters = null)
        {
            try
            {
                _logger.LogInformation("Getting all entradas contables...");

                var entradas = await _entradaContableService.GetAllAsync(filters);

                if (entradas == null)
                {
                    return StatusCode(500, new { 
                        message = "Error al obtener las entradas contables del sistema externo",
                        details = "Verifique la conectividad con la API externa"
                    });
                }

                _logger.LogInformation($"Retrieved {entradas.Count} entradas contables");

                return Ok(new 
                { 
                    success = true,
                    count = entradas.Count,
                    data = entradas 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting entradas contables");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Obtener una entrada contable por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                _logger.LogInformation($"Getting entrada contable {id}...");

                var entrada = await _entradaContableService.GetByIdAsync(id);

                if (entrada == null)
                {
                    return NotFound(new { 
                        message = $"Entrada contable con ID {id} no encontrada",
                        success = false
                    });
                }

                _logger.LogInformation($"Retrieved entrada contable {id}");

                return Ok(new 
                { 
                    success = true,
                    data = entrada 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting entrada contable {id}");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Crear una nueva entrada contable
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEntradaContableDto entrada)
        {
            try
            {
                _logger.LogInformation("Creating new entrada contable...");

                if (!ModelState.IsValid)
                {
                    return BadRequest(new 
                    { 
                        message = "Datos de entrada inválidos",
                        errors = ModelState,
                        success = false
                    });
                }

                // Validación adicional: Los débitos deben igualar los créditos
                var totalDebitos = entrada.detalles.Where(d => d.tipoMovimiento == "DB").Sum(d => d.montoAsiento);
                var totalCreditos = entrada.detalles.Where(d => d.tipoMovimiento == "CR").Sum(d => d.montoAsiento);

                if (totalDebitos != totalCreditos)
                {
                    return BadRequest(new
                    {
                        message = "El total de débitos debe igualar el total de créditos",
                        totalDebitos,
                        totalCreditos,
                        diferencia = totalDebitos - totalCreditos,
                        success = false
                    });
                }

                var success = await _entradaContableService.CreateAsync(entrada);

                if (success)
                {
                    _logger.LogInformation("Entrada contable created successfully");
                    return CreatedAtAction(nameof(GetById), new { id = 0 }, new { 
                        message = "Entrada contable creada correctamente",
                        success = true
                    });
                }

                return BadRequest(new { 
                    message = "Error al crear la entrada contable en el sistema externo",
                    success = false
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating entrada contable");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message,
                    success = false
                });
            }
        }

        /// <summary>
        /// Actualizar una entrada contable existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEntradaContableDto entrada)
        {
            try
            {
                _logger.LogInformation($"📝 Updating entrada contable {id}...");

                if (!ModelState.IsValid)
                {
                    return BadRequest(new 
                    { 
                        message = "Datos de entrada inválidos",
                        errors = ModelState,
                        success = false
                    });
                }

                // Validación adicional: Los débitos deben igualar los créditos
                var totalDebitos = entrada.detalles.Where(d => d.tipoMovimiento == "DB").Sum(d => d.montoAsiento);
                var totalCreditos = entrada.detalles.Where(d => d.tipoMovimiento == "CR").Sum(d => d.montoAsiento);

                if (totalDebitos != totalCreditos)
                {
                    return BadRequest(new
                    {
                        message = "El total de débitos debe igualar el total de créditos",
                        totalDebitos,
                        totalCreditos,
                        diferencia = totalDebitos - totalCreditos,
                        success = false
                    });
                }

                var success = await _entradaContableService.UpdateAsync(id, entrada);

                if (success)
                {
                    _logger.LogInformation($"Entrada contable {id} updated successfully");
                    return Ok(new { 
                        message = "Entrada contable actualizada correctamente",
                        success = true
                    });
                }

                return BadRequest(new { 
                    message = "Error al actualizar la entrada contable en el sistema externo",
                    success = false
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating entrada contable {id}");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message,
                    success = false
                });
            }
        }

        /// <summary>
        /// Eliminar una entrada contable
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting entrada contable {id}...");

                var success = await _entradaContableService.DeleteAsync(id);

                if (success)
                {
                    _logger.LogInformation($"Entrada contable {id} deleted successfully");
                    return Ok(new { 
                        message = "Entrada contable eliminada correctamente",
                        success = true
                    });
                }

                return BadRequest(new { 
                    message = "Error al eliminar la entrada contable del sistema externo",
                    success = false
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting entrada contable {id}");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message,
                    success = false
                });
            }
        }

        /// <summary>
        /// Contabilizar entradas seleccionadas
        /// </summary>
        [HttpPost("contabilizar")]
        public async Task<IActionResult> Contabilizar([FromBody] List<int> entradaIds)
        {
            try
            {
                _logger.LogInformation($"Contabilizando {entradaIds?.Count ?? 0} entradas...");

                if (entradaIds == null || !entradaIds.Any())
                {
                    return BadRequest(new { 
                        message = "Debe proporcionar al menos una entrada para contabilizar",
                        success = false
                    });
                }

                var success = await _entradaContableService.ContabilizarAsync(entradaIds);

                if (success)
                {
                    _logger.LogInformation($"{entradaIds.Count} entradas contabilizadas successfully");
                    return Ok(new { 
                        message = $"{entradaIds.Count} entradas contabilizadas exitosamente",
                        count = entradaIds.Count,
                        success = true
                    });
                }

                return BadRequest(new { 
                    message = "Error al contabilizar las entradas",
                    success = false
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error contabilizando entradas");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message,
                    success = false
                });
            }
        }

        /// <summary>
        /// Obtener estadísticas de entradas contables
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats([FromQuery] EntradaContableFiltersDto? filters = null)
        {
            try
            {
                _logger.LogInformation("Getting entradas contables stats...");

                var entradas = await _entradaContableService.GetAllAsync(filters);

                if (entradas == null)
                {
                    return StatusCode(500, new { 
                        message = "Error al obtener las estadísticas",
                        success = false
                    });
                }

                var stats = new
                {
                    total = entradas.Count,
                    montoTotal = entradas.SelectMany(e => e.detalles).Sum(d => d.montoAsiento),
                    porFecha = entradas.GroupBy(e => e.fechaAsiento.Date)
                                     .Select(g => new { fecha = g.Key, cantidad = g.Count() })
                                     .OrderBy(x => x.fecha)
                                     .ToList(),
                    porTipoMovimiento = entradas.SelectMany(e => e.detalles)
                                              .GroupBy(d => d.tipoMovimiento)
                                              .Select(g => new { tipo = g.Key, total = g.Sum(x => x.montoAsiento) })
                                              .ToList(),
                    success = true
                };

                _logger.LogInformation($"Retrieved stats for {entradas.Count} entradas contables");

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting entradas contables stats");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message,
                    success = false
                });
            }
        }

        /// <summary>
        /// Endpoint de prueba para verificar conectividad con API externa
        /// </summary>
        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                _logger.LogInformation("Testing connection to external API...");

                var entradas = await _entradaContableService.GetAllAsync(null);

                return Ok(new
                {
                    message = "Conexión con API externa exitosa",
                    timestamp = DateTime.UtcNow,
                    recordsFound = entradas?.Count ?? 0,
                    success = entradas != null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing connection");
                return StatusCode(500, new
                {
                    message = "Error de conectividad con API externa",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow,
                    success = false
                });
            }
        }
    }
}