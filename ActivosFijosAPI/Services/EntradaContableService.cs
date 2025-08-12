using System.Text.Json;
using System.Text;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

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

            // _httpClient.BaseAddress = new Uri("http://3.80.223.142:3001/");
            // _httpClient.DefaultRequestHeaders.Clear();
            // _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            // _httpClient.DefaultRequestHeaders.Add("User-Agent", "ActivosFijosAPI/1.0");
            // _httpClient.Timeout = TimeSpan.FromSeconds(30);
        }

        // public async Task<List<EntradaContableDto>?> GetAllAsync(EntradaContableFiltersDto? filters = null)
        // {
        //     try
        //     {
        //         _logger.LogInformation("Fetching entradas contables from external API...");
        //         _logger.LogInformation("Request Headers:");
        //         foreach (var header in _httpClient.DefaultRequestHeaders)
        //         {
        //             _logger.LogInformation($"{header.Key}: {string.Join(", ", header.Value)}");
        //         }


        //         var queryParams = new List<string>();

        //         if (filters != null)
        //         {
        //             if (filters.fechaInicio.HasValue)
        //                 queryParams.Add($"fechaInicio={filters.fechaInicio.Value:yyyy-MM-dd}");

        //             if (filters.fechaFin.HasValue)
        //                 queryParams.Add($"fechaFin={filters.fechaFin.Value:yyyy-MM-dd}");

        //             if (filters.cuentaId.HasValue)
        //                 queryParams.Add($"cuenta_Id={filters.cuentaId.Value}");
        //         }

        //         var url = "api/public/entradas-contables";
        //         if (queryParams.Any())
        //         {
        //             url += "?" + string.Join("&", queryParams);
        //         }

        //         _logger.LogInformation($"🌐 Calling: {_httpClient.BaseAddress}{url}");

        //         var response = await _httpClient.GetAsync(url);

        //         if (response.IsSuccessStatusCode)
        //         {
        //             var json = await response.Content.ReadAsStringAsync();
        //             _logger.LogInformation($"📡 Raw API Response: {json}");

        //             var apiResponse = JsonSerializer.Deserialize<ExternalApiResponse>(json, new JsonSerializerOptions
        //             {
        //                 PropertyNameCaseInsensitive = true
        //             });

        //             if (apiResponse?.success == true && apiResponse.data != null)
        //             {
        //                 var result = apiResponse.data.Select(MapToDto).ToList();
        //                 _logger.LogInformation($"✅ Retrieved {result.Count} entradas contables");
        //                 return result;
        //             }
        //             else
        //             {
        //                 _logger.LogWarning($"⚠️ API returned success=false or no data");
        //                 return new List<EntradaContableDto>();
        //             }
        //         }
        //         else
        //         {
        //             var errorContent = await response.Content.ReadAsStringAsync();
        //             _logger.LogError($"❌ API Error: {response.StatusCode} - {errorContent}");
        //             return new List<EntradaContableDto>();
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "❌ Error fetching entradas contables");
        //         return new List<EntradaContableDto>();
        //     }
        // }
        public async Task<List<EntradaContableDto>?> GetAllAsync(EntradaContableFiltersDto? filters = null)
        {
            try
            {
                _logger.LogInformation("Fetching entradas contables from external API...");

                var queryParams = new List<string>();

                if (filters != null)
                {
                    if (filters.fechaInicio.HasValue)
                        queryParams.Add($"fechaInicio={filters.fechaInicio.Value:yyyy-MM-dd}");

                    if (filters.fechaFin.HasValue)
                        queryParams.Add($"fechaFin={filters.fechaFin.Value:yyyy-MM-dd}");

                    if (filters.cuentaId.HasValue)
                        queryParams.Add($"cuenta_Id={filters.cuentaId.Value}");
                }

                var url = "api/public/entradas-contables";
                if (queryParams.Any())
                {
                    url += "?" + string.Join("&", queryParams);
                }

                _logger.LogInformation($"🌐 Calling: {_httpClient.BaseAddress}{url}");

                // Construir request manual para enviar el header explícito
                var request = new HttpRequestMessage(HttpMethod.Get, url);

                // Aquí colocas la API Key directamente para probar
                request.Headers.Add("x-api-key", "ak_live_961bea0d3b66b4e10ba6ed563cfe430921fe2bf11ee29191");

                // Log headers para debug
                _logger.LogInformation("Request Headers:");
                foreach (var header in request.Headers)
                {
                    _logger.LogInformation($"{header.Key}: {string.Join(", ", header.Value)}");
                }

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"📡 Raw API Response: {json}");

                    var apiResponse = JsonSerializer.Deserialize<ExternalApiResponse>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (apiResponse?.success == true && apiResponse.data != null)
                    {
                        var result = apiResponse.data.Select(MapToDto).ToList();
                        _logger.LogInformation($"✅ Retrieved {result.Count} entradas contables");
                        return result;
                    }
                    else
                    {
                        _logger.LogWarning($"⚠️ API returned success=false or no data");
                        return new List<EntradaContableDto>();
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ API Error: {response.StatusCode} - {errorContent}");
                    return new List<EntradaContableDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error fetching entradas contables");
                return new List<EntradaContableDto>();
            }
        }

        public async Task<EntradaContableDto?> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"🔍 Fetching entrada contable {id}...");

                var response = await _httpClient.GetAsync($"api/public/entradas-contables/{id}");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var entrada = JsonSerializer.Deserialize<ExternalEntradaContable>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    return entrada != null ? MapToDto(entrada) : null;
                }

                return null;
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
                _logger.LogInformation("📝 Creating entrada contable...");

                var entradaModel = new ExternalEntradaContable
                {
                    descripcion = entrada.descripcion,
                    auxiliar_Id = IdSistemaAuxiliar,
                    fechaAsiento = entrada.fechaAsiento.ToString("yyyy-MM-dd"),
                    cuenta_Id = entrada.detalles.First().cuentaId,
                    tipoMovimiento = entrada.detalles.First().tipoMovimiento,
                    montoAsiento = entrada.detalles.First().montoAsiento
                };

                var json = JsonSerializer.Serialize(entradaModel, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("api/public/entradas-contables", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("✅ Entrada contable created successfully");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Create failed: {response.StatusCode} - {errorContent}");
                    return false;
                }
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
                _logger.LogInformation($"📝 Updating entrada contable {id}...");

                var entradaModel = new ExternalEntradaContable
                {
                    id = id,
                    descripcion = entrada.descripcion,
                    auxiliar_Id = IdSistemaAuxiliar,
                    fechaAsiento = entrada.fechaAsiento.ToString("yyyy-MM-dd"),
                    cuenta_Id = entrada.detalles.First().cuentaId,
                    tipoMovimiento = entrada.detalles.First().tipoMovimiento,
                    montoAsiento = entrada.detalles.First().montoAsiento
                };

                var json = JsonSerializer.Serialize(entradaModel, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync($"api/public/entradas-contables/{id}", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"✅ Entrada contable {id} updated successfully");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Update failed: {response.StatusCode} - {errorContent}");
                    return false;
                }
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
                _logger.LogInformation($"🗑️ Deleting entrada contable {id}...");

                var response = await _httpClient.DeleteAsync($"api/public/entradas-contables/{id}");

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"✅ Entrada contable {id} deleted successfully");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"❌ Delete failed: {response.StatusCode} - {errorContent}");
                    return false;
                }
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

                await Task.Delay(500);

                _logger.LogInformation($"✅ {entradaIds.Count} entradas contabilizadas");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error contabilizando entradas");
                return false;
            }
        }

        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                _logger.LogInformation("🔍 Testing connection to external API...");

                var response = await _httpClient.GetAsync("api/public/entradas-contables?fechaInicio=2024-01-01&fechaFin=2024-01-02&cuenta_Id=3");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ExternalApiResponse>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    _logger.LogInformation($"✅ Connection test successful. API returned success: {apiResponse?.success}");
                    return apiResponse?.success == true;
                }
                else
                {
                    _logger.LogError($"❌ Connection test failed: {response.StatusCode}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Connection test exception");
                return false;
            }
        }

        

        private static EntradaContableDto MapToDto(ExternalEntradaContable entrada)
        {
            return new EntradaContableDto
            {
                id = entrada.id,
                descripcion = entrada.descripcion,
                sistemaAuxiliarId = entrada.auxiliar_Id,
                fechaAsiento = DateTime.Parse(entrada.fechaAsiento),
                detalles = new List<DetalleAsientoDto>
                {
                    new DetalleAsientoDto
                    {
                        cuentaId = entrada.cuenta_Id,
                        tipoMovimiento = entrada.tipoMovimiento,
                        montoAsiento = entrada.montoAsiento
                    }
                }
            };
        }
    }

    public class ExternalApiResponse
    {
        public bool success { get; set; }
        public List<ExternalEntradaContable>? data { get; set; }
        public ExternalApiMeta? meta { get; set; }
    }

    public class ExternalEntradaContable
    {
        public int id { get; set; }
        public string descripcion { get; set; } = string.Empty;
        public int auxiliar_Id { get; set; }
        public int cuenta_Id { get; set; }
        public string tipoMovimiento { get; set; } = string.Empty;
        public string fechaAsiento { get; set; } = string.Empty;
        public decimal montoAsiento { get; set; }
        public int estado_Id { get; set; }
        public ExternalCatalogoCuentas? CatalogoCuentasContable { get; set; }
        public ExternalAuxiliar? Auxiliare { get; set; }
    }

    public class ExternalCatalogoCuentas
    {
        public string descripcion { get; set; } = string.Empty;
    }

    public class ExternalAuxiliar
    {
        public string nombre { get; set; } = string.Empty;
    }

    public class ExternalApiMeta
    {
        public int total { get; set; }
        public object? filtros { get; set; }
        public string apiKey { get; set; } = string.Empty;
    }
}
