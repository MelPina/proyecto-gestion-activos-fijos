using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioDto>> GetAllAsync();
        Task<UsuarioDto?> GetByIdAsync(int id);
        Task<UsuarioDto?> GetByEmailAsync(string email);
        Task<UsuarioDto> CreateAsync(CreateUsuarioDto createDto);
        Task<UsuarioDto> UpdateAsync(int id, UpdateUsuarioDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        Task<bool> ValidateTokenAsync(string token);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
    }
}
