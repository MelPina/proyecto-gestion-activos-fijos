using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ActivosFijosAPI.Services;
using ActivosFijosAPI.DTOs;
using System;
using System.Linq;
using System.Collections.Generic;

namespace ActivosFijosAPI.Controllers
{
    [Route("api/[controller]")]
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
                    return StatusCode(500, new { message = "Error al obtener las entradas contables del sistema externo" });
                }

                _logger.LogInformation($"Retrieved {entradas.Count} entradas contables");

                return Ok(entradas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting entradas contables");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                    return NotFound(new { message = $"Entrada contable con ID {id} no encontrada" });
                }

                _logger.LogInformation($"Retrieved entrada contable {id}");

                return Ok(entrada);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting entrada contable {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                    return BadRequest(ModelState);
                }

                var success = await _entradaContableService.CreateAsync(entrada);

                if (success)
                {
                    _logger.LogInformation("Entrada contable created successfully");
                    return Ok(new { message = "Entrada contable creada correctamente" });
                }

                return BadRequest(new { message = "Error al crear la entrada contable en el sistema externo" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating entrada contable");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                _logger.LogInformation($"Updating entrada contable {id}...");

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _entradaContableService.UpdateAsync(id, entrada);

                if (success)
                {
                    _logger.LogInformation($"Entrada contable {id} updated successfully");
                    return Ok(new { message = "Entrada contable actualizada correctamente" });
                }

                return BadRequest(new { message = "Error al actualizar la entrada contable en el sistema externo" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating entrada contable {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                    return Ok(new { message = "Entrada contable eliminada correctamente" });
                }

                return BadRequest(new { message = "Error al eliminar la entrada contable del sistema externo" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting entrada contable {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                _logger.LogInformation($"Contabilizando {entradaIds.Count} entradas...");

                if (entradaIds == null || !entradaIds.Any())
                {
                    return BadRequest(new { message = "Debe proporcionar al menos una entrada para contabilizar" });
                }

                var success = await _entradaContableService.ContabilizarAsync(entradaIds);

                if (success)
                {
                    _logger.LogInformation($"{entradaIds.Count} entradas contabilizadas successfully");
                    return Ok(new { message = $"{entradaIds.Count} entradas contabilizadas exitosamente" });
                }

                return BadRequest(new { message = "Error al contabilizar las entradas" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error contabilizando entradas");
                return StatusCode(500, new { message = "Error interno del servidor" });
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
                    return StatusCode(500, new { message = "Error al obtener las estadísticas" });
                }

                var stats = new
                {
                    total = entradas.Count,
                    montoTotal = entradas.SelectMany(e => e.detalles).Sum(d => d.montoAsiento),
                    porFecha = entradas.GroupBy(e => e.fechaAsiento.Date)
                                     .Select(g => new { fecha = g.Key, cantidad = g.Count() })
                                     .OrderBy(x => x.fecha)
                                     .ToList()
                };

                _logger.LogInformation($"Retrieved stats for {entradas.Count} entradas contables");

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting entradas contables stats");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Verificar el estado de la conexión con la API externa
        /// </summary>
        [HttpGet("health")]
        public async Task<IActionResult> HealthCheck()
        {
            try
            {
                _logger.LogInformation("Checking external API health...");

                var isConnected = await ((EntradaContableService)_entradaContableService).TestConnectionAsync();

                var healthStatus = new
                {
                    status = isConnected ? "healthy" : "unhealthy",
                    externalApi = new
                    {
                        url = "http://3.80.223.142:3001/api/public/entradas-contables",
                        connected = isConnected,
                        timestamp = DateTime.UtcNow
                    },
                    localApi = new
                    {
                        status = "running",
                        timestamp = DateTime.UtcNow
                    }
                };

                if (isConnected)
                {
                    _logger.LogInformation("External API health check passed");
                    return Ok(healthStatus);
                }
                else
                {
                    _logger.LogWarning("External API health check failed");
                    return StatusCode(503, healthStatus);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check error");
                return StatusCode(500, new { 
                    status = "error", 
                    message = "Error checking external API health",
                    timestamp = DateTime.UtcNow 
                });
            }
        }
    }
}
