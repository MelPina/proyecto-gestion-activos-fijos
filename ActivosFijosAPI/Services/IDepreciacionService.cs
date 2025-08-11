using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Models;

namespace ActivosFijosAPI.Services
{
    public interface IDepreciacionService
    {
        Task<IEnumerable<DepreciacionDto>> GetAllAsync(string? search = null, int? id = null,int? anio = null, int? mes = null, int? activoFijoId = null, DateTime? fechaAsiento = null, string? cuentaCompra = null, string? cuentaDepreciacion = null);
        Task<DepreciacionDto?> GetByIdAsync(int id);
        int? CategorizarActivo(int tipoActivoId, string? cuentaDepreciacion);
        decimal? DefinirTasaDepreciacion(int? categoria);
        decimal? CalcularMontoDepreciado(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);
        decimal? CalcularDepreciacionAcumulada(ActivoFijo activoFijo, DateTime fechaProceso, int? categoria, decimal? porcentaje);

    
        Task AddAsync(Depreciacion depreciacion);
        Task SaveChangesAsync();
        Task GuardarCalculoAsync(DepreciacionDto dto);
    }
}
