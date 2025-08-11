using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IEntradaContableService
    {
        Task<List<EntradaContableDto>?> GetAllAsync(EntradaContableFiltersDto? filters = null);
        Task<EntradaContableDto?> GetByIdAsync(int id);
        Task<bool> CreateAsync(CreateEntradaContableDto entrada);
        Task<bool> UpdateAsync(int id, UpdateEntradaContableDto entrada);
        Task<bool> DeleteAsync(int id);
        Task<bool> ContabilizarAsync(List<int> entradaIds);
    }
}
