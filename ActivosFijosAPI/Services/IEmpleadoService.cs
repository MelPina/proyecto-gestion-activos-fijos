using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IEmpleadoService
    {
        Task<IEnumerable<EmpleadoDto>> GetAllAsync(string? search = null, int? departamentoId = null);
        Task<EmpleadoDto?> GetByIdAsync(int id);
        Task<EmpleadoDto> CreateAsync(CreateEmpleadoDto createDto);
        Task<EmpleadoDto> UpdateAsync(int id, UpdateEmpleadoDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<EmpleadoStatsDto> GetStatsAsync();
        Task<bool> ExistsByCedulaAsync(string cedula, int? excludeId = null);
    }
}
