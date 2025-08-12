using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IDepartamentoService
    {
        Task<IEnumerable<DepartamentoDto>> GetAllAsync();
        Task<DepartamentoDto?> GetByIdAsync(int id);
        Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto createDto);
        Task<DepartamentoDto> UpdateAsync(int id, UpdateDepartamentoDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}
