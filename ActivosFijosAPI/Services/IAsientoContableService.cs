using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IAsientoContableService
    {
        Task<IEnumerable<AsientoContableDto>> GetAllAsync(string? search = null, int? id = null, DateTime? fechaAsiento = null, string? cuentaContable = null, string? tipoMovimiento = null);
        Task<AsientoContableDto?> GetByIdAsync(int id);
        Task<AsientoContableDto> CreateAsync(CreateAsientoContableDto createDto);
        Task<AsientoContableDto> UpdateAsync(int id, UpdateAsientoContableDto updateDto);
        Task<bool> DeleteAsync(int id);

    }
}
