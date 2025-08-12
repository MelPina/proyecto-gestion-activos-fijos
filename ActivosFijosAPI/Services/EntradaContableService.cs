using System.Text.Json;
using System.Text;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class EntradaContableService : IEntradaContableService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<EntradaContableService> _logger;
        private const int IdSistemaAuxiliar = 8; // Activos Fijos

        public EntradaContableService(HttpClient httpClient, ILogger<EntradaContableService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<EntradaContableDto>?> GetAllAsync(EntradaContableFiltersDto? filters = null)
        {
            try
            {
                // URL corregida - removiendo el path duplicado
                var url = "entradas-contables";
                var queryParams = new List<string>();

                if (filters != null)
                {
                    if (filters.fechaInicio.HasValue) 
                        queryParams.Add($"fechaInicio={filters.fechaInicio.Value:yyyy-MM-dd}");
                    if (filters.fechaFin.HasValue) 
                        queryParams.Add($"fechaFin={filters.fechaFin.Value:yyyy-MM-dd}");
                    if (filters.cuentaId.HasValue) 
                        queryParams.Add($"cuentaId={filters.cuentaId}"); // Corregido: era cuenta_Id
                }

                if (queryParams.Any())
                    url += "?" + string.Join("&", queryParams);

                _logger.LogInformation($"🌐 External API URL: {_httpClient.BaseAddress}{url}");

                var response = await _httpClient.GetAsync(url);
                _logger.LogInformation($"📡 Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error Response: {response.StatusCode} - {errorContent}");
                    return null;
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"📄 Response Content: {jsonContent}");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var entradas = JsonSerializer.Deserialize<List<EntradaContable>>(jsonContent, options);
                return entradas?.Select(MapToDto).ToList();
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "❌ HTTP Error fetching entradas contables");
                return null;
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "❌ JSON Deserialization Error");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Unexpected error fetching entradas contables");
                return null;
            }
        }

        public async Task<EntradaContableDto?> GetByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"entradas-contables/{id}");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error getting entrada {id}: {response.StatusCode} - {errorContent}");
                    return null;
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var entrada = JsonSerializer.Deserialize<EntradaContable>(jsonContent, options);
                return entrada != null ? MapToDto(entrada) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error fetching entrada contable {id}");
                return null;
            }
        }

        public async Task<bool> CreateAsync(CreateEntradaContableDto entrada)
        {
            try
            {
                var model = new EntradaContable
                {
                    descripcion = entrada.descripcion,
                    sistemaAuxiliarId = IdSistemaAuxiliar,
                    fechaAsiento = entrada.fechaAsiento,
                    detalles = entrada.detalles.Select(d => new DetalleAsiento
                    {
                        cuentaId = d.cuentaId,
                        tipoMovimiento = d.tipoMovimiento,
                        montoAsiento = d.montoAsiento
                    }).ToList()
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(model, options);
                _logger.LogInformation($"📤 Sending JSON: {json}");

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("entradas-contables", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error creating entrada: {response.StatusCode} - {errorContent}");
                    return false;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"✅ Created entrada response: {responseContent}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error creating entrada contable");
                return false;
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateEntradaContableDto entrada)
        {
            try
            {
                var model = new EntradaContable
                {
                    id = id,
                    descripcion = entrada.descripcion,
                    sistemaAuxiliarId = IdSistemaAuxiliar,
                    fechaAsiento = entrada.fechaAsiento,
                    detalles = entrada.detalles.Select(d => new DetalleAsiento
                    {
                        cuentaId = d.cuentaId,
                        tipoMovimiento = d.tipoMovimiento,
                        montoAsiento = d.montoAsiento
                    }).ToList()
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(model, options);
                _logger.LogInformation($"📤 Updating entrada {id} with JSON: {json}");

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync($"entradas-contables/{id}", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error updating entrada {id}: {response.StatusCode} - {errorContent}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error updating entrada contable {id}");
                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"entradas-contables/{id}");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error deleting entrada {id}: {response.StatusCode} - {errorContent}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error deleting entrada contable {id}");
                return false;
            }
        }

        public async Task<bool> ContabilizarAsync(List<int> entradaIds)
        {
            try
            {
                _logger.LogInformation($"📊 Contabilizando {entradaIds.Count} entradas...");
                
                var payload = new { entradaIds };
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(payload, options);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Asumiendo que existe un endpoint para contabilizar
                var response = await _httpClient.PostAsync("entradas-contables/contabilizar", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Error contabilizando entradas: {response.StatusCode} - {errorContent}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error contabilizando entradas");
                return false;
            }
        }

        private static EntradaContableDto MapToDto(EntradaContable entrada)
        {
            return new EntradaContableDto
            {
                id = entrada.id,
                descripcion = entrada.descripcion,
                sistemaAuxiliarId = entrada.sistemaAuxiliarId,
                fechaAsiento = entrada.fechaAsiento,
                detalles = entrada.detalles.Select(d => new DetalleAsientoDto
                {
                    cuentaId = d.cuentaId,
                    tipoMovimiento = d.tipoMovimiento,
                    montoAsiento = d.montoAsiento
                }).ToList()
            };
        }
    }
}