using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Models;

namespace ActivosFijosAPI.Services
{
    public interface IDepreciacionService
    {
        Task<IEnumerable<DepreciacionDto>> GetAllAsync(string? search = null, int? activofijoId = null, int? tipoactivoId = null);
        Task<DepreciacionDto?> GetByIdAsync(int id);
        int? CategorizarActivo(int tipoActivoId, string? cuentaDepreciacion);
        decimal? DefinirTasaDepreciacion(int? categoria);
        decimal? CalcularMontoDepreciado(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);
        decimal? CalcularDepreciacionAcumulada(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);

        Task<IEnumerable<DepreciacionDto>> GetReporteDepreciacionAsync(int? anio, int? mes, int? activoFijoId, int? ActivoId);
        Task<DepreciacionStatsDto> GetStatsAsync();
        Task<IEnumerable<DepreciacionDto>> GetReporteDepreciacionAsync(int? anio, int? mes, int? tipoActivoId, int? activoId);
        Task AddAsync(Depreciacion depreciacion);
        Task SaveChangesAsync();
        Task GuardarCalculoAsync(DepreciacionDto dto);
    }
}
