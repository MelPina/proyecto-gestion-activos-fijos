using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IActivoFijoService
    {
        Task<IEnumerable<ActivoFijoDto>> GetAllAsync(string? search = null, int? tipoActivoId = null, int? departamentoId = null, int? estado = null);
        Task<ActivoFijoDto?> GetByIdAsync(int id);
        Task<ActivoFijoDto> CreateAsync(CreateActivoFijoDto createDto);
        Task<ActivoFijoDto> UpdateAsync(int id, UpdateActivoFijoDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<ActivoFijoStatsDto> GetStatsAsync();
    }
}
