using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface ITipoActivoService
    {
        Task<IEnumerable<TipoActivoDto>> GetAllAsync();
        Task<TipoActivoDto?> GetByIdAsync(int id);
        Task<TipoActivoDto> CreateAsync(CreateTipoActivoDto createDto);
        Task<TipoActivoDto> UpdateAsync(int id, UpdateTipoActivoDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}
