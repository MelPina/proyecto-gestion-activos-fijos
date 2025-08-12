using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IActivoFijoService
    {
        Task<IEnumerable<ActivoFijoDto>> GetAllAsync();
        Task<ActivoFijoDto?> GetByIdAsync(int id);
        Task<ActivoFijoDto> CreateAsync(CreateActivoFijoDto createDto);
        Task<ActivoFijoDto?> UpdateAsync(int id, UpdateActivoFijoDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ActivoFijoDto>> SearchAsync(string searchTerm);
        Task<ActivoFijoStatsDto> GetStatsAsync();
        Task<IEnumerable<ActivoFijoDto>> GetByDepartamentoAsync(int departamentoId);
        Task<IEnumerable<ActivoFijoDto>> GetByTipoActivoAsync(int tipoActivoId);
    }
}
