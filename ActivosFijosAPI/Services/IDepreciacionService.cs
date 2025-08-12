using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Models;

namespace ActivosFijosAPI.Services
{
    public interface IDepreciacionService
    {
        // Búsqueda general
        Task<IEnumerable<DepreciacionDto>> GetAllAsync(
            string? search = null,
            int? id = null,
            int? anio = null,
            int? mes = null,
            int? activoFijoId = null,
            DateTime? fechaAsiento = null,
            string? cuentaCompra = null,
            string? cuentaDepreciacion = null
        );

        Task<DepreciacionDto?> GetByIdAsync(int id);

        // Categorizar y cálculos
        int? CategorizarActivo(int tipoActivoId, string? cuentaDepreciacion);
        decimal? DefinirTasaDepreciacion(int? categoria);
        decimal? CalcularMontoDepreciado(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);
        decimal? CalcularDepreciacionAcumuladaTotalPorActivo(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);

        // CRUD

        // Reportes
        
    
    }
}
